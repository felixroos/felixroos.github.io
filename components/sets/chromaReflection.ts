export default function chromaReflection(chroma, axis = 0, axisBefore = false) {
  const c = chroma.split('');
  const p = axis % 12;
  for (let i = 0; i < 6; ++i) {
    if (axisBefore) { // axis is before the index => like negative harmony
      let [a, b] = [(i + p) % 12, (11 + p - i) % 12];
      [c[a], c[b]] = [c[b], c[a]];
    } else { // axis is on the index
      let [a, b] = [(i + p) % 12, (12 - i + p) % 12];
      [c[a], c[b]] = [c[b], c[a]];
    }
  }
  return c.join('');
}