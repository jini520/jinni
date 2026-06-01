import type { Variant } from '@jinni/types';
import './variant-switcher.scss';

const VARIANTS: { id: Variant; label: string; sub: string }[] = [
  { id: 'aurora',    label: 'Aurora',    sub: 'Glass' },
  { id: 'editorial', label: 'Editorial', sub: 'Brut.' },
  { id: 'cosmic',    label: 'Cosmic',    sub: 'Orbit' },
];

interface Props {
  value: Variant;
  onChange: (v: Variant) => void;
}

export function VariantSwitcher({ value, onChange }: Props) {
  return (
    <div className="vs">
      <span className="vs-lbl">Direction</span>
      {VARIANTS.map((v) => (
        <button
          key={v.id}
          className="vs-btn"
          data-active={value === v.id ? '1' : '0'}
          onClick={() => onChange(v.id)}
        >
          <span>{v.label}</span>
          <span className="vs-sub">{v.sub}</span>
        </button>
      ))}
    </div>
  );
}
