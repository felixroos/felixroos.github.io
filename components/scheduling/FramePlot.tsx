import { Button } from './Button';
import { beep, ctx, usePlot, work } from './util';

let phase;
let minLatency = 0.01;
export function FramePlot({ overlap = 0, interval, period = 0.5, hideOutput }) {
  const { frame, canvasRef } = usePlot({
    overlap,
    period,
    hideOutput,
    interval,
    onFrame: (times) => {
      times.current.push(ctx.currentTime);
      phase = phase || ctx.currentTime;
      while (phase < ctx.currentTime + period + overlap) {
        phase >= ctx.currentTime && beep(phase + minLatency, period * 0.5);
        phase += period;
      }
    },
  });
  return (
    <>
      <Button
        onClick={() => {
          frame.start();
        }}
      >
        <span>play</span>
      </Button>
      <Button
        onClick={() => {
          frame.stop();
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
      <canvas width="750" height="500" ref={canvasRef} />
    </>
  );
}
