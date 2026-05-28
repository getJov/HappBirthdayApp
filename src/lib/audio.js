export async function createBlowDetector({ onLevel, onBlow, threshold = 0.34 }) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!navigator.mediaDevices?.getUserMedia || !AudioContext) {
    throw new Error('Microphone input is not supported in this browser.');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  const samples = new Uint8Array(analyser.fftSize);
  source.connect(analyser);

  let animationFrame = 0;
  let hitFrames = 0;
  let stopped = false;

  const tick = () => {
    if (stopped) return;

    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (let index = 0; index < samples.length; index += 1) {
      const value = (samples[index] - 128) / 128;
      sum += value * value;
    }

    const rms = Math.sqrt(sum / samples.length);
    const level = Math.min(1, rms * 4);
    onLevel(level);

    if (level >= threshold) {
      hitFrames += 1;
    } else {
      hitFrames = Math.max(0, hitFrames - 1);
    }

    if (hitFrames >= 3) {
      onBlow();
      return;
    }

    animationFrame = requestAnimationFrame(tick);
  };

  tick();

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();
      onLevel(0);
    },
  };
}
