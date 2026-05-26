// COSMIC ORBIT — variation 3
// Deep space + CSS 3D orbiting sphere + particle field + terminal-luxury HUD glass

const cosmicCss = `
.csm{
  --bg: #04050a;
  --bg-2: #08091a;
  --fg: #e8eeff;
  --fg-dim: rgba(232,238,255,.62);
  --fg-faint: rgba(232,238,255,.38);
  --line: rgba(170,200,255,.10);
  --line-2: rgba(170,200,255,.20);
  --glass: rgba(120,150,220,.04);
  --glass-2: rgba(120,150,220,.08);
  --accent: oklch(82% 0.16 195);   /* electric cyan */
  --accent-2: oklch(78% 0.18 280); /* violet */
  --accent-3: oklch(82% 0.14 90);  /* warm gold */
  color: var(--fg);
  background: var(--bg);
  font-family: 'Pretendard', 'Inter', system-ui, sans-serif;
  font-feature-settings: "ss01";
  min-height: 100vh; position:relative; overflow-x:hidden;
}
.csm[data-theme="light"]{
  --bg: #e8ebf5;
  --bg-2: #d5dbeb;
  --fg: #04050a;
  --fg-dim: rgba(4,5,10,.66);
  --fg-faint: rgba(4,5,10,.4);
  --line: rgba(4,5,10,.12);
  --line-2: rgba(4,5,10,.2);
  --glass: rgba(4,5,10,.04);
  --glass-2: rgba(4,5,10,.08);
}

/* Starfield background */
.csm-stars{ position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
.csm-stars::before, .csm-stars::after{ content:""; position:absolute; inset:-20%;
  background-image:
    radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.7), transparent 50%),
    radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,.55), transparent 50%),
    radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,.5), transparent 50%),
    radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,.6), transparent 50%),
    radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,.55), transparent 50%),
    radial-gradient(2px 2px at 55% 45%, rgba(180,210,255,.7), transparent 50%),
    radial-gradient(1px 1px at 90% 90%, rgba(255,255,255,.6), transparent 50%),
    radial-gradient(1px 1px at 35% 15%, rgba(255,255,255,.5), transparent 50%);
  background-size: 600px 600px;
  animation: starDrift 120s linear infinite;
}
.csm-stars::after{ background-size: 400px 400px; opacity: .6;
  animation-duration: 80s; animation-direction: reverse; }
@keyframes starDrift{ to{ background-position: 600px 600px, -400px 400px, 400px -400px, -600px -400px, 400px 600px, -400px -600px, 600px -600px, -400px 400px; } }
.csm[data-theme="light"] .csm-stars{ display:none; }

/* Nebula */
.csm-nebula{ position:fixed; inset:-10%; pointer-events:none; z-index:0; filter: blur(120px); }
.csm-neb{ position:absolute; border-radius:50%; mix-blend-mode:screen; }
.csm[data-theme="light"] .csm-neb{ mix-blend-mode:multiply; opacity:.4; }
.csm-neb.n1{ width:55vw; height:55vw; left:-15vw; top:-10vh; opacity:.42;
  background: radial-gradient(circle, var(--accent-2) 0%, transparent 60%);
  animation: nebFloat 50s ease-in-out infinite alternate; }
.csm-neb.n2{ width:50vw; height:50vw; right:-12vw; top:30vh; opacity:.32;
  background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
  animation: nebFloat2 60s ease-in-out infinite alternate; }
.csm-neb.n3{ width:45vw; height:45vw; left:30vw; bottom:-10vh; opacity:.28;
  background: radial-gradient(circle, var(--accent-3) 0%, transparent 60%);
  animation: nebFloat3 70s ease-in-out infinite alternate; }
@keyframes nebFloat{ to{ transform: translate(10vw, 8vh) scale(1.1); } }
@keyframes nebFloat2{ to{ transform: translate(-12vw, -10vh) scale(.92); } }
@keyframes nebFloat3{ to{ transform: translate(8vw, -8vh) scale(1.06); } }

/* Grid overlay */
.csm-grid{ position:fixed; inset:0; pointer-events:none; z-index:1; opacity:.4;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: radial-gradient(circle at 50% 30%, black, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, black, transparent 80%);
}

/* Layout */
.csm-main{ position:relative; z-index:5; max-width:1480px; margin:0 auto; padding: 0 var(--gx, 36px); }
.csm[data-density="compact"]  { --gx: 24px; --gy: 70px; }
.csm[data-density="regular"]  { --gx: 36px; --gy: 110px; }
.csm[data-density="comfy"]    { --gx: 56px; --gy: 160px; }

/* HUD top bar */
.csm-hud{
  position:sticky; top:18px; z-index:50; max-width:1480px; margin: 18px auto 0;
  padding: 0 var(--gx);
}
.csm-hud-inner{
  display:grid; grid-template-columns: 1fr auto 1fr; align-items:center;
  padding: 12px 16px;
  background: var(--glass); border:1px solid var(--line-2);
  backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
  color: var(--fg-dim);
}
.csm-hud-l{ display:flex; gap:18px; align-items:center; }
.csm-hud-l .live{ width:6px; height:6px; border-radius:50%;
  background: var(--accent); box-shadow: 0 0 10px var(--accent), 0 0 20px var(--accent);
  animation: pulse 2s infinite; }
.csm-hud-m{ display:flex; gap:4px; }
.csm-hud-m a{ padding: 6px 10px; color: var(--fg-dim); text-decoration:none; }
.csm-hud-m a:hover{ color: var(--accent); }
.csm-hud-r{ justify-self:end; display:flex; gap:18px; align-items:center; }
.csm-hud-r .clock{ color: var(--fg); }

@keyframes pulse{ 50%{ opacity:.4; } }

/* HERO with orbital sphere */
.csm-hero{ padding: clamp(80px, 12vw, 160px) 0 var(--gy);
  display:grid; grid-template-columns: 1fr; gap: 48px; align-items:center;
  position:relative; min-height: 100vh;
}
.csm-hero-top{ display:grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items:center;
  position:relative; z-index:2; }
@media (max-width: 900px){ .csm-hero-top{ grid-template-columns: 1fr; } }
.csm-hero-l{}
.csm-hero-coord{ font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--fg-faint); margin-bottom: 28px;
  display:flex; gap: 18px; align-items:center; }
.csm-hero-coord .b{ width: 24px; height:1px; background: var(--accent); }
.csm-hero h1{
  font-size: clamp(56px, 11vw, 152px);
  font-weight: 600; letter-spacing: -.035em; line-height: .9;
  margin: 0;
}
.csm-hero h1 .ko{ display:block; }
.csm-hero h1 .glow{
  background: linear-gradient(180deg, var(--fg) 0%, var(--fg) 50%, var(--accent) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 80px color-mix(in oklch, var(--accent), transparent 70%);
}
.csm-hero h1 .stk{
  display:block; -webkit-text-stroke: 1px var(--fg-dim); color: transparent;
  font-family:'JetBrains Mono', monospace; font-size: .45em; font-weight:400;
  letter-spacing: .04em; margin-top: 18px;
}
.csm-hero-sub{ margin-top: 28px; max-width: 480px; font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.6; color: var(--fg-dim); }
.csm-hero-cta{ display:flex; gap: 10px; margin-top: 32px; flex-wrap:wrap; }

/* Sphere */
.csm-sphere-wrap{ position:relative; width: 100%; aspect-ratio: 1; max-width: 460px;
  justify-self: end; perspective: 1000px; }
@media (max-width: 900px){ .csm-sphere-wrap{ justify-self: center; max-width: 320px; } }
.csm-sphere{ position:absolute; inset:0; transform-style: preserve-3d;
  animation: sphereSpin 32s linear infinite; }
@keyframes sphereSpin{ to{ transform: rotateY(360deg); } }
.csm-sphere .ring{
  position:absolute; inset: 0; border-radius:50%;
  border: 1px solid var(--line-2);
  transform-style: preserve-3d;
}
.csm-sphere .ring.r1{ transform: rotateX(70deg); }
.csm-sphere .ring.r2{ transform: rotateX(70deg) rotateZ(60deg); }
.csm-sphere .ring.r3{ transform: rotateX(70deg) rotateZ(120deg); }
.csm-sphere .ring.r4{ transform: rotateY(70deg); border-color: var(--accent); opacity:.4; }
.csm-sphere .ring.r5{ transform: rotateY(70deg) rotateZ(60deg); border-color: var(--accent-2); opacity:.3; }

/* Inner glowing core */
.csm-core{
  position:absolute; left:50%; top:50%; width: 30%; height: 30%;
  transform: translate(-50%, -50%); border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--fg) 0%, var(--accent) 30%, var(--accent-2) 60%, transparent 100%);
  filter: blur(2px);
  box-shadow: 0 0 80px var(--accent), 0 0 120px var(--accent-2);
  animation: coreFloat 6s ease-in-out infinite alternate;
}
@keyframes coreFloat{ to{ transform: translate(-50%, -55%) scale(1.05); } }

/* Orbiting satellites — tech stack */
.csm-orbit{
  position:absolute; left:50%; top:50%; width: 100%; height: 100%;
  transform: translate(-50%, -50%);
  animation: orbitSpin 40s linear infinite;
}
.csm-orbit.o2{ animation-duration: 60s; animation-direction: reverse; width: 130%; height: 130%; }
.csm-orbit.o3{ animation-duration: 80s; width: 160%; height: 160%; }
@keyframes orbitSpin{ to{ transform: translate(-50%, -50%) rotate(360deg); } }
.csm-sat{
  position:absolute; top:0; left:50%; transform: translate(-50%, -50%);
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--glass); border: 1px solid var(--line-2);
  backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%);
  display:flex; align-items:center; justify-content:center;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600;
  color: var(--sat-c, var(--fg));
  box-shadow: 0 0 18px color-mix(in oklch, var(--sat-c, var(--accent)), transparent 70%);
}
.csm-sat::before{ content:""; position:absolute; inset:-2px; border-radius:14px;
  background: linear-gradient(135deg, var(--sat-c, var(--accent)), transparent);
  z-index:-1; opacity:.3; }
/* counter-rotate so they don't tumble */
.csm-orbit > .csm-sat{ animation: counterSpin 40s linear infinite; }
.csm-orbit.o2 > .csm-sat{ animation: counterSpin 60s linear infinite reverse; }
.csm-orbit.o3 > .csm-sat{ animation: counterSpin 80s linear infinite; }
@keyframes counterSpin{ to{ transform: translate(-50%, -50%) rotate(-360deg); } }

/* Hero readout */
.csm-readout{
  position:relative; z-index:2;
  display:grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--line); border:1px solid var(--line-2);
  font-family:'JetBrains Mono', monospace; font-size: 11px;
}
@media (max-width: 760px){ .csm-readout{ grid-template-columns: 1fr 1fr; } }
.csm-readout > div{ padding: 16px 20px; background: var(--bg); position:relative; }
.csm-readout > div::before{ content:""; position:absolute; left:0; top:0; width:6px; height:6px;
  background: var(--accent); }
.csm-readout .k{ font-size:10px; letter-spacing:.12em; text-transform:uppercase; color: var(--fg-faint); }
.csm-readout .v{ font-size: 22px; font-weight: 500; margin-top: 6px; color: var(--fg); letter-spacing:-.01em; }
.csm-readout .v small{ color: var(--accent); font-size:.5em; font-family:'Pretendard', sans-serif; }

.csm-btn{
  display:inline-flex; align-items:center; gap:10px;
  padding: 14px 22px; cursor:default; font-size: 12px; font-weight: 600;
  letter-spacing: .08em; text-transform: uppercase;
  background: var(--glass); border: 1px solid var(--line-2);
  backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%);
  color: var(--fg);
  font-family:'JetBrains Mono', monospace;
  position: relative; overflow: hidden;
  transition: background .25s, transform .25s, border-color .25s;
}
.csm-btn:hover{ background: var(--glass-2); border-color: var(--accent); color: var(--accent); }
.csm-btn.solid{
  background: var(--accent); color: #04050a; border-color: var(--accent);
  box-shadow: 0 0 30px color-mix(in oklch, var(--accent), transparent 60%);
}
.csm-btn.solid:hover{ background: var(--accent); color: #04050a;
  box-shadow: 0 0 50px color-mix(in oklch, var(--accent), transparent 40%); }

/* Section */
.csm-section{ padding: var(--gy) 0; position:relative; }
.csm-shead{ display:grid; grid-template-columns: auto 1fr auto; gap: 32px; margin-bottom: 48px; align-items:end;
  padding-bottom: 24px; border-bottom: 1px solid var(--line-2); }
.csm-shead-tag{ font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--accent); padding-bottom: 18px; }
.csm-shead-title{ font-size: clamp(36px, 5.5vw, 72px); font-weight: 500; letter-spacing: -.025em;
  line-height: 1; font-family:'Pretendard','Inter',sans-serif; }
.csm-shead-id{ font-family:'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-faint);
  letter-spacing: .06em; padding-bottom: 18px; }
@media (max-width: 760px){ .csm-shead{ grid-template-columns: 1fr; gap:8px; } .csm-shead-id{ display:none;} }

/* About — HUD panels */
.csm-about{ display:grid; grid-template-columns: 1.2fr 1fr; gap: 28px; align-items: start; }
@media (max-width: 900px){ .csm-about{ grid-template-columns: 1fr; } }
.csm-panel{
  background: var(--glass); border: 1px solid var(--line-2);
  backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
  position: relative;
}
.csm-panel::before, .csm-panel::after{ content:""; position:absolute; width:10px; height:10px;
  border: 1px solid var(--accent); }
.csm-panel::before{ top:-1px; left:-1px; border-right:0; border-bottom:0; }
.csm-panel::after{ bottom:-1px; right:-1px; border-left:0; border-top:0; }
.csm-panel-head{ display:flex; justify-content:space-between; padding: 16px 20px;
  border-bottom: 1px solid var(--line); font-family:'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing:.12em; text-transform:uppercase; color: var(--fg-faint); }
.csm-panel-head .id{ color: var(--accent); }
.csm-panel-body{ padding: 28px; }
.csm-about-text p{ font-size: clamp(16px, 1.35vw, 19px); line-height: 1.65; letter-spacing:-.008em;
  color: var(--fg); margin: 0 0 18px; }
.csm-about-text p:last-child{ margin-bottom:0; }
.csm-about-text p .hl{ color: var(--accent); background: color-mix(in oklch, var(--accent), transparent 90%);
  padding: 0 4px; }

.csm-stats{ display:grid; grid-template-columns: 1fr 1fr; gap:1px; background: var(--line); }
.csm-stat{ background: var(--bg); padding: 24px; position: relative; }
.csm-stat .k{ font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing:.12em;
  text-transform:uppercase; color: var(--fg-faint); }
.csm-stat .v{ font-size: clamp(32px, 4vw, 52px); font-weight: 500; letter-spacing:-.025em;
  margin-top: 10px; line-height: 1; }
.csm-stat .v .unit{ font-size: .35em; color: var(--accent); margin-left: 4px; font-family:'JetBrains Mono', monospace; }
.csm-stat .d{ font-size: 12px; color: var(--fg-dim); margin-top: 8px; }

/* Tech — orbital grid */
.csm-tech-groups{ display:flex; flex-direction:column; gap:1px; background: var(--line); border: 1px solid var(--line-2); }
.csm-tech-grp{ background: var(--bg);
  display:grid; grid-template-columns: 220px 1fr; gap: 32px;
  padding: 24px 28px; align-items:center;
}
@media (max-width: 760px){ .csm-tech-grp{ grid-template-columns: 1fr; gap: 14px; padding: 20px; } }
.csm-tech-grp-l{ font-family:'JetBrains Mono', monospace; font-size: 11px; letter-spacing:.14em;
  text-transform:uppercase; color: var(--fg-dim); display:flex; gap:10px; align-items:center; }
.csm-tech-grp-l .num{ color: var(--accent); }
.csm-tech-grp-r{ display:flex; flex-wrap:wrap; gap: 8px; }
.csm-tag{
  display:inline-flex; align-items:center; gap: 8px;
  padding: 8px 14px 8px 10px;
  background: var(--glass-2); border: 1px solid var(--line-2);
  font-size: 13px; letter-spacing:-.005em;
  transition: transform .25s, border-color .25s, color .25s, box-shadow .25s;
}
.csm-tag .pip{ width:6px; height:6px; border-radius:50%; background: var(--tag-c); box-shadow: 0 0 10px var(--tag-c); }
.csm-tag:hover{ border-color: var(--tag-c); color: var(--tag-c); transform: translateY(-2px); box-shadow: 0 0 20px color-mix(in oklch, var(--tag-c), transparent 80%); }

/* Projects */
.csm-projects{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 820px){ .csm-projects{ grid-template-columns: 1fr; } }
.csm-proj{
  position:relative; padding: 0; overflow: hidden;
  background: var(--glass); border: 1px solid var(--line-2);
  backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition: transform .4s, border-color .4s;
}
.csm-proj::before, .csm-proj::after{ content:""; position:absolute; width:12px; height:12px;
  border: 1px solid var(--proj-c); }
.csm-proj::before{ top:-1px; left:-1px; border-right:0; border-bottom:0; }
.csm-proj::after{ bottom:-1px; right:-1px; border-left:0; border-top:0; }
.csm-proj:hover{ transform: translateY(-4px); border-color: var(--proj-c); }
.csm-proj-head{ display:flex; justify-content:space-between; padding: 14px 20px;
  border-bottom: 1px solid var(--line); font-family:'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing:.12em; text-transform:uppercase; color: var(--fg-faint); }
.csm-proj-head .id{ color: var(--proj-c); }
.csm-proj-body{ padding: 32px; min-height: 280px; display:flex; flex-direction:column; gap: 14px; }
.csm-proj-vis{ height: 120px; position:relative; overflow:hidden; margin-bottom: 8px;
  background: radial-gradient(ellipse at 30% 40%, var(--proj-c) 0%, transparent 65%);
  opacity: .9;
}
.csm-proj-vis::before{ content:""; position:absolute; inset:0;
  background-image: linear-gradient(to right, var(--line) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 20px 20px; opacity:.6;
}
.csm-proj-vis::after{ content:""; position:absolute; right: 20px; bottom: 14px;
  width: 40px; height: 40px; border-radius:50%;
  background: radial-gradient(circle, white 0%, var(--proj-c) 60%, transparent 100%);
  box-shadow: 0 0 30px var(--proj-c);
}
.csm-proj .ttl{ font-size: clamp(22px, 2.4vw, 30px); font-weight: 600; letter-spacing:-.02em; line-height: 1.1; }
.csm-proj .sub{ font-size: 13px; color: var(--fg-dim); }
.csm-proj .desc{ font-size: 13.5px; color: var(--fg-dim); line-height: 1.55; }
.csm-proj-foot{ margin-top:auto; padding-top: 16px; display:flex; justify-content:space-between;
  align-items:center; gap: 12px; flex-wrap:wrap; }
.csm-proj-foot .stk{ display:flex; gap: 4px; flex-wrap:wrap; }
.csm-proj-foot .stk span{ font-family:'JetBrains Mono', monospace; font-size: 10px;
  padding: 4px 8px; border:1px solid var(--line-2); color: var(--fg-dim); }
.csm-proj-foot .role{ font-family:'JetBrains Mono', monospace; font-size: 10px;
  color: var(--proj-c); letter-spacing:.06em; }

/* Career */
.csm-career-table{ background: var(--line); border:1px solid var(--line-2); display:grid; gap:1px; }
.csm-career-table .row{ background: var(--bg); padding: 24px 28px;
  display:grid; grid-template-columns: 180px 1fr 1fr 80px; gap: 24px; align-items:center;
  position:relative; }
@media (max-width: 760px){ .csm-career-table .row{ grid-template-columns: 1fr; gap:6px; } }
.csm-career-table .row .year{ font-family:'JetBrains Mono', monospace; font-size: 12px;
  color: var(--accent); letter-spacing:.04em; }
.csm-career-table .row .co{ font-size: 22px; font-weight: 600; letter-spacing:-.02em; }
.csm-career-table .row .ro{ font-size: 14px; color: var(--fg-dim); }
.csm-career-table .row .note{ font-size: 12px; color: var(--fg-faint); }
.csm-career-table .row .badge{ justify-self:end; font-family:'JetBrains Mono', monospace;
  font-size: 10px; padding: 4px 10px; border: 1px solid var(--accent); color: var(--accent);
  letter-spacing: .12em; text-transform:uppercase; }
.csm-career-table .row.current .badge{ background: var(--accent); color: #04050a; }
@media (max-width: 760px){ .csm-career-table .row .badge{ justify-self: start; } }

/* Posts */
.csm-posts{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 760px){ .csm-posts{ grid-template-columns: 1fr; } }
.csm-post{ position:relative; padding: 22px 24px;
  background: var(--glass); border: 1px solid var(--line-2);
  display:flex; flex-direction:column; gap: 10px;
  transition: background .3s, border-color .3s, transform .3s;
}
.csm-post:hover{ background: var(--glass-2); border-color: var(--accent); transform: translateY(-3px); }
.csm-post .top{ display:flex; justify-content:space-between;
  font-family:'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing:.12em; text-transform:uppercase; color: var(--fg-faint); }
.csm-post .top .tag{ color: var(--accent); }
.csm-post .ttl{ font-size: 17px; font-weight: 500; letter-spacing:-.01em; line-height: 1.3; }
.csm-post .read{ font-family:'JetBrains Mono', monospace; font-size: 11px; color: var(--fg-faint);
  margin-top: auto; padding-top: 8px; }

/* Contact */
.csm-contact{ padding: clamp(60px, 8vw, 120px) clamp(32px, 5vw, 80px);
  background: var(--glass); border: 1px solid var(--line-2);
  backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);
  position: relative; overflow: hidden;
}
.csm-contact::before, .csm-contact::after{ content:""; position:absolute; width: 24px; height: 24px;
  border: 1px solid var(--accent); }
.csm-contact::before{ top:-1px; left:-1px; border-right:0; border-bottom:0; }
.csm-contact::after{ bottom:-1px; right:-1px; border-left:0; border-top:0; }
.csm-contact-glow{ position:absolute; right:-15%; top:-30%; width:60%; height:120%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 60%);
  opacity: .12; filter: blur(80px); pointer-events:none; }
.csm-contact-inner{ position: relative; }
.csm-contact .terminal{ display:flex; align-items:center; gap: 12px;
  font-family:'JetBrains Mono', monospace; font-size: 12px; letter-spacing:.06em;
  color: var(--fg-faint); margin-bottom: 28px; }
.csm-contact .terminal .arrow{ color: var(--accent); }
.csm-contact .cursor{ width: 8px; height: 14px; background: var(--accent); animation: blink 1s steps(2) infinite; }
@keyframes blink{ 50%{ opacity: 0; } }
.csm-contact h2{ font-size: clamp(44px, 7vw, 96px); font-weight: 600; letter-spacing:-.03em;
  line-height: .95; margin: 0; }
.csm-contact h2 .glow{
  background: linear-gradient(120deg, var(--fg) 0%, var(--accent) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.csm-contact p{ font-size: 17px; color: var(--fg-dim); margin-top: 28px; max-width: 560px; line-height: 1.55; }
.csm-contact-links{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
  background: var(--line); border: 1px solid var(--line-2); margin-top: 48px; }
@media (max-width: 600px){ .csm-contact-links{ grid-template-columns: 1fr; } }
.csm-contact-link{ background: var(--bg); padding: 22px 24px;
  display:flex; justify-content:space-between; align-items:center;
  transition: background .3s; cursor: default;
}
.csm-contact-link:hover{ background: var(--glass-2); }
.csm-contact-link .lbl{ font-family:'JetBrains Mono', monospace; font-size: 11px;
  letter-spacing:.12em; text-transform:uppercase; color: var(--fg-faint); }
.csm-contact-link .hdl{ font-size: 15px; color: var(--fg); }
.csm-contact-link:hover .hdl{ color: var(--accent); }

/* Footer */
.csm-foot{ padding: 40px 0 60px;
  display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px;
  font-family:'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--fg-faint);
  border-top: 1px solid var(--line-2); margin-top: 80px;
}
.csm-foot .mid{ text-align:center; }
.csm-foot .right{ text-align:right; }

/* Reveal */
.csm [data-reveal]{ opacity:0; transform: translateY(24px); transition: opacity 1s ease, transform 1s cubic-bezier(.2,.8,.2,1); }
.csm [data-reveal][data-in="1"]{ opacity:1; transform: none; }
.csm [data-reveal][data-delay="1"]{ transition-delay: .08s; }
.csm [data-reveal][data-delay="2"]{ transition-delay: .16s; }
.csm [data-reveal][data-delay="3"]{ transition-delay: .24s; }
.csm [data-reveal][data-delay="4"]{ transition-delay: .32s; }
`;

