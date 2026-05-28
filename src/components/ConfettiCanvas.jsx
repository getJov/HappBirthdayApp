import { useEffect, useRef } from 'react';

const colors = ['#ffd166', '#ef476f', '#48cae4', '#f8f5ff', '#40c9a2'];

export default function ConfettiCanvas({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const confetti = createConfetti(reducedMotion ? 28 : 110);
    let frame = 0;
    let animationId = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      confetti.forEach((piece) => {
        if (!reducedMotion) {
          piece.x += piece.vx;
          piece.y += piece.vy;
          piece.rotation += piece.spin;
          piece.vy += 0.015;
        }

        if (piece.y > window.innerHeight + 24) {
          piece.y = -24;
          piece.x = Math.random() * window.innerWidth;
          piece.vy = 1 + Math.random() * 2;
        }

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
        context.restore();
      });

      frame += 1;
      if (!reducedMotion || frame < 2) {
        animationId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

function createConfetti(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight - window.innerHeight,
    vx: -1.2 + Math.random() * 2.4,
    vy: 1 + Math.random() * 2.6,
    width: 6 + Math.random() * 8,
    height: 10 + Math.random() * 16,
    rotation: Math.random() * Math.PI,
    spin: -0.1 + Math.random() * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}
