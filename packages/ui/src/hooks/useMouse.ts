import { useState, useEffect } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

export function useMouse(): MousePosition {
  const [m, setM] = useState<MousePosition>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      setM({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return m;
}
