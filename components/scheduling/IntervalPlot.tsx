import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { beep, ctx, usePlot, work } from './util';

export function IntervalPlayground() {
  const [interval, setInterval] = useState(0.5);
  const [overlap, setOverlap] = useState(0.25);
  const [period, setPeriod] = useState(0.5);
  return (
    <>
      <div className="flex justify-start">
        <label>
          period {period.toFixed(2)}
          <br />
          <input
            type="range"
            value={period}
            min={0.05}
            max={2}
            step={0.1}
            onChange={(e) => setPeriod(Number(e.target.value))}
          />
        </label>
        <label>
          interval {interval.toFixed(2)}
          <br />
          <input
            type="range"
            value={interval}
            min={0.05}
            max={2}
            step={0.1}
            onChange={(e) => setInterval(Number(e.target.value))}
          />
        </label>
        <label>
          overlap {overlap.toFixed(2)}
          <br />
          <input
            type="range"
            value={overlap}
            min={0}
            max={2}
            step={0.1}
            onChange={(e) => setOverlap(Number(e.target.value))}
          />
        </label>
      </div>
      <IntervalPlot
        interval={interval}
        overlap={overlap}
        period={period}
        hideOutput={false}
      />
    </>
  );
}

export function IntervalPlot({
  overlap = 0,
  period = 0.5,
  interval,
  hideOutput,
}) {
  interval = interval || period;
  const intervalRef = useRef<any>();
  const { frame, times, canvasRef } = usePlot({
    overlap,
    period,
    interval,
    hideOutput,
  });
  useEffect(() => {
    // times.current = [];
    if (intervalRef.current) {
      run();
    }
  }, [interval, period, overlap]);

  function run() {
    frame.start();
    let phase;
    let minLatency = 0.01;
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      times.current.push(ctx.currentTime);
      if (!hideOutput) {
        phase = phase || ctx.currentTime;
        while (phase < ctx.currentTime + interval + overlap) {
          phase >= ctx.currentTime && beep(phase + minLatency, period * 0.5);
          phase += period;
        }
      } else {
        beep(ctx.currentTime + minLatency, period * 0.5);
      }
    }, interval * 1000);
  }
  return (
    <>
      <Button onClick={() => run()}>
        <span>play</span>
      </Button>
      <Button
        onClick={() => {
          times.current = [];
          clearInterval(intervalRef.current);
          frame.stop();
          delete intervalRef.current;
        }}
      >
        stop
      </Button>
      <Button onClick={() => work(2000)}>
        <span>do light work</span>
      </Button>
      <Button onClick={() => work(3000)}>
        <span>do hard work</span>
      </Button>
      <canvas width="750" height="500" ref={canvasRef} className="max-w-full" />
    </>
  );
}
