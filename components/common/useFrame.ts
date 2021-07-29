import React, { useRef, useState } from "react"

export default function useFrame(callback, autostart = false) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const stopTimeRef = useRef<number>(0);
  const maxTimeRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(autostart);

  const animate = time => {
    if (!startTimeRef.current) {
      startTimeRef.current = time;
    }
    if (previousTimeRef.current != undefined) {
      const delta = time - previousTimeRef.current
      const fromStart = time - startTimeRef.current;
      const last = maxTimeRef.current && fromStart >= maxTimeRef.current;
      callback({
        time,
        delta,
        fromStart,
        last,
        fromFirstStart: fromStart + stopTimeRef.current,
        stopTime: stopTimeRef.current,
        progress: maxTimeRef.current ? fromStart / maxTimeRef.current : 0
      });
      if (last) {
        stop();
        maxTimeRef.current = null;
        return;
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  function start(maxTime?) {
    if (isRunning) {
      stop();
    }
    if (maxTime) {
      maxTimeRef.current = maxTime;
    }
    requestRef.current = requestAnimationFrame(animate);
    setIsRunning(true);
  }

  function stop() {
    if (previousTimeRef.current && startTimeRef.current) {
      stopTimeRef.current = previousTimeRef.current - startTimeRef.current + stopTimeRef.current;
    }
    cancelAnimationFrame(requestRef.current);
    startTimeRef.current = 0;
    requestRef.current = null;
    setIsRunning(false)
  }
  function toggle() {
    if (!requestRef.current) {
      start()
    } else {
      stop();
    }
  }

  React.useEffect(() => {
    autostart && start();
    return () => stop() // TODO: cancelAnimationFrame
  }, []); // Make sure the effect runs only once
  return { start, stop, toggle, isRunning };
}
