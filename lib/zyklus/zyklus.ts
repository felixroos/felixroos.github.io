AudioContext.prototype.createCycle = function (
  callback, // called slightly before each cycle
  duration, // duration of each cycle
  interval = duration, // interval between callbacks
  overlap = interval / 2 // overlap between callbacks
) {
  let tick = 0; // counts callbacks
  let phase = 0; // next callback time
  let precision = 10 ** 4; // used to round phase
  let minLatency = 0.01;
  const setDuration = (setter) => (duration = setter(duration));
  overlap = overlap || interval / 2;
  const onTick = () => {
    const t = this.currentTime;
    const lookahead = t + interval + overlap; // the time window for this tick
    if (phase < t) {
      // skip past callbacks?
      // phase = Math.ceil(t / duration) * duration;
      phase = t + minLatency;
    }
    // callback as long as we're inside the lookahead
    while (phase < lookahead) {
      phase = Math.round(phase * precision) / precision;
      callback(phase, duration, tick++);
      phase += duration; // increment phase by duration
    }
  };
  let intervalID;
  const start = () => {
    onTick();
    intervalID = setInterval(onTick, interval * 1000);
  };
  const clear = () => clearInterval(intervalID);
  const pause = () => clear();
  const stop = () => {
    tick = 0;
    phase = 0;
    clear();
  };

  return { setDuration, start, stop, pause, duration };
};
let cycle;

AudioContext.prototype.beep = function (t, duration, tick) {
  const latency = ((t - this.currentTime) * 1000).toFixed(2);
  console.log(tick, t.toFixed(2), duration, latency);
  t += 0.01;
  const o = this.createOscillator();
  const g = this.createGain();
  //o.frequency.value = tick % 4 === 0 ? 440 : 220;
  o.frequency.value = 330;
  o.type = 'triangle';
  o.start(t);
  o.stop(t + duration / 2);
  const end = t + duration / 2;
  o.connect(g);
  const attack = 0.01;
  const release = 0.01;
  const max = 0.8;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(max, t + attack);
  g.gain.setValueAtTime(max, end - release);
  g.gain.linearRampToValueAtTime(0, end);
  g.connect(this.destination);
};

// repeatedly runs callback(begin, end) where each begin is the last end, starting at currentTime
/*AudioContext.prototype.createPulse = function (callback, interval, overlap) {
  let phase = 0;
  overlap = overlap || interval / 2;
  const tick = () => {
    const t = this.currentTime;
    const begin = Math.max(phase, t);
    phase = t + interval + overlap;
    callback(begin, phase);
  };
  tick();
  const intervalID = setInterval(tick, interval * 1000);
  return {
    clear: () => clearInterval(intervalID)
  };
};*/

/*
AudioContext.prototype.createCycle = function (
  callback,
  duration,
  interval = duration,
  overlap = duration / 2
) {
  let tick = 0;
  let phase = 0;
  const setDuration = (setter) => (duration = setter(duration));
  const { clear } = this.createPulse(
    (begin, end) => {
      // what if phase somehow fell behind begin?
      while (phase < end) {
        callback(phase, tick++, duration);
        phase += duration;
      }
    },
    interval,
    overlap
  );
  return { setDuration, clear, duration };
};
*/
/*

on("click", "start", () => {
  const ctx = new AudioContext();
  metronome = ctx.createMetronome(ctx.beep.bind(ctx), 0.2);
});
on("click", "stop", () => metronome?.clear());
on("click", "slower", () => metronome?.setPulse((p) => p * 1.1));
on("click", "faster", () => metronome?.setPulse((p) => p * 0.9));


// repeatedly runs callback(begin, tick, pulse)
// each begin is exactly the given pulse apart
// tick counts up from zero
AudioContext.prototype.createMetronome = function (
  callback,
  pulse,
  interval = pulse,
  overlap = pulse / 2
) {
  let tick = 0;
  const setPulse = (setter) => (pulse = setter(pulse));
  const { clear } = this.createPulse(
    (begin, end) => {
      begin = Math.ceil(begin / pulse) * pulse;
      while (begin < end) {
        callback(begin, tick, pulse);
        begin += pulse;
        tick++;
      }
    },
    interval,
    overlap
  );
  return { setPulse, clear, pulse };
};

*/
