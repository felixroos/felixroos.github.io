const steps = [1, 0, 2, 0, 3, 4, 0, 5, 0, 6, 0, 7];
const notes = ["C", "", "D", "", "E", "F", "", "G", "", "A", "", "B"];
const noteLetters = ["C", "D", "E", "F", "G", "A", "B"];

const accidentalOffset = (accidentals) => {
  return accidentals.split("#").length - accidentals.split("b").length;
};

const accidentalString = (offset) => {
  if (offset < 0) {
    return "b".repeat(-offset);
  }
  if (offset > 0) {
    return "#".repeat(offset);
  }
  return "";
};

const Step = {
  tokenize(step) {
    const [accidentals, stepNumber] = step.match(/^([#b]*)([1-9]+)$/).slice(1);
    return [accidentals, parseInt(stepNumber)];
  },
  accidentals(step) {
    return accidentalOffset(Step.tokenize(step)[0]);
  },
};

Step.tokenize("#11");
Step.tokenize("b13");
Step.tokenize("bb6");
Step.accidentals("3");
Step.accidentals("b3");

const Note = {
  tokenize(note) {
    return [note[0], note.slice(1)];
  },
  accidentals(note) {
    return accidentalOffset(this.tokenize(note)[1]);
  },
};

Note.tokenize("C##");
Note.accidentals("C#");
Note.accidentals("C##");
Note.accidentals("Eb");
Note.accidentals("Bbb");

function transpose(note, step) {
  const stepNumber = Step.tokenize(step)[1];
  const noteLetter = Note.tokenize(note)[0];
  const noteIndex = noteLetters.indexOf(noteLetter);
  const targetNote = noteLetters[(noteIndex + stepNumber - 1) % 8];
  const rootIndex = notes.indexOf(noteLetter);
  const targetIndex = notes.indexOf(targetNote);
  const indexOffset = targetIndex - rootIndex;
  const stepIndex = steps.indexOf(stepNumber);
  const offsetAccidentals = accidentalString(
    Step.accidentals(step) + Note.accidentals(note) + stepIndex - indexOffset
  );
  return [targetNote, offsetAccidentals].join("");
}

transpose("F#", "3");
transpose("C", "3");
transpose("D", "3");
transpose("E", "3");
transpose("Eb", "3");
transpose("Ebb", "3");
