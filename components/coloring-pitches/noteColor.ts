import { TinyColor } from "@ctrl/tinycolor"
import { Note, Collection } from "@tonaljs/tonal"
import { interpolateRainbow, interpolateSinebow } from 'd3-scale-chromatic'

// used in Keyboard.mdx + coloring-pitches.mdx + 2 drafts

export function noteColor(note: string, rotate = 0): TinyColor {
  return new TinyColor({
    h: Math.floor((rotate + (Note.chroma(note) / 12) * 360) % 360),
    s: 100,
    l: 50,
  })
}

export function noteLightness(note: string, offset = 50, factor = 2) {
  return (Note.midi(note) - offset) * factor;
}

export function rainbow(note: string, rotate = 180) {
  return new TinyColor(interpolateRainbow(Note.chroma(note) / 12 + rotate / 360))
}
export function sinebow(note: string, rotate = 180) {
  return new TinyColor(interpolateSinebow(Note.chroma(note) / 12) + rotate / 360)
}

// divide chroma decimal by number of ones to get relative darkness
export function chromaDarkness(chroma) {
  return parseInt(chroma, 2) / (chroma.split('').filter(d => d === '1').join('').length)
}

export function chromaDiff(chromaA, chromaB) {
  const [a, b] = [chromaA, chromaB].map(chroma => chroma.split(''));
  return a.reduce((diff, digit, i) => diff + (digit !== b[i] ? 1 : 0), 0);
}

export function circle(rotation = 0) {
  return Collection.rotate(
    rotation + 6,
    Array.from({ length: 12 }, (_, i) => Note.transposeFifths('C', i - 6))
  );
}

export function harmonicChroma(notes) {
  const chromas = notes.map(note => Note.chroma(note));
  // const circleChromas = circle().map(note => Note.chroma(note));
  const circleChromas = Array.from({ length: 12 }, (_, i) => (i * 5) % 12);
  return circleChromas.reduce((chroma, circleChroma) => chroma + '' + (chromas.includes(circleChroma) ? '1' : '0'), '')
}

export function chromaCenter(chroma) {
  return chroma.split('').reduce((sum, digit, index) => sum + (digit === '1' ? index : 0), 0) / 12;
}