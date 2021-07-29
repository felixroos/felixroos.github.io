const d = (e) => { // duration short notation
  const [value, duration] = e.split('*');
  if (duration) {
    return { sequential: [value], duration: parseInt(duration) };
  }
  return value;
}
const s = (str, duration = 1) => ({ sequential: str.split(' ').map(d), duration }); // sequential short notation
const p = (str, duration = 1) => ({ parallel: str.split(' ').map(d), duration }); // parallel short notation
const w = (str) => ['r', 'r', [p(str),'r'], [p(str),'r']]; // reggae chord comping

export default {
  name: 'Swimming (Straight 8ths)',
  composer: 'Koji Kondo',
  duration: 62,
  parallel: [
    {
      description: 'melody',
      velocity: 1,
      sequential: [
        d('r*3'),
        ['A5', s('F5*3 C5'), s('D5*3 F5'), 'F5'],
        [s('C5*3 F5'), s('F5*3 C6'), 'A5', 'G5'],
        ['A5', s('F5*3 C5'), s('D5*3 F5'), 'F5'],
        [s('C5*3 F5'), s('Bb5*2 A5 G5'), d('F5*2')],
        ['A5', s('F5*3 C5'), s('D5*3 F5'), 'F5'],
        [s('C5*3 F5'), s('F5*3 C6'), 'A5', 'G5'],
        ['A5', s('F5*3 C5'), s('D5*3 F5'), 'F5'],
        [s('C5*3 F5'), s('Bb5*2 A5 G5'), d('F5*2')],
        ['A5', s('F5*3 C5'), 'A5', 'F5'],
        ['Ab5', s('F5*3 Ab5'), d('G5*3')],
        ['A5', s('F5*3 C5'), 'A5', 'F5'],
        ['Ab5', s('F5*3 C5'), d('C6*3')],
        ['A5', s('F5*3 C5'), s('D5*3 F5'), 'F5'],
        [s('C5*3 F5'), s('Bb5*2 A5 G5'), d('F5*2')]
      ]
    },
    {
      description: 'chords',
      velocity: 0.1,
      sequential: [
        [
          p('F4 Bb4 D5'),
          [p('D4 G4 Bb4'), p('Bb3 D4 F4')],
          [p('G3 C4 E4'), [p('Ab3 F4'), p('A3 Gb4')]],
          p('Bb3 E4 G4')
        ],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 Bb3 Db3')],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('A3 C4 E4'), w('Ab3 C4 Eb4'), w('F3 Bb3 D3'), w('G3 C4 E4')],
        [w('F3 A3 C4'), w('F3 A3 C4'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('F3 Bb3 D4'), w('F3 Bb3 C4'), w('F3 A3 C4'), w('F3 A3 C4')],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('A3 C4 E4'), w('Ab3 C4 Eb4'), w('F3 Bb3 D3'), w('G3 C4 E4')],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('F3 Bb3 D4'), w('F3 Bb3 C4'), w('F3 A3 C4'), w('F3 A3 C4')],
        [w('Bb3 D3 F4'), w('Bb3 D3 F4'), w('A3 C4 F4'), w('A3 C4 F4')],
        [w('Ab3 B3 F4'), w('Ab3 B3 F4'), w('G3 Bb3 F4'), w('G3 Bb3 E4')],
        [w('Bb3 D3 F4'), w('Bb3 D3 F4'), w('A3 C4 F4'), w('A3 C4 F4')],
        [w('Ab3 B3 F4'), w('Ab3 B3 F4'), w('G3 Bb3 F4'), w('G3 Bb3 E4')],
        [w('F3 A3 C3'), w('F3 A3 C3'), w('F3 Bb3 D3'), w('F3 B3 D3')],
        [w('F3 Bb3 D4'), w('F3 Bb3 C4'), w('F3 A3 C4'), w('F3 A3 C4')]
      ]
    },
    {
      description: 'bass',
      sequential: [
        ['G3', 'G3', 'C3', 'E3'],
        ['F2', 'D2', 'G2', 'C2'],
        ['F2', 'D2', 'G2', 'C2'],
        ['F2', 'A2', 'Bb2', 'B2'],
        ['A2', 'Ab2', 'G2', 'C2'],
        ['F2', 'A2', 'Bb2', 'B2'],
        ['G2', 'C2', 'F2', 'F2'],
        ['F2', 'A2', 'Bb2', 'B2'],
        ['A2', 'Ab2', 'G2', 'C2'],
        ['F2', 'A2', 'Bb2', 'B2'],
        ['G2', 'C2', 'F2', 'F2'],
        ['Bb2', 'Bb2', 'A2', 'A2'],
        ['Ab2', 'Ab2', 'G2', ['C2', 'D2', 'E2']],
        ['Bb2', 'Bb2', 'A2', 'A2'],
        ['Ab2', 'Ab2', 'G2', ['C2', 'D2', 'E2']],
        ['F2', 'A2', 'Bb2', 'B2'],
        ['G2', 'C2', 'F2', 'F2']
      ]
    }
  ]
}