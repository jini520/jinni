// Root app with variation switcher + tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "aurora",
  "dark": true,
  "density": "regular"
}/*EDITMODE-END*/;

function VariantSwitcher({ value, onChange }) {
  const variants = [
    { id: "aurora",    label: "Aurora",    sub: "Glass" },
    { id: "editorial", label: "Editorial", sub: "Brut." },
    { id: "cosmic",    label: "Cosmic",    sub: "Orbit" },
  ];
  return (
    <div className="vs">
      <style>{`
        .vs{ position:fixed; left:50%; bottom:24px; transform:translateX(-50%);
          z-index:2147483600; display:flex; align-items:center; gap:6px;
          padding:6px; border-radius:999px;
          background: rgba(20,20,26,.65); border:1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);
          box-shadow: 0 12px 40px rgba(0,0,0,.4);
          font-family:'Inter','Pretendard',ui-sans-serif,system-ui,sans-serif;
        }
        .vs-lbl{ font-size:10px; letter-spacing:.16em; text-transform:uppercase;
          color:rgba(255,255,255,.45); padding: 0 12px 0 14px; font-family:'JetBrains Mono', ui-monospace, monospace;}
        .vs-btn{ appearance:none; border:0; cursor:default; padding: 9px 16px;
          background: transparent; color: rgba(255,255,255,.6);
          border-radius: 999px; font-size: 12.5px; font-weight: 500;
          display:flex; flex-direction:column; align-items:flex-start; gap:1px;
          line-height: 1.1;
          transition: color .25s, background .25s;
        }
        .vs-btn .sub{ font-size:9px; letter-spacing:.1em; text-transform:uppercase; opacity:.5;
          font-family:'JetBrains Mono', monospace; }
        .vs-btn:hover{ color: rgba(255,255,255,.9); }
        .vs-btn[data-active="1"]{ background: rgba(255,255,255,.96); color: #0a0612; }
        .vs-btn[data-active="1"] .sub{ color: rgba(0,0,0,.5); }
        @media (max-width: 600px){
          .vs-lbl{ display:none; }
          .vs-btn{ padding: 8px 12px; }
          .vs-btn .sub{ display:none; }
        }
      `}</style>
      <span className="vs-lbl">Direction</span>
      {variants.map((v) => (
        <button key={v.id} className="vs-btn"
          data-active={value === v.id ? "1" : "0"}
          onClick={() => onChange(v.id)}>
          <span>{v.label}</span>
          <span className="sub">{v.sub}</span>
        </button>
      ))}
    </div>
  );
}

function ScrollProgress({ accent }) {
  const p = useScrollProgress();
  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, height: 2, zIndex: 2147483500,
      background: 'transparent', pointerEvents:'none'
    }}>
      <div style={{
        height: '100%', width: `${p * 100}%`,
        background: accent || 'linear-gradient(90deg, #c9a4ff, #8ed8ff, #ffc0a0)',
        boxShadow: '0 0 10px rgba(255,255,255,.4)',
        transition: 'width .12s linear'
      }} />
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [transitioning, setTransitioning] = React.useState(false);
  const [shown, setShown] = React.useState(t.variant);

  // Page transition when switching variants
  const onChangeVariant = (next) => {
    if (next === shown) return;
    setTransitioning(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => {
      setShown(next);
      setTweak("variant", next);
      setTimeout(() => setTransitioning(false), 50);
    }, 380);
  };

  const theme = t.dark ? "dark" : "light";
  const Variation =
    shown === "editorial" ? EditorialVariation :
    shown === "cosmic"    ? CosmicVariation :
                            AuroraVariation;

  const progressAccent =
    shown === "editorial" ? "oklch(85% 0.18 92)" :
    shown === "cosmic"    ? "linear-gradient(90deg, oklch(82% 0.16 195), oklch(78% 0.18 280))" :
                            "linear-gradient(90deg, oklch(78% 0.16 320), oklch(82% 0.14 200), oklch(82% 0.13 38))";

  return (
    <React.Fragment>
      <ScrollProgress accent={progressAccent} />

      <div style={{
        position:'relative',
        transition: 'opacity .35s ease, filter .35s ease, transform .5s cubic-bezier(.2,.8,.2,1)',
        opacity: transitioning ? 0 : 1,
        filter: transitioning ? 'blur(8px)' : 'none',
        transform: transitioning ? 'scale(.98)' : 'scale(1)',
      }}>
        <Variation theme={theme} density={t.density} />
      </div>

      {/* Page-transition flash */}
      <div style={{
        position:'fixed', inset:0, zIndex: 2147483400, pointerEvents:'none',
        background: shown === "editorial" ? "#0d0d0c" : shown === "cosmic" ? "#04050a" : "#0a0612",
        opacity: transitioning ? .55 : 0,
        transition: 'opacity .35s ease',
      }} />

      <VariantSwitcher value={shown} onChange={onChangeVariant} />

      <TweaksPanel>
        <TweakSection label="Direction" />
        <TweakRadio label="Variant" value={t.variant}
          options={[
            { value: "aurora", label: "Aurora" },
            { value: "editorial", label: "Editor." },
            { value: "cosmic", label: "Cosmic" },
          ]}
          onChange={(v) => onChangeVariant(v)} />
        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark}
          onChange={(v) => setTweak("dark", v)} />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
