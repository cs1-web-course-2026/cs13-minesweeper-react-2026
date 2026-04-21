import { useState, useEffect } from 'react';

export function useTimer(isActive, resetKey) {
  const [time, setTime] = useState(0);

  useEffect(() => { setTime(0); }, [resetKey]);

  useEffect(() => {
    let interval;
    if (isActive) interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return time;
}