function CosmicVariation({ theme, density }) {
  useReveal();
  const [time, setTime] = React.useState("");
  React.useEffect(() => {
    const fn = () => {
      const d = new Date();
      setTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")} KST`);
    };
    fn(); const id = setInterval(fn, 1000);
    return () => clearInterval(id);
  }, []);

  // Sats: 8 highlight techs around the sphere
  const orbitSats = [
    { hl: "TS", c: "oklch(75% 0.15 215)" },
    { hl: "Re", c: "oklch(78% 0.14 195)" },
    { hl: "Nx", c: "var(--fg)" },
    { hl: "Tw", c: "oklch(78% 0.14 188)" },
    { hl: "Zu", c: "oklch(78% 0.15 28)" },
    { hl: "Vi", c: "oklch(74% 0.18 268)" },
    { hl: "RN", c: "oklch(78% 0.13 185)" },
    { hl: "Fi", c: "oklch(72% 0.18 290)" },
    { hl: "Sb", c: "oklch(74% 0.16 335)" },
    { hl: "JS", c: "oklch(82% 0.14 90)" },
  ];

  return (
    <div className="csm" data-theme={theme} data-density={density}>
      <style>{cosmicCss}</style>
      <div className="csm-stars" />
      <div className="csm-nebula">
        <div className="csm-neb n1" />
        <div className="csm-neb n2" />
        <div className="csm-neb n3" />
      </div>
      <div className="csm-grid" />

      <div className="csm-hud">
        <div className="csm-hud-inner">
          <div className="csm-hud-l">
            <span className="live" />
            <span>SYS · jejinni.site · v3.0</span>
            <span style={{ opacity: .5 }}>·</span>
            <span>SEC: 37.5°N 127°E</span>
          </div>
          <div className="csm-hud-m">
            <a>01_Home</a><a>02_About</a><a>03_Stack</a><a>04_Work</a><a>05_Contact</a>
          </div>
          <div className="csm-hud-r">
            <span>STATUS: <span style={{ color: "var(--accent)" }}>ONLINE</span></span>
            <span className="clock">{time}</span>
          </div>
        </div>
      </div>

      <main className="csm-main">
        {/* HERO */}
        <section className="csm-hero">
          <div className="csm-hero-top">
            <div className="csm-hero-l">
              <div className="csm-hero-coord" data-reveal>
                <span className="b" />
                <span>TRANSMISSION №01</span>
                <span>·</span>
                <span>SEOUL 37.5°N</span>
              </div>
              <h1 data-reveal data-delay="1">
                <span className="ko">제진명</span>
                <span className="ko glow">Je Jinmyeong</span>
                <span className="stk">— FRONTEND ENGINEER / 2026</span>
              </h1>
              <p className="csm-hero-sub" data-reveal data-delay="2">
                인터페이스를 코드로 설계합니다. React · TypeScript · Next.js 기반의
                확장 가능한 프론트엔드 아키텍처에 집중합니다.
              </p>
              <div className="csm-hero-cta" data-reveal data-delay="3">
                <button className="csm-btn solid">↓ RESUME.PDF</button>
                <button className="csm-btn">▶ SEE WORK</button>
              </div>
            </div>

            <div className="csm-sphere-wrap" data-reveal data-delay="1">
              <div className="csm-sphere">
                <div className="ring r1" />
                <div className="ring r2" />
                <div className="ring r3" />
                <div className="ring r4" />
                <div className="ring r5" />
                <div className="csm-core" />
              </div>
              <div className="csm-orbit o1">
                {orbitSats.slice(0, 4).map((s, i) => (
                  <div key={i} className="csm-sat"
                    style={{
                      ['--sat-c']: s.c,
                      transform: `rotate(${i * 90}deg) translateY(-50%) translateY(-50px)`
                    }}>{s.hl}</div>
                ))}
              </div>
              <div className="csm-orbit o2">
                {orbitSats.slice(4, 8).map((s, i) => (
                  <div key={i} className="csm-sat"
                    style={{
                      ['--sat-c']: s.c,
                      transform: `rotate(${i * 90 + 45}deg) translateY(-50%) translateY(-50px)`
                    }}>{s.hl}</div>
                ))}
              </div>
              <div className="csm-orbit o3">
                {orbitSats.slice(8).map((s, i) => (
                  <div key={i} className="csm-sat"
                    style={{
                      ['--sat-c']: s.c,
                      transform: `rotate(${i * 180 + 90}deg) translateY(-50%) translateY(-50px)`
                    }}>{s.hl}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="csm-readout" data-reveal data-delay="3">
            {[
              { k: "EXPERIENCE", v: <>5<small>YRS</small></> },
              { k: "SHIPPED", v: <>30<small>+ PROD</small></> },
              { k: "STACK COUNT", v: <>{TECH.length}<small>TOOLS</small></> },
              { k: "STATUS", v: <span style={{ color: "var(--accent)" }}>● OPEN</span> },
            ].map((s, i) => (
              <div key={i}>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section className="csm-section">
          <div className="csm-shead">
            <div className="csm-shead-tag" data-reveal>// 01 · ABOUT</div>
            <div className="csm-shead-title" data-reveal data-delay="1">신호를 다듬는 사람</div>
            <div className="csm-shead-id" data-reveal data-delay="2">[REF 0x00A]</div>
          </div>
          <div className="csm-about">
            <div className="csm-panel" data-reveal>
              <div className="csm-panel-head">
                <span><span className="id">01.</span> profile.md</span>
                <span>5 yrs · seoul</span>
              </div>
              <div className="csm-panel-body csm-about-text">
                <p>
                  저는 작은 디테일이 큰 차이를 만든다고 믿습니다. <span className="hl">마이크로 인터랙션</span>,
                  일관된 컴포넌트 API, 측정 가능한 성능 — 이 세 가지를 무기로
                  제품팀이 빠르게 움직일 수 있는 토대를 만듭니다.
                </p>
                <p>
                  지난 5년간 커머스, 협업 도구, 헬스케어 영역에서 <span className="hl">30개 이상</span>의
                  프로덕트를 출시했고, 디자인 시스템을 두 번 0에서 구축해봤습니다.
                </p>
                <p>
                  React, TypeScript, 그리고 좋은 디자이너와의 협업이 제 무대입니다.
                </p>
              </div>
            </div>
            <div className="csm-panel" data-reveal data-delay="2">
              <div className="csm-panel-head">
                <span><span className="id">02.</span> stats.json</span>
                <span>live</span>
              </div>
              <div className="csm-stats">
                {[
                  { k: "EXP", v: <>5<span className="unit">YRS</span></>, d: "Frontend focus" },
                  { k: "SHIP", v: <>30<span className="unit">+</span></>, d: "Products live" },
                  { k: "TEAM", v: <>12<span className="unit">DEVS</span></>, d: "Led at peak" },
                  { k: "PERF", v: <>38<span className="unit">%</span></>, d: "Avg LCP gain" },
                ].map((s, i) => (
                  <div key={i} className="csm-stat">
                    <div className="k">{s.k}</div>
                    <div className="v">{s.v}</div>
                    <div className="d">{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section className="csm-section">
          <div className="csm-shead">
            <div className="csm-shead-tag" data-reveal>// 02 · STACK</div>
            <div className="csm-shead-title" data-reveal data-delay="1">기술 스택</div>
            <div className="csm-shead-id" data-reveal data-delay="2">[REF 0x010]</div>
          </div>
          <div className="csm-tech-groups" data-reveal>
            {TECH_GROUPS.map((g, gi) => (
              <div key={g} className="csm-tech-grp">
                <div className="csm-tech-grp-l">
                  <span className="num">{String(gi + 1).padStart(2, "0")} /</span>
                  <span>{g.toUpperCase()}</span>
                </div>
                <div className="csm-tech-grp-r">
                  {TECH.filter((t) => t.group === g).map((t) => (
                    <span key={t.name} className="csm-tag" style={{ ['--tag-c']: `oklch(76% 0.16 ${t.hue})` }}>
                      <span className="pip" />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="csm-section">
          <div className="csm-shead">
            <div className="csm-shead-tag" data-reveal>// 03 · MISSIONS</div>
            <div className="csm-shead-title" data-reveal data-delay="1">최근 프로젝트</div>
            <div className="csm-shead-id" data-reveal data-delay="2">[REF 0x020]</div>
          </div>
          <div className="csm-projects">
            {PROJECTS.map((p, i) => (
              <article key={p.idx} className="csm-proj" data-reveal data-delay={Math.min(i + 1, 4)}
                style={{ ['--proj-c']: `oklch(76% 0.18 ${p.hue})` }}>
                <div className="csm-proj-head">
                  <span><span className="id">№ {p.idx}</span></span>
                  <span>{p.role.split(" · ")[1] || "—"}</span>
                </div>
                <div className="csm-proj-body">
                  <div className="csm-proj-vis" />
                  <div className="ttl">{p.title}</div>
                  <div className="sub">{p.sub}</div>
                  <div className="desc">{p.desc}</div>
                  <div className="csm-proj-foot">
                    <div className="stk">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                    <div className="role">{p.role.split(" · ")[0]} →</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CAREER */}
        <section className="csm-section">
          <div className="csm-shead">
            <div className="csm-shead-tag" data-reveal>// 04 · TIMELINE</div>
            <div className="csm-shead-title" data-reveal data-delay="1">커리어</div>
            <div className="csm-shead-id" data-reveal data-delay="2">[REF 0x030]</div>
          </div>
          <div className="csm-career-table" data-reveal>
            {CAREER.map((c, i) => (
              <div key={c.year} className={`row ${i === 0 ? "current" : ""}`}>
                <div className="year">{c.year}</div>
                <div className="co">{c.company}</div>
                <div>
                  <div className="ro">{c.role}</div>
                  <div className="note">{c.note}</div>
                </div>
                <div className="badge">{i === 0 ? "NOW" : "PAST"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* POSTS */}
        <section className="csm-section">
          <div className="csm-shead">
            <div className="csm-shead-tag" data-reveal>// 05 · LOGS</div>
            <div className="csm-shead-title" data-reveal data-delay="1">기록</div>
            <div className="csm-shead-id" data-reveal data-delay="2">[REF 0x040]</div>
          </div>
          <div className="csm-posts">
            {POSTS.map((p, i) => (
              <a key={p.title} className="csm-post" data-reveal data-delay={Math.min(i + 1, 4)}>
                <div className="top">
                  <span>LOG · {p.date}</span>
                  <span className="tag">/ {p.tag}</span>
                </div>
                <div className="ttl">{p.title}</div>
                <div className="read">▸ {p.read}</div>
              </a>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="csm-section">
          <div className="csm-contact" data-reveal>
            <div className="csm-contact-glow" />
            <div className="csm-contact-inner">
              <div className="terminal">
                <span className="arrow">$</span>
                <span>./initiate transmission</span>
                <span className="cursor" />
              </div>
              <h2>
                Let's build <span className="glow">something cosmic.</span>
              </h2>
              <p>
                새로운 미션, 협업, 또는 단순한 인사 — 어떤 신호도 환영합니다.
                보통 24시간 내로 답변이 도착합니다.
              </p>
              <div className="csm-contact-links">
                {LINKS.map((l) => (
                  <a key={l.label} className="csm-contact-link">
                    <span className="lbl">/ {l.label.toUpperCase()}</span>
                    <span className="hdl">{l.handle} →</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="csm-foot">
          <span>© 2026 / JEJINNI.SITE</span>
          <span className="mid">— END OF TRANSMISSION —</span>
          <span className="right">v3.0 / SEOUL</span>
        </footer>
      </main>
    </div>
  );
}

window.CosmicVariation = CosmicVariation;
