// AURORA v3 — refined dynamic
// Restored asymmetric character, kinetic Korean type, 2-tone refined gradient.
// Capped display sizes, cleaner type pairing, fewer/dimmer aurora blobs.

const auroraCss = `
.aurora{
  --bg: #0b0a14;
  --surface: rgba(255,255,255,.025);
  --surface-2: rgba(255,255,255,.045);
  --surface-3: rgba(255,255,255,.075);
  --fg: #f0ecf8;
  --fg-dim: rgba(240,236,248,.6);
  --fg-faint: rgba(240,236,248,.34);
  --line: rgba(255,255,255,.07);
  --line-2: rgba(255,255,255,.13);

  /* 2-tone refined accent: magenta → violet */
  --a1: #ff3d9a;
  --a2: #9b5cff;
  --accent-soft: rgba(255, 61, 154, .14);
  --accent-glow: rgba(255, 61, 154, .35);

  --f-display: 'Instrument Serif', 'Pretendard', serif;
  --f-sans: 'Pretendard', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --f-mono: 'JetBrains Mono', ui-monospace, monospace;

  color: var(--fg);
  background: var(--bg);
  font-family: var(--f-sans);
  font-feature-settings: "ss01","ss02","cv11";
  letter-spacing: -0.011em;
  min-height: 100vh; position: relative; overflow-x: hidden;
}
.aurora[data-theme="light"]{
  --bg: #f6f4fb;
  --surface: rgba(11,10,20,.03);
  --surface-2: rgba(11,10,20,.06);
  --surface-3: rgba(11,10,20,.09);
  --fg: #0b0a14;
  --fg-dim: rgba(11,10,20,.62);
  --fg-faint: rgba(11,10,20,.4);
  --line: rgba(11,10,20,.08);
  --line-2: rgba(11,10,20,.16);
  --a1: #e0277e;
  --a2: #6a37d8;
}

/* ===== Background — 2 muted aurora blobs only ===== */
.aurora-bg{ position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
  filter: blur(70px) saturate(120%); }
.aurora-blob{ position:absolute; border-radius:50%; mix-blend-mode:screen; opacity:.4; }
.aurora[data-theme="light"] .aurora-blob{ mix-blend-mode:multiply; opacity:.32; }
.aurora-blob.b1{ width:55vw; height:55vw; right:-8vw; top:-10vh;
  background: radial-gradient(circle, var(--a1) 0%, transparent 60%);
  animation: aFloat1 30s ease-in-out infinite alternate; }
.aurora-blob.b2{ width:50vw; height:50vw; left:-12vw; bottom:-15vh;
  background: radial-gradient(circle, var(--a2) 0%, transparent 60%);
  animation: aFloat2 36s ease-in-out infinite alternate; }
@keyframes aFloat1{ to{ transform: translate(-6vw, 10vh) scale(1.08); } }
@keyframes aFloat2{ to{ transform: translate(8vw, -8vh) scale(.92); } }

.aurora-grid{ position:fixed; inset:0; pointer-events:none; z-index:1; opacity:.35;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: 88px 88px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,.8), transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,.8), transparent 100%);
}
.aurora-noise{ position:fixed; inset:0; pointer-events:none; z-index:2;
  opacity:.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }

.aurora-cursor{ position:fixed; pointer-events:none; z-index:3;
  width: 460px; height: 460px; border-radius:50%;
  background: radial-gradient(circle, var(--accent-glow) 0%, transparent 60%);
  transform: translate(-50%, -50%); mix-blend-mode: screen;
  filter: blur(16px); opacity:.4; }
.aurora[data-theme="light"] .aurora-cursor{ mix-blend-mode: multiply; opacity:.22; }

/* ===== Layout ===== */
.aurora-main{ position:relative; z-index:5; max-width: 1280px; margin: 0 auto; padding: 0 var(--gx, 32px); }
.aurora[data-density="compact"]  { --gx: 24px; --gy: 64px;  --hero-py: 90px;  }
.aurora[data-density="regular"]  { --gx: 32px; --gy: 96px;  --hero-py: 140px; }
.aurora[data-density="comfy"]    { --gx: 48px; --gy: 140px; --hero-py: 200px; }

/* ===== NAV ===== */
.aurora-nav{
  position:sticky; top: 16px; z-index: 50;
  margin: 16px auto 0; max-width: 1280px;
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  padding: 9px 11px 9px 18px;
  background: rgba(11,10,20,.45); border: 1px solid var(--line-2);
  backdrop-filter: blur(28px) saturate(180%); -webkit-backdrop-filter: blur(28px) saturate(180%);
  border-radius: 999px;
  font-size: 13px;
}
.aurora[data-theme="light"] .aurora-nav{ background: rgba(246,244,251,.55); }
.aurora-nav-brand{ display:flex; align-items:center; gap:10px; font-weight: 600; }
.aurora-nav-brand .dot{ width:7px; height:7px; border-radius:50%;
  background: linear-gradient(135deg, var(--a1), var(--a2));
  box-shadow: 0 0 10px var(--a1); }
.aurora-nav-brand .en{ color: var(--fg-faint); font-size:11.5px;
  font-family: var(--f-mono); letter-spacing:.04em; }
.aurora-nav-links{ display:flex; gap:2px; justify-self: center; }
.aurora-nav-links a{ font-size:12.5px; color:var(--fg-dim); padding: 7px 12px; border-radius:999px; cursor: default; }
.aurora-nav-links a:hover{ color: var(--fg); background: var(--surface-2); }
.aurora-nav-cta{ font-size:12.5px; padding: 8px 16px; border-radius: 999px;
  background: var(--fg); color: var(--bg); border:0; font-weight: 500; cursor: default;
  display:inline-flex; align-items:center; gap:6px; transition: transform .25s; }
.aurora-nav-cta:hover{ transform: translateY(-1px); }
@media (max-width: 760px){ .aurora-nav-links{ display:none; } }

/* ===== HERO — asymmetric & big ===== */
.aurora-hero{
  padding: var(--hero-py) 0 var(--gy);
  display: grid; grid-template-columns: 1fr; gap: 56px;
  position: relative;
}
.aurora-eyebrow{ display:inline-flex; align-items:center; gap:10px;
  padding: 7px 14px; border-radius: 999px;
  background: var(--surface); border:1px solid var(--line);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--fg-dim); font-family: var(--f-mono);
  align-self: start; justify-self: start;
}
.aurora-eyebrow .pulse{ width: 6px; height: 6px; border-radius:50%; background: #7dffae;
  box-shadow: 0 0 10px #7dffae; animation: aPulse 2s infinite; }
@keyframes aPulse{ 50%{ opacity:.4; } }

.aurora-h1{
  margin: 22px 0 0;
  font-family: var(--f-sans);
  font-size: clamp(44px, 7vw, 92px);
  font-weight: 700; letter-spacing: -0.035em; line-height: 0.96;
}
.aurora-h1 .ln1{ display:block; font-size: .42em; font-weight: 500;
  letter-spacing: -.01em; color: var(--fg-dim); line-height: 1; }
.aurora-h1 .ln2{ display:block; font-size: .42em; font-weight: 500;
  letter-spacing: -.01em; color: var(--fg-dim); margin-top: 6px; line-height: 1; }
.aurora-h1 .ln3{ display:block; margin-top: 16px; }
.aurora-h1 .name{
  display: inline-block; position: relative;
  background: linear-gradient(115deg, var(--a1) 0%, var(--a2) 80%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  background-size: 180% 180%;
  animation: gradMove 9s ease-in-out infinite alternate;
}
@keyframes gradMove{ to{ background-position: 100% 50%; } }
.aurora-h1 .name::after{
  content:""; position:absolute; inset: -6% -2%;
  background: radial-gradient(ellipse 70% 80% at 50% 50%, var(--accent-glow) 0%, transparent 70%);
  z-index: -1; filter: blur(20px);
}
.aurora-h1 .en{
  display:block; margin-top: 24px;
  font-family: var(--f-mono); font-weight: 400;
  font-size: clamp(13px, 1.2vw, 15.5px);
  color: var(--fg-faint); letter-spacing: .04em; line-height: 1.3;
  text-transform: uppercase;
}

.aurora-hero-bottom{
  display:grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: end;
  padding-top: 40px; border-top: 1px solid var(--line);
}
@media (max-width: 900px){ .aurora-hero-bottom{ grid-template-columns: 1fr; gap: 28px; } }

.aurora-hero-sub{
  font-size: clamp(15px, 1.25vw, 17px); line-height: 1.6;
  color: var(--fg-dim); max-width: 480px;
}
.aurora-hero-actions{ display:flex; gap: 10px; flex-wrap:wrap; }

.glass-btn{ display:inline-flex; align-items:center; gap: 10px;
  padding: 13px 22px; border-radius: 12px; cursor: default;
  background: var(--surface); border: 1px solid var(--line-2);
  backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
  color: var(--fg); font-size: 13.5px; font-weight: 500;
  transition: transform .25s, background .25s, border-color .25s, color .25s;
}
.glass-btn:hover{ transform: translateY(-2px); background: var(--surface-2); border-color: var(--a1); }
.glass-btn.primary{
  background: linear-gradient(115deg, var(--a1) 0%, var(--a2) 100%); color: #fff; border-color: transparent;
  box-shadow: 0 8px 30px var(--accent-soft);
}
.glass-btn.primary:hover{ transform: translateY(-2px); box-shadow: 0 14px 44px var(--accent-glow); }

/* Hero KPI strip — minimal */
.aurora-hero-kpis{ display:flex; gap: 36px; flex-wrap: wrap; }
.aurora-hero-kpis .kpi .k{ font-family: var(--f-mono); font-size: 10.5px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--fg-faint); }
.aurora-hero-kpis .kpi .v{ font-size: 24px; font-weight: 600; margin-top: 6px;
  letter-spacing: -.02em; line-height: 1; }
.aurora-hero-kpis .kpi .v.ac{
  background: linear-gradient(115deg, var(--a1) 0%, var(--a2) 80%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* ===== SECTION ===== */
.aurora-section{ padding: var(--gy) 0; position: relative; }
.aurora-shead{
  display:grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: end;
  margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid var(--line);
}
@media (max-width: 760px){ .aurora-shead{ grid-template-columns: 1fr; gap: 16px; } }
.aurora-shead-tag{ font-family: var(--f-mono); font-size: 10.5px; letter-spacing: .18em;
  text-transform: uppercase; color: var(--a1); }
.aurora-shead-title{
  margin-top: 12px;
  font-size: clamp(28px, 3.6vw, 48px);
  font-weight: 600; letter-spacing: -.028em; line-height: 1.05;
  white-space: nowrap;
}
.aurora-shead-title em{ font-style: normal; font-family: inherit; font-weight: inherit;
  color: var(--a1); background: none; -webkit-background-clip: initial; background-clip: initial; }
@media (max-width: 480px){ .aurora-shead-title{ white-space: normal; } }
.aurora-shead-sub{ color: var(--fg-dim); font-size: 14.5px; line-height: 1.6; max-width: 420px; justify-self: end; }
@media (max-width: 760px){ .aurora-shead-sub{ justify-self: start; } }

/* ===== ABOUT — Q&A interview ===== */
.about-qa{ display:flex; flex-direction:column; gap: clamp(48px, 7vw, 80px); }
.qa-block{ display: grid; grid-template-columns: 72px 1fr 1.2fr; gap: clamp(20px, 3vw, 48px); align-items: start; position: relative;
  padding-top: clamp(28px, 4vw, 40px); border-top: 1px solid var(--line); }
.qa-block:first-child{ border-top: 0; padding-top: 0; }
@media (max-width: 900px){ .qa-block{ grid-template-columns: 60px 1fr; row-gap: 18px; } .qa-answer-wrap{ grid-column: 2; } }
@media (max-width: 600px){ .qa-block{ grid-template-columns: 1fr; row-gap: 14px; } .qa-answer-wrap{ grid-column: 1; } }

.qa-num{ font-family: var(--f-mono); font-size: 12px; color: var(--a1);
  letter-spacing: .14em; padding-top: 8px;
  display: flex; flex-direction: column; gap: 6px; }
.qa-num::after{ content:""; width: 28px; height: 1px; background: var(--a1); opacity: .4; }

.qa-question{
  font-size: clamp(22px, 2.6vw, 34px);
  font-weight: 600; letter-spacing: -.024em; line-height: 1.2;
  color: var(--fg); margin: 0; padding-top: 2px;
  text-wrap: balance;
}
.qa-question .hl{ color: var(--a1); }

.qa-answer-wrap{ display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
.qa-answer{
  font-size: clamp(15px, 1.15vw, 17px); line-height: 1.7;
  color: var(--fg-dim); letter-spacing: -.003em;
  margin: 0;
}
.qa-answer .hl{ color: var(--fg); font-weight: 600;
  background: linear-gradient(transparent 60%, var(--accent-soft) 60%);
  padding: 0 2px;
}
.qa-tags{ display:flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.qa-tag{ padding: 5px 11px; border-radius: 999px;
  background: var(--surface-2); border: 1px solid var(--line);
  font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim);
  letter-spacing: .04em; }

/* ===== TECH ===== */
.aurora-tech{ display:flex; flex-direction:column;
  background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); overflow: hidden;
}
.tech-row{ display:grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: center;
  padding: 22px 28px; }
.tech-row + .tech-row{ border-top: 1px solid var(--line); }
@media (max-width: 720px){ .tech-row{ grid-template-columns: 1fr; gap: 12px; padding: 20px; } }
.tech-row-label{ display:flex; align-items:baseline; gap: 10px; }
.tech-row-label .ko{ font-size: 16px; font-weight: 600; color: var(--fg); letter-spacing:-.01em; }
.tech-row-label .en{ font-family: var(--f-mono); font-size: 10.5px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--fg-faint); }
.tech-chips{ display:flex; flex-wrap: wrap; gap: 8px; }
.tech-chip{
  display: inline-flex; align-items: center; gap: 9px;
  padding: 8px 13px 8px 9px; border-radius: 10px;
  background: var(--surface-2); border: 1px solid var(--line);
  font-size: 13px; letter-spacing:-.003em;
  transition: transform .25s, border-color .25s, background .25s, box-shadow .25s;
}
.tech-chip:hover{
  transform: translateY(-2px);
  border-color: var(--chip-accent);
  background: var(--surface-3);
  box-shadow: 0 8px 24px color-mix(in oklch, var(--chip-accent), transparent 72%);
}
.tech-chip .sq{
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--chip-accent);
  color: #fff; font-weight: 700; font-size: 10px; letter-spacing: -.02em;
  display:flex; align-items:center; justify-content:center;
}

/* ===== PROJECTS ===== */
.aurora-projects{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
@media (max-width: 820px){ .aurora-projects{ grid-template-columns: 1fr; } }
.project-card{
  position: relative; border-radius: 20px; padding: 28px;
  background: var(--surface); border: 1px solid var(--line);
  backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);
  overflow: hidden; min-height: 280px;
  display:flex; flex-direction: column; justify-content: space-between;
  transition: transform .4s cubic-bezier(.2,.8,.2,1), border-color .4s;
}
.project-card:hover{ transform: translateY(-4px); border-color: var(--a1); }
.project-card::before{ content:""; position:absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 90% -10%, var(--accent-soft) 0%, transparent 50%);
}
.project-card .num{ font-family: var(--f-mono); font-size: 11px; letter-spacing: .14em;
  color: var(--fg-faint); }
.project-card .title{ font-size: clamp(22px, 2.3vw, 28px); font-weight: 600;
  letter-spacing: -.02em; margin-top: 8px; line-height: 1.1; }
.project-card .sub{ font-size: 13px; color: var(--fg-dim); margin-top: 6px; }
.project-card .desc{ font-size: 13.5px; color: var(--fg-dim); line-height: 1.6;
  margin-top: 18px; max-width: 38ch; }
.project-card .foot{ display:flex; align-items:center; justify-content: space-between;
  margin-top: 22px; gap: 12px; flex-wrap: wrap; }
.project-card .stack{ display: flex; flex-wrap: wrap; gap: 5px; }
.project-card .stack span{ font-size: 10.5px; padding: 4px 8px; border-radius: 999px;
  background: var(--surface-2); border: 1px solid var(--line); color: var(--fg-dim);
  font-family: var(--f-mono); letter-spacing: .02em; }
.project-card .role{ font-size: 10.5px; color: var(--fg-faint); font-family: var(--f-mono);
  letter-spacing: .06em; text-transform: uppercase; }

/* ===== CAREER ===== */
.aurora-career{ background: var(--surface); border: 1px solid var(--line); border-radius: 18px;
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); overflow: hidden; }
.career-item{ display:grid; grid-template-columns: 140px 1fr 80px; gap: 24px;
  padding: 22px 28px; align-items: start; position: relative; }
.career-item + .career-item{ border-top: 1px solid var(--line); }
@media (max-width: 720px){ .career-item{ grid-template-columns: 1fr; gap: 6px; padding: 20px; } }
.career-year{ font-family: var(--f-mono); font-size: 11.5px; color: var(--a1);
  letter-spacing: .04em; padding-top: 4px; }
.career-body .company{ font-size: 18px; font-weight: 600; letter-spacing:-.015em; }
.career-body .role{ font-size: 13.5px; color: var(--fg-dim); margin-top: 4px; }
.career-body .note{ font-size: 12.5px; color: var(--fg-faint); margin-top: 4px; }
.career-badge{ justify-self: end; font-family: var(--f-mono);
  font-size: 10px; padding: 4px 10px; border-radius: 999px;
  border: 1px solid var(--line-2); color: var(--fg-dim);
  letter-spacing: .12em; text-transform: uppercase; }
.career-badge.current{
  background: linear-gradient(115deg, var(--a1), var(--a2));
  color: #fff; border-color: transparent;
}
@media (max-width: 720px){ .career-badge{ justify-self: start; } }

/* ===== POSTS ===== */
.aurora-posts{ display:grid; gap: 6px; }
.post-row{ display: grid; grid-template-columns: 80px 1fr auto auto; gap: 20px; align-items: center;
  padding: 18px 22px; border-radius: 14px; border: 1px solid transparent;
  transition: background .3s, border-color .3s, transform .25s; cursor: default;
}
@media (max-width: 720px){ .post-row{ grid-template-columns: 1fr; gap: 4px; padding: 16px 18px; } }
.post-row:hover{ background: var(--surface); border-color: var(--line-2); transform: translateX(4px); }
.post-row .date{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-faint); letter-spacing:.04em; }
.post-row .ptitle{ font-size: 15.5px; letter-spacing:-.01em; }
.post-row .ptag{ font-size: 10.5px; padding: 4px 9px; border-radius: 999px;
  background: var(--accent-soft); color: var(--a1); font-family: var(--f-mono);
  letter-spacing: .04em; }
.post-row .pread{ font-size: 11px; color: var(--fg-faint); font-family: var(--f-mono); }

/* ===== CONTACT ===== */
.aurora-contact{
  position: relative; padding: clamp(48px, 7vw, 88px) clamp(28px, 5vw, 64px);
  border-radius: 24px;
  background: var(--surface); border: 1px solid var(--line);
  backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%);
  overflow: hidden;
}
.aurora-contact::before{ content:""; position: absolute; inset:0;
  background:
    radial-gradient(circle at 100% 0%, var(--a1) 0%, transparent 45%),
    radial-gradient(circle at 0% 100%, var(--a2) 0%, transparent 50%);
  opacity: .14; pointer-events: none;
}
.aurora-contact-inner{ position: relative;
  display:grid; grid-template-columns: 1.2fr .8fr; gap: 40px; align-items: end; }
@media (max-width: 800px){ .aurora-contact-inner{ grid-template-columns: 1fr; gap: 24px; } }
.aurora-contact h2{ font-size: clamp(36px, 5.8vw, 70px); font-weight: 600;
  letter-spacing: -.028em; line-height: 1.0; margin: 0; }
.aurora-contact h2 .em{ font-style: normal; font-family: inherit; font-weight: inherit;
  color: var(--a1); background: none; -webkit-background-clip: initial; background-clip: initial; }
.aurora-contact p{ margin: 16px 0 0; color: var(--fg-dim);
  font-size: 14.5px; line-height: 1.55; max-width: 440px; }
.contact-links{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.contact-link{ display:flex; flex-direction:column; gap: 6px;
  padding: 16px 18px; border-radius: 12px;
  background: var(--surface-2); border: 1px solid var(--line);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  transition: transform .25s, background .25s, border-color .25s;
  cursor: default;
}
.contact-link:hover{ transform: translateY(-3px); background: var(--surface-3); border-color: var(--a1); }
.contact-link .lbl{ font-family: var(--f-mono); font-size: 10px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--fg-faint); }
.contact-link .hdl{ font-size: 13.5px; font-weight: 500; }

/* ===== FOOTER ===== */
.aurora-foot{ display:flex; justify-content: space-between; align-items: center;
  padding: 32px 0 56px; border-top: 1px solid var(--line);
  margin-top: 64px; font-size: 11px; color: var(--fg-faint);
  font-family: var(--f-mono); letter-spacing: .06em; }
@media (max-width: 600px){ .aurora-foot{ flex-direction: column; gap: 8px; } }

/* Reveal */
[data-reveal]{ opacity: 0; transform: translateY(20px);
  transition: opacity 1s ease, transform 1s cubic-bezier(.2,.8,.2,1); }
[data-reveal][data-in="1"]{ opacity: 1; transform: none; }
[data-reveal][data-delay="1"]{ transition-delay: .08s; }
[data-reveal][data-delay="2"]{ transition-delay: .16s; }
[data-reveal][data-delay="3"]{ transition-delay: .24s; }
[data-reveal][data-delay="4"]{ transition-delay: .32s; }
`;

