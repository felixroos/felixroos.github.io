import { Scale } from '@tonaljs/tonal'

export default (a: string, b: string) => {
  return Scale.get(a).intervals.length - Scale.get(b).intervals.length
}