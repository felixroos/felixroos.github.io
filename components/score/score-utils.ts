import Vex from 'vexflow';
import { Note } from '@tonaljs/tonal';
import { Rhythm } from 'rhythmical';
import { NestedRhythm } from 'rhythmical/lib/Rhythm';

const VF = Vex.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

export declare interface ScoreProps {
  staves?: any[];
  clef?: 'treble' | 'bass';
  timeSignature?: string;
  width?: number;
  height?: number;
  renderer?: any;
  container?: any;
}

export function renderScore({
  staves = [],
  clef = 'treble',
  timeSignature = '4/4',
  width = 450,
  height = 150,
  renderer,
  container
}: ScoreProps) {
  const clefWidth = 30;
  const timeWidth = 30;
  renderer = renderer || new Renderer(container, Renderer.Backends.SVG)
  renderer.resize(width, height);
  const context = renderer.getContext();
  context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');
  const clefAndTimeWidth =
    (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
  const staveWidth = (width - clefAndTimeWidth) / staves.length - 1;

  let currX = 0;
  let allNotes = [];
  let allProcessedNotes = [];
  staves.map(stave => Array.isArray(stave) ? { notes: stave } : stave)
    .forEach(({ notes, setBegBarType, setEndBarType }:
      { notes: any[], setBegBarType: Vex.Flow.Barline.type, setEndBarType: Vex.Flow.Barline.type }
      , i) => {
      const stave = new Stave(currX, 0, staveWidth);
      if (i === 0) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
      }
      if (setBegBarType) {
        stave.setBegBarType(VF.Barline.type[setBegBarType] as any);
      }
      if (setEndBarType) {
        stave.setEndBarType(VF.Barline.type[setEndBarType] as any);
      }
      const getVexFlowKey = (key) => key.includes('/')
        ? key
        : `${Note.get(key).pc}/${Note.get(key).oct}`
      currX += stave.getWidth();
      stave.setContext(context).draw();
      allNotes = allNotes.concat(notes);
      const processedNotes = notes
        .map((note) => (typeof note === 'string' ? { key: note } : note))
        .map((note) =>
          Array.isArray(note) ? { key: note[0], duration: note[1] } : note
        )
        .map(({ key, keys, duration = 'q', style }) => {
          keys = key ? [key] : keys;
          const note = new StaveNote({
            keys: keys.map(key => getVexFlowKey(key)),
            duration: String(duration)
          });
          if (note['dots']) {
            note.addDotToAll();
          }
          if (style) {
            note.setKeyStyle(0, style)
          }
          keys.forEach((key, index) => {
            const accidentals = Note.accidentals(key.replace('/', ''));
            if (accidentals) {
              note.addAccidental(index, new VF.Accidental(accidentals));
            }
          });
          return note;
        });
      allProcessedNotes = allProcessedNotes.concat(processedNotes);
      const beams = VF.Beam.generateBeams(processedNotes, {
        // groups: [new Vex.Flow.Fraction(1, 4), new Vex.Flow.Fraction(1, 2)]
        // this does not really work proficiently => wrong grouping
      });
      // TBD: use Voice
      Formatter.FormatAndDraw(context, stave, processedNotes);
      beams.forEach(function (b) {
        b.setContext(context).draw();
      });
      allNotes.concat(processedNotes);
    });

  const ties = allProcessedNotes.map((note, index) =>
    !index || !allNotes[index].tie
      ? null
      : new VF.StaveTie({
        first_note: allProcessedNotes[index - 1],
        last_note: allProcessedNotes[index],
        first_indices: [0],
        last_indices: [0]
      })
  );
  ties.forEach(function (t) {
    t && t.setContext(context).draw();
  });
}

export function rhythmicalScore(rhythm: NestedRhythm<string>) {
  return Rhythm.render(rhythm, rhythm.length)
    .map((e) => ([e.value, Math.floor(e.time), 1 / e.duration]))
    .reduce((groups: any[][], [note, bar, duration]) => {
      let tie = false;
      if (note === '_') {
        let lastNote;
        if (groups.length && groups[groups.length - 1].length) {
          const lastGroup = groups[groups.length - 1];
          lastNote = lastGroup[lastGroup.length - 1];
        }
        note = lastNote ? lastNote.key : 'r';
        tie = lastNote ? true : false;
      }
      if (!groups.length || bar > groups.length - 1) {
        groups.push([]);
      }
      if (duration === 4) {
        duration = 'q';
      }
      if (note === 'r') {
        duration = duration + 'r';
        note = 'b4';
      }
      groups[groups.length - 1].push({ key: note, duration, tie });
      return groups;
    }, []);
}