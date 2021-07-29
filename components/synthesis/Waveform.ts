// https://www.dspguide.com/ch13/4.htm
export default class Waveform {

  static fixAmplitude(_partials: number[][]) {
    const sum = _partials.reduce((_sum, [f, a]) => _sum + a, 0)
    return _partials.map(([f, a, p], i) => [f, a / sum, p])
  }

  static saw(n: number) {
    const _partials = Array.from({ length: n }, (_, i) => {
      const n = i + 1
      return [
        n,
        1 / (n * Math.PI),
        0,
      ]
    })
    return _partials
  }

  static triangle(n: number) {
    const _partials = Array.from({ length: n }, (_, i) => {
      const n = i + 1;
      return [
        n,
        n % 2 === 0 ? 0 : 4 / Math.pow(n * Math.PI, 2),
        (n - 3) % 4 === 0 ? 180 : 0,
      ]
    });//.filter(([f, a]) => !!a)
    return _partials;
  }

  static square(length: number) {
    const _partials = Array.from({ length }, (_, i) => {
      const n = i + 1
      return [n,
        n % 2 === 0 ? 0 : 2 / (n * Math.PI)/*  * Math.sin(n * Math.PI / 2) */,
        0
      ]
    });//.filter(([f, a]) => !!a)
    return _partials
    //return Waveform.fixAmplitude(_partials)
  }
}