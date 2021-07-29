import WebMidi, { Output } from 'webmidi';
import * as Tone from 'tone';
import enableWebMidi from '../../midi/enableWebMidi';

export function midi(outputName, channel) {
  return () => new Promise((resolve, reject) => {
    enableWebMidi().then(() => {
      if (WebMidi.outputs.length === 0) {
        throw new Error('No output found...');
      }
      const output = WebMidi.getOutputByName(outputName) as Output;
      const s = {
        triggerAttackRelease: (note, duration, time?, velocity?) => {
          // https://github.com/Tonejs/Tone.js/issues/805#issuecomment-748172477
          const timingOffset = WebMidi.time - Tone.context.currentTime * 1000
          time = time * 1000 + timingOffset;
          output?.playNote(note, channel, { time, duration: duration * 1000 - 5, velocity: 0.5 });
        },
        connect: (dest) => { return s },
        toMaster: () => { return s },
      }
      // onload(instrument)
      resolve(s);
    }).catch(() => {
      throw new Error('Web Midi could not be enabled...');
    });
  })
}
