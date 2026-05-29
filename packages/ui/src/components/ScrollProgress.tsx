import { useEffect, useRef } from 'react';

interface Props {
  accent: string;
}

export function ScrollProgress({ accent }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    window.addEventListener('scroll', fn, { passive: true });
    window.addEventListener('load', fn);
    fn();

    return () => {
      window.removeEventListener('scroll', fn);
      window.removeEventListener('load', fn);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 8000,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          width: '100%',
          background: accent,
          boxShadow: '0 0 10px rgba(255,255,255,.4)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform .12s linear',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
