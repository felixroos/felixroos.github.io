import { Scale } from '@tonaljs/tonal';

export default (families) => (scale) =>
  families.map((f) => Scale.get(f).normalized).includes(Scale.get(scale).normalized);