import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const outputPath = 'public/audio/happy-birthday.wav';
const sampleRate = 44100;
const amplitude = 0.22;
const notes = [
  ['G4', 0.28],
  ['G4', 0.28],
  ['A4', 0.56],
  ['G4', 0.56],
  ['C5', 0.56],
  ['B4', 1.08],
  ['G4', 0.28],
  ['G4', 0.28],
  ['A4', 0.56],
  ['G4', 0.56],
  ['D5', 0.56],
  ['C5', 1.08],
  ['G4', 0.28],
  ['G4', 0.28],
  ['G5', 0.56],
  ['E5', 0.56],
  ['C5', 0.56],
  ['B4', 0.56],
  ['A4', 1.1],
  ['F5', 0.28],
  ['F5', 0.28],
  ['E5', 0.56],
  ['C5', 0.56],
  ['D5', 0.56],
  ['C5', 1.4],
];

const frequencies = {
  G4: 392,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

const samples = [];

for (const [name, seconds] of notes) {
  const frequency = frequencies[name];
  const count = Math.floor(seconds * sampleRate);
  const releaseStart = Math.floor(count * 0.82);

  for (let index = 0; index < count; index += 1) {
    const time = index / sampleRate;
    const attack = Math.min(1, index / 900);
    const release = index > releaseStart ? Math.max(0, (count - index) / (count - releaseStart)) : 1;
    const envelope = attack * release;
    const base = Math.sin(2 * Math.PI * frequency * time);
    const harmonic = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.16;
    samples.push((base + harmonic) * amplitude * envelope);
  }

  const gap = Math.floor(0.035 * sampleRate);
  for (let index = 0; index < gap; index += 1) {
    samples.push(0);
  }
}

const dataSize = samples.length * 2;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

samples.forEach((sample, index) => {
  const value = Math.max(-1, Math.min(1, sample));
  buffer.writeInt16LE(Math.round(value * 32767), 44 + index * 2);
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, buffer);
console.log(`Generated ${outputPath}`);
