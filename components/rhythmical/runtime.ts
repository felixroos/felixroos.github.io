import { rhythmEvents } from './tree/hierarchy';
import { flatEvents } from './tree/walker';
import { renderEvents } from './tree/RhythmZipper';
import { renderRhythm } from './rhythmical';
import tetris from './tunes/tetris';

function runtime(fn) {
  const t0 = performance.now()
  const result = fn();
  const t1 = performance.now()
  console.log('result', result);
  return t1 - t0;
}

function test() {
  const d3Time = runtime(() => rhythmEvents(tetris))
  console.log('d3Time', d3Time);
  const superTime = runtime(() => flatEvents(tetris))
  console.log('superTime', superTime);
  const newTime = runtime(() => renderEvents(tetris))
  console.log('newTime', newTime);
  const oldTime = runtime(() => renderRhythm(tetris))
  console.log('oldTime', oldTime);
}

// test();
