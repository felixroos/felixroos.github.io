// wavetable-processor.js
class WaveTableProcessor extends AudioWorkletProcessor {
  head = 0;
  frequency = 440;
  inverseSampleRate = 1 / 44100;
  wavetableLength = 512;
  wavetable = [];
  constructor() {
    super();
    // square
    // for (let i = 0; i < this.wavetableLength; i++) {
    //   this.wavetable.push(i < this.wavetableLength / 2 ? -1 : 1);
    // }
    // triangle
    // for (let i = 0; i < this.wavetableLength; i++) {
    //   this.wavetable.push(
    //     i < this.wavetableLength / 2 ? -1 + (2 * i) / this.wavetableLength : -1 + 2 * (1 - i / this.wavetableLength)
    //   );
    // }
    // saw
    for (let i = 0; i < this.wavetableLength; i++) {
      this.wavetable.push(-1 + (2 * i) / (this.wavetableLength - 1));
    }
    // console.log('wavetable', this.wavetable);
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    this.frequency = parameters['frequency'];

    for (let i = 0; i < output[0].length; i++) {
      this.head = (this.head + this.wavetableLength * this.frequency * this.inverseSampleRate) % this.wavetableLength;
      output.forEach((channel) => {
        channel[i] = this.wavetable[Math.floor(this.head)];
      });
    }
    return true;
  }
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: 220,
        minValue: 10,
        maxValue: 10000,
        automationRate: 'k-rate',
      },
    ];
  }
}
registerProcessor('wavetable-processor', WaveTableProcessor);
