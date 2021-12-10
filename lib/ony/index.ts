export const steps = [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6];
export const stepNumbers = [0, 1, 2, 3, 4, 5, 6];
export const notes = ['C', '', 'D', '', 'E', 'F', '', 'G', '', 'A', '', 'B'];
export const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const accidentalOffset = (accidentals) => {
  return accidentals.split('#').length - accidentals.split('b').length;
};

export const accidentalString = (offset) => {
  if (offset < 0) {
    return 'b'.repeat(-offset);
  }
  if (offset > 0) {
    return '#'.repeat(offset);
  }
  return '';
};




