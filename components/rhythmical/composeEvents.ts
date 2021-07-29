import { RhythmEvent } from './util';

export default function composeEvents<T>(
  sources: RhythmEvent<T>[],
  targets: RhythmEvent<T>[],
  mergeFn: (source: RhythmEvent<T>, target: RhythmEvent<T>) => RhythmEvent<T> | undefined
): RhythmEvent<T>[] {
  let out = [];
  sources.forEach(source => {
    targets.forEach(target => {
      if (target.time >= source.time && target.time + target.duration <= source.time + source.duration) {
        const event = mergeFn(source, target);
        if (event) {
          out.push(event);
        }
      }
    });
  });
  return out;
}