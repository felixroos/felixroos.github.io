import { Note } from '@tonaljs/tonal';

export default (notes: string[]) => notes.reduce((accs, note) => Math.abs(Note.get(note).alt) + accs, 0);