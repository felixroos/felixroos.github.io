import { Note } from '@tonaljs/tonal';

export function enharmonicEquivalent(note: string, pitchClass: string): string {
  const { alt, letter } = Note.get(pitchClass);
  let { oct } = Note.get(note);
  const letterChroma = Note.chroma(letter) + alt;
  if (letterChroma > 11) {
    oct--;
  } else if (letterChroma < 0) {
    oct++;
  }
  return pitchClass + oct;
}