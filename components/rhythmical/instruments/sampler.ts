
import { Interval, Note } from '@tonaljs/tonal';
import * as Tone from 'tone';

export function sampler(samples, options = {}) {
  return () => new Promise<any>((resolve/* , reject */) => {
    // console.log('init sampler samples: ', samples.length);
    options = {
      volume: -12, attack: 0.01, ...options, onload: () => {
        resolve(s);
      }
    }
    const sampler = new Tone.Sampler(samples, options);
    const s = {
      triggerAttackRelease: (note, duration, time?, velocity?) => {
        if (typeof note === 'number') {
          sampler.triggerAttackRelease(note, duration, time, velocity);
          return;
        }
        if (options['transpose']) {
          note = Note.transpose(note, Interval.fromSemitones(options['transpose']));
        }
        sampler.triggerAttackRelease(Note.simplify(note), duration, time, velocity);
      },
      triggerAttack: sampler.triggerAttack,
      triggerRelease: sampler.triggerAttack,
      connect: (dest) => { sampler.connect(dest); return s },
      toMaster: () => { sampler.toDestination(); return s },
      toDestination: () => { sampler.toDestination(); return s },
    }
  })
}