function AuroraVariation({ theme, density }) {
  useReveal();
  const m = useMouse();

  return (
    <div className="aurora" data-theme={theme} data-density={density}>
      <style>{auroraCss}</style>
      <div className="aurora-bg">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
      </div>
      <div className="aurora-grid" />
      <div className="aurora-noise" />
      <div className="aurora-cursor" style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }} />

      <nav className="aurora-nav">
        <div className="aurora-nav-brand">
          <span className="dot" />
          <span>제진명</span>
          <span className="en">jejinni.site</span>
        </div>
        <div className="aurora-nav-links">
          <a>About</a><a>Stack</a><a>Work</a><a>Career</a><a>Writing</a><a>Contact</a>
        </div>
        <button className="aurora-nav-cta">↓ Resume</button>
      </nav>

      <main className="aurora-main">
        {/* HERO */}
        <section className="aurora-hero">
          <div>
            <div className="aurora-eyebrow" data-reveal>
              <span className="pulse" /> Available · 2026
            </div>
            <h1 className="aurora-h1">
              <span className="ln1" data-reveal data-delay="1">안녕하세요,</span>
              <span className="ln2" data-reveal data-delay="2">프론트엔드 개발자</span>
              <span className="ln3" data-reveal data-delay="3">
                <span className="name">제진명</span>입니다.
              </span>
              <span className="en" data-reveal data-delay="4">
                Je Jinmyeong, building interfaces that feel right.
              </span>
            </h1>
          </div>

          <div className="aurora-hero-bottom">
            <p className="aurora-hero-sub" data-reveal data-delay="4">
              {PROFILE.tagline}.
              디자인 시스템 · 성능 · 마이크로 인터랙션 사이의 균형을 찾는 일을 즐깁니다.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
              <div className="aurora-hero-actions" data-reveal data-delay="4">
                <button className="glass-btn primary">↓ 이력서 다운로드</button>
                <button className="glass-btn">프로젝트 보기 →</button>
              </div>
              <div className="aurora-hero-kpis" data-reveal data-delay="4">
                <div className="kpi"><div className="k">Based in</div><div className="v">Seoul</div></div>
                <div className="kpi"><div className="k">Status</div><div className="v ac">Open</div></div>
                <div className="kpi"><div className="k">Stack</div><div className="v">{TECH.length}</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 01 · About</div>
              <div className="aurora-shead-title">코드로 그리는 <em>인터페이스</em></div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              디자인 시스템과 성능, 사용자 경험 사이의 균형 — 그 사이에서 길을 만듭니다.
            </p>
          </div>

          <div className="about-qa">
            {[
              {
                q: <>어떤 <span className="hl">개발자</span>인가요?</>,
                a: <>사용자 경험을 코드로 설계하는 <span className="hl">프론트엔드 개발자</span>입니다. React와 TypeScript를 주력으로 웹 · 모바일 영역 모두에서 일해왔고, 디자이너의 의도를 한 픽셀까지 살리는 것에 집착합니다. 동시에 성능과 유지보수성을 포기하지 않는 균형을 추구합니다.</>,
                tags: ["React · TypeScript", "Web · Mobile", "5+ years"],
              },
              {
                q: <><span className="hl">무엇</span>을 즜기나요?</>,
                a: <><span className="hl">디자인 시스템</span>을 처음부터 구축하고, 컴포넌트 API를 다듬는 일을 가장 좋아합니다. 사용자가 의식하지 못하는 마이크로 인터랙션이 제품의 신뢰감을 만든다고 믿고, 그 디테일을 챙기는 일에서 보람을 느낍니다. 측정 가능한 성능 개선 또한 마찬가지입니다.</>,
                tags: ["Design Systems", "Micro-interaction", "Performance"],
              },
              {
                q: <><span className="hl">어떻게</span> 일하나요?</>,
                a: <>디자이너와 <span className="hl">가깝게 일하는 것</span>을 선호합니다. Figma 핸드오프 단계에서 인터랙션을 함께 리뷰하고, 컴포넌트 단계부터 의도를 맞추는 협업이 결과적으로 더 빠르고 정확한 제품을 만든다고 믿습니다. PR은 작고 명확하게, 컴밋은 이유와 의도가 드러나도록.</>,
                tags: ["Designer-friendly", "Component-first", "Remote OK"],
              },
            ].map((b, i) => (
              <div key={i} className="qa-block" data-reveal data-delay={Math.min(i + 1, 4)}>
                <span className="qa-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="qa-question">{b.q}</h3>
                <div className="qa-answer-wrap">
                  <p className="qa-answer">{b.a}</p>
                  <div className="qa-tags">
                    {b.tags.map((t) => <span key={t} className="qa-tag">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TECH */}
        <section className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 02 · Stack</div>
              <div className="aurora-shead-title">기술 스택</div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              아래 기술들을 사용할 수 있습니다.
            </p>
          </div>

          <div className="aurora-tech">
            {TECH_GROUPS.map((g, gi) =>
            <div key={g} className="tech-row" data-reveal data-delay={Math.min(gi + 1, 4)}>
                <div className="tech-row-label">
                  <span className="ko">{TECH_GROUPS_KO[g]}</span>
                  <span className="en">— {g}</span>
                </div>
                <div className="tech-chips">
                  {TECH.filter((t) => t.group === g).map((t) =>
                <span key={t.name} className="tech-chip"
                style={{ ['--chip-accent']: `oklch(72% 0.16 ${t.hue})` }}>
                      <span className="sq">{t.slug}</span>
                      {t.name}
                    </span>
                )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 03 · Selected Work</div>
              <div className="aurora-shead-title"><em>프로젝트</em></div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              실제 프로젝트 정보로 카드를 채워주세요. (현재는 placeholder)
            </p>
          </div>

          <div className="aurora-projects">
            {PROJECTS.map((p, i) =>
            <article key={p.idx} className="project-card"
            data-reveal data-delay={Math.min(i + 1, 4)}>
                <div>
                  <div className="num">— {p.idx}</div>
                  <h3 className="title">{p.title}</h3>
                  <div className="sub">{p.sub}</div>
                  <p className="desc">{p.desc}</p>
                </div>
                <div className="foot">
                  <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                  <div className="role">{p.role}</div>
                </div>
              </article>
            )}
          </div>
        </section>

        {/* CAREER */}
        <section className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 04 · Timeline</div>
              <div className="aurora-shead-title">커리어</div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              회사 이름과 기간을 채워주세요. (현재는 placeholder)
            </p>
          </div>

          <div className="aurora-career">
            {CAREER.map((c, i) =>
            <div key={i} className="career-item"
            data-reveal data-delay={Math.min(i + 1, 4)}>
                <div className="career-year">{c.year}</div>
                <div className="career-body">
                  <div className="company">{c.company}</div>
                  <div className="role">{c.role}</div>
                  <div className="note">{c.note}</div>
                </div>
                <div className={`career-badge ${i === 0 ? "current" : ""}`}>
                  {i === 0 ? "Now" : "Past"}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* POSTS */}
        <section className="aurora-section">
          <div className="aurora-shead">
            <div data-reveal>
              <div className="aurora-shead-tag">/ 05 · Writing</div>
              <div className="aurora-shead-title">최근 <em>글</em></div>
            </div>
            <p className="aurora-shead-sub" data-reveal data-delay="1">
              블로그 글 제목과 날짜를 채워주세요. (현재는 placeholder)
            </p>
          </div>

          <div className="aurora-posts">
            {POSTS.map((p, i) =>
            <div key={i} className="post-row"
            data-reveal data-delay={Math.min(i + 1, 4)}>
                <span className="date">{p.date}</span>
                <span className="ptitle">{p.title}</span>
                <span className="ptag">{p.tag}</span>
                <span className="pread">{p.read} →</span>
              </div>
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section className="aurora-section">
          <div className="aurora-contact" data-reveal>
            <div className="aurora-contact-inner">
              <div>
                <h2>같이 <span className="em">만들어볼까요</span>?</h2>
                <p>
                  새로운 프로젝트, 협업, 또는 그냥 인사 — 무엇이든 환영합니다.
                  보통 24시간 안에 답변드립니다.
                </p>
              </div>
              <div className="contact-links">
                {LINKS.map((l) =>
                <a key={l.label} className="contact-link">
                    <span className="lbl">{l.label}</span>
                    <span className="hdl">{l.handle}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="aurora-foot">
          <span>© 2026 제진명 · {PROFILE.site}</span>
          <span>Designed & coded with care.</span>
        </footer>
      </main>
    </div>);

}

window.AuroraVariation = AuroraVariation;