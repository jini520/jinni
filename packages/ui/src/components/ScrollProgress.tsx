import { useScrollProgress } from '../hooks/useScrollProgress';

interface Props {
  accent: string;
}

export function ScrollProgress({ accent }: Props) {
  const p = useScrollProgress();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 8000,
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${p * 100}%`,
          background: accent,
          boxShadow: '0 0 10px rgba(255,255,255,.4)',
          transition: 'width .12s linear',
        }}
      />
    </div>
  );
}
