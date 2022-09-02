import { useRef } from 'react';
import { Button } from './Button';
import { beep, ctx, usePlot, work } from './util';

let clockNode;

export function WorkletPlot({ overlap = 0.5, period = 0.1 }) {
  const interval = 128 / ctx.sampleRate;
  const clockRef = useRef<any>();
  const { frame, canvasRef, times } = usePlot({
    overlap,
    period,
    interval,
  });
  const minLatency = 0.01;
  async function run(ctx) {
    const processor = `registerProcessor('tick', class Tick extends AudioWorkletProcessor {
      constructor(...args) {
        super(...args)
        this.port.onmessage = (e) => {
          this.ended = true;
        }
      }
      process (inputs, outputs) {
        this.port.postMessage('tick');
        return !this.ended;
      }
    })`;
    const blob = new Blob([processor], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    await ctx.audioWorklet.addModule(url);
    clockNode = new AudioWorkletNode(ctx, 'tick');
    let phase;
    let last;
    clockNode.port.onmessage = () => {
      phase = phase || ctx.currentTime;
      while (phase < ctx.currentTime + interval + overlap) {
        phase >= ctx.currentTime && beep(phase + minLatency, period * 0.5);
        phase += period;
      }
      times.current.push(ctx.currentTime);
    };
    return clockNode;
  }
  return (
    <>
      <Button
        onClick={async () => {
          clockRef.current = await run(ctx);
          frame.start();
        }}
      >
        play
      </Button>
      <Button
        onClick={() => {
          frame.stop();
          if (clockRef.current) {
            console.log('stop', clockRef.current);
            clockRef.current.port.postMessage('stop');
          }
        }}
      >
        <span>stop</span>
      </Button>
      <Button onClick={() => work(2000)}>
        <span>do light work</span>
      </Button>
      <Button onClick={() => work(3000)}>
        <span>do hard work</span>
      </Button>
      <canvas width="750" height="500" className="max-w-full" ref={canvasRef} />
    </>
  );
}
