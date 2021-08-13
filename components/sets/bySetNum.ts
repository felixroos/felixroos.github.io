import { Scale } from '@tonaljs/tonal';

export default (a: string, b: string) => {
  return Scale.get(a).setNum - Scale.get(b).setNum;
}