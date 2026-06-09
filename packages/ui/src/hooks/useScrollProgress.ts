import { useState, useEffect } from 'react';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    window.addEventListener('load', fn);
    fn();
    return () => {
      window.removeEventListener('scroll', fn);
      window.removeEventListener('load', fn);
    };
  }, []);

  return progress;
}
