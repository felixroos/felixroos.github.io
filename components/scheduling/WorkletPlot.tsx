let clockNode;

async function register(ctx) {
  console.log('regiser');
  // create/register AudioWorkletProcessor
  const processor = `registerProcessor('tick', class Tick extends AudioWorkletProcessor {
  process () {
    this.port.postMessage('tick');
    return true;
  }
})`;
  const blob = new Blob([processor], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  let last;
  await ctx.audioWorklet.addModule(url);
  clockNode = new AudioWorkletNode(ctx, 'tick');
  clockNode.port.onmessage = (e) => {
    // const t = e.timeStamp;
    const t = ctx.currentTime;
    if (!last || t - last > 0) {
      const diff = last ? t - last : 0;
      console.log('diff', (diff * 1000).toFixed(6), 'ms');
    }
    // console.log('tick', ctx.currentTime);
    last = t;
  };
}

export function WorkletPlot() {
  return (
    <button
      onClick={() => {
        const ctx = new AudioContext();
        register(ctx);
      }}
    >
      ok
    </button>
  );
}
