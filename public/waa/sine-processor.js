// sine-processor.js
class SineProcessor extends AudioWorkletProcessor {
  phase = 0;
  frequency = 440;
  inverseSampleRate = 1 / 44100;
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    this.frequency = parameters['frequency'];

    for (let i = 0; i < output[0].length; i++) {
      const out = Math.sin(this.phase);
      this.phase += 2 * Math.PI * this.frequency * this.inverseSampleRate;
      output.forEach((channel) => {
        channel[i] = out;
      });
    }
    return true;
  }
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: 220,
        minValue: 55,
        maxValue: 10000,
        automationRate: 'k-rate',
      },
    ];
  }
}
registerProcessor('sine-processor', SineProcessor);
