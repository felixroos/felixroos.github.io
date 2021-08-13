export class Step {
  static from(step: string | number) {
    if (typeof step === 'number' && step < 0) {
      step = 'b' + (step * -1);
    }
    return step + ''; // to string
  }
  static fromInterval(interval, min = false) {
    const step = steps[interval] || [];
    if (min) {
      return step[1] || step[0] || 0;
    }
    return step[0] || 0;
  }
  /** Returns interval from step */
  static toInterval(step: string | number) {
    step = Step.from(step);
    const interval = Object.keys(steps)
      .find(i => steps[i].includes(step));
    if (!interval) {
      // console.warn(`step ${step} has no defined inteval`);
    }
    return interval;
  }
}

export const steps = {
  '1P': ['1', '8'],
  '2m': ['b9', 'b2'],
  '2M': ['9', '2',],
  '2A': ['#9', '#2'],
  '3m': ['b3'],
  '3M': ['3'],
  '4P': ['11', '4'],
  '4A': ['#11', '#4'],
  '5d': ['b5'],
  '5P': ['5'],
  '5A': ['#5'],
  '6m': ['b13', 'b6'],
  '6M': ['13', '6'],
  '7m': ['b7'],
  '7M': ['7', '^7', 'maj7']
};