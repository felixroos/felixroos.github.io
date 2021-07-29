import * as Tone from 'tone';

//TBD add transpose option for keys

export function rack(samples: { [key: string]: any }, options = {}) {
  return () => new Promise<any>((resolve, reject) => {
    let s;
    options = {
      volume: -12, attack: 0.01, ...options, onload: () => {
        resolve(s);
      }
    }
    let players = new Tone.Players(samples, options);
    s = {
      customSymbols: Object.keys(samples),
      triggerAttackRelease: (key, duration, time, velocity) => {
        if (!players.has(key)) {
          console.warn(`key ${key} not found for playback`);
          return;
        }
        const player = players.player(key); // TODO: rename to players
        player.start(time);
        player.stop(time + duration);
      },
      connect: (dest) => { players.connect(dest); return s },
      toMaster: () => { players.toDestination(); return s }, // TODO: rename toDestination
      toDestination: () => { players.toDestination(); return s }, // TODO: rename toDestination
    }
  })
}