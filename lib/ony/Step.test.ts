import Step from './Step';

test('step', () => {
  // name
  expect(Step('5').name).toEqual('5');
  expect(Step('-b3').name).toEqual('-b3');
  // index
  expect(Step('b3').index).toEqual(2);
  expect(Step('-b3').index).toEqual(2);
  expect(Step('6').index).toEqual(5);
  // steps
  expect(Step('b3').steps).toEqual(2);
  expect(Step('-b3').steps).toEqual(-2);
  expect(Step('-4').steps).toEqual(-3);
  expect(Step('1').steps).toEqual(0);
  expect(Step('6').steps).toEqual(5);
  // number
  expect(Step('1').number).toEqual(1);
  expect(Step('b2').number).toEqual(2);
  expect(Step('3').number).toEqual(3);
  expect(Step('9').number).toEqual(9);
  // semitones
  expect(Step('b3').semitones).toEqual(3);
  expect(Step('-b3').semitones).toEqual(-3);
  expect(Step('5').semitones).toEqual(7);
  expect(Step('-4').semitones).toEqual(-5);
  expect(Step('-b6').semitones).toEqual(-8);
  // semitones >= 12
  expect(Step('8').semitones).toEqual(12);
  expect(Step('9').semitones).toEqual(14);
  expect(Step('b9').semitones).toEqual(13);
  expect(Step('#11').semitones).toEqual(18);
  // tokens
  expect(Step('-b3').tokens).toEqual(['-', 'b', 3]);
  expect(Step('#11').tokens).toEqual(['', '#', 11]);
  expect(Step('b13').tokens).toEqual(['', 'b', 13]);
  expect(Step('bb6').tokens).toEqual(['', 'bb', 6]);
  expect(Step('8').tokens).toEqual(['', '', 8]);
  // accidentals
  expect(Step('#11').accidentals.offset).toEqual(1);
  expect(Step('3').accidentals.offset).toEqual(0);
  expect(Step('b3').accidentals.offset).toEqual(-1);
  expect(Step('bb7').accidentals.offset).toEqual(-2);
  // transpose
  expect(Step('b3').transpose('3').name).toEqual('5');
  expect(Step('b3').transpose('3').transpose('b3').name).toEqual('b7');
  expect(Step('b3').transpose('b3').name).toEqual('b5');
  expect(Step('2').transpose('b7').name).toEqual('8');
  expect(Step('2').transpose('8').name).toEqual('9');
  expect(Step('-b3').transpose('8').name).toEqual('6');
  expect(Step('-b5').transpose('8').name).toEqual('#4');
  expect(Step('b3').transpose('b3').name).toEqual('b5');
  expect(Step('1').transpose('-4').name).toEqual('-4');
  expect(Step('8').transpose('-4').name).toEqual('5');
  expect(Step('-8').transpose('-8').name).toEqual('-15');
  expect(Step('8').transpose('8').name).toEqual('15');
  // abs
  expect(Step('-6').abs.name).toEqual('6');
  // invert
  expect(Step('b3').invert().name).toEqual('-6');
  expect(Step('3').invert().name).toEqual('-b6');
  expect(Step('-b6').invert().name).toEqual('3');
  expect(Step('-6').invert().name).toEqual('b3');
});
