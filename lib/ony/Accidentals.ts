const Accidentals = (accidentals: string | number) => ({
  get offset() {
    if (typeof accidentals === 'number') {
      return accidentals;
    }
    return accidentals.split('#').length - accidentals.split('b').length;
  },
  stringify() {
    if (typeof accidentals === 'string') {
      return accidentals;
    }
    const offset = this.offset;
    if (offset < 0) {
      return 'b'.repeat(-offset);
    }
    if (offset > 0) {
      return '#'.repeat(offset);
    }
    return '';
  },
});

export default Accidentals;
