import canUseDOM from '../components/canUseDOM'
import { sampler } from '../components/rhythmical/instruments/sampler';

export default {
  load: async () => {
    const samples = {
      C1: "../samples/piano/C1.mp3",
      C2: "../samples/piano/C2.mp3",
      C3: "../samples/piano/C3.mp3",
      C4: "../samples/piano/C4.mp3",
      C5: "../samples/piano/C5.mp3",
      C6: "../samples/piano/C6.mp3",
      C7: "../samples/piano/C7.mp3",
    }
    return canUseDOM() && (await sampler(samples, { volume: -20 })()).toDestination();
  }
}