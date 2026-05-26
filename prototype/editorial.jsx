// EDITORIAL × GLASS — variation 2
// Magazine brutalism: massive display type, asymmetric grid, sharp glass panels, single accent

const editorialCss = `
.edt{
  --bg: #0d0d0c;
  --bg-2: #1a1a18;
  --fg: #f5f3ec;
  --fg-dim: rgba(245,243,236,.62);
  --fg-faint: rgba(245,243,236,.34);
  --line: rgba(245,243,236,.14);
  --glass: rgba(255,255,255,.04);
  --glass-2: rgba(255,255,255,.07);
  --accent: oklch(85% 0.18 92);  /* electric lime-yellow */
  --accent-2: oklch(72% 0.22 28); /* burnt orange */
  color: var(--fg);
  background: var(--bg);
  font-family: 'Pretendard', 'Inter', system-ui, sans-serif;
  letter-spacing: -0.01em;
  min-height: 100vh; position:relative; overflow-x:hidden;
}
.edt[data-theme="light"]{
  --bg: #f3efe6;
  --bg-2: #e8e2d2;
  --fg: #0d0d0c;
  --fg-dim: rgba(13,13,12,.66);
  --fg-faint: rgba(13,13,12,.4);
  --line: rgba(13,13,12,.16);
  --glass: rgba(13,13,12,.04);
  --glass-2: rgba(13,13,12,.07);
  --accent: oklch(68% 0.20 78);
}

/* Background grid + noise */
.edt-grid{ position:fixed; inset:0; pointer-events:none; z-index:0; opacity:.5; }
.edt-grid::before{ content:""; position:absolute; inset:0;
  background-image:
    linear-gradient(to right, var(--line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--line) 1px, transparent 1px);
  background-size: calc(100% / 12) 100%, 100% 80px;
  opacity:.5;
}
.edt-noise{ position:fixed; inset:0; pointer-events:none; z-index:1; opacity:.06; mix-blend-mode:overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.edt-blob{ position:fixed; pointer-events:none; z-index:0;
  width: 60vw; height:60vw; right:-20vw; top: 20vh; border-radius:50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 65%);
  filter: blur(120px); opacity: .22;
  animation: edtFloat 30s ease-in-out infinite alternate;
}
@keyframes edtFloat{ to{ transform: translate(-10vw, 10vh) scale(1.1); } }

/* Layout */
.edt-main{ position:relative; z-index:5; max-width: 1480px; margin: 0 auto; padding: 0 var(--gx, 40px); }
.edt[data-density="compact"]  { --gx: 28px; --gy: 70px; --hero-pad: 70px; }
.edt[data-density="regular"]  { --gx: 40px; --gy: 110px; --hero-pad: 110px; }
.edt[data-density="comfy"]    { --gx: 60px; --gy: 160px; --hero-pad: 160px; }

/* Nav */
.edt-nav{
  display:grid; grid-template-columns: 1fr auto 1fr; align-items:center;
  padding: 22px 0; border-bottom: 1px solid var(--line);
  font-family:'JetBrains Mono', ui-monospace, monospace; font-size:12px; letter-spacing:.06em;
  text-transform:uppercase;
}
.edt-nav-left{ display:flex; gap:24px; color:var(--fg-dim); }
.edt-nav-left a{ color: inherit; text-decoration:none; }
.edt-nav-mid{ font-weight:700; letter-spacing:.18em; }
.edt-nav-right{ justify-self:end; display:flex; gap:24px; align-items:center; color:var(--fg-dim); }
.edt-nav-right .dot{ width:6px; height:6px; border-radius:50%; background: var(--accent); box-shadow:0 0 10px var(--accent); }

/* Marquee */
.edt-marq{ overflow:hidden; padding: 20px 0; border-bottom: 1px solid var(--line); }
.edt-marq-track{ display:flex; gap: 40px; white-space:nowrap; animation: marq 32s linear infinite; }
.edt-marq-track > span{ font-size: clamp(28px, 4vw, 56px); font-weight:600; letter-spacing:-.02em;
  font-family:'Inter', serif; font-style: italic; }
.edt-marq-track .star{ color: var(--accent); font-style: normal; font-family: inherit; }
@keyframes marq{ to{ transform: translateX(-50%); } }

/* Hero */
.edt-hero{ padding: var(--hero-pad) 0 var(--gy); display:grid;
  grid-template-columns: 1fr 1fr; gap: 48px; align-items:end; position:relative; }
@media (max-width: 900px){ .edt-hero{ grid-template-columns: 1fr; gap: 32px; align-items:start; } }
.edt-hero-l { position: relative; }
.edt-hero-issue{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; color: var(--fg-faint); margin-bottom: 24px;
  display:flex; gap:24px; align-items:center; }
.edt-hero-issue .sq{ width:8px; height:8px; background: var(--accent); }
.edt-hero h1{
  font-family:'Pretendard', 'Inter', serif;
  font-size: clamp(72px, 13vw, 220px);
  font-weight: 700; letter-spacing: -0.04em; line-height: .85;
  margin: 0;
}
.edt-hero h1 .stk{
  display:block; -webkit-text-stroke: 1.5px var(--fg); color: transparent;
}
.edt-hero h1 .it{ display:block; font-style: italic; font-family:'Inter', serif; font-weight:400; }
.edt-hero h1 .ac{ color: var(--accent); }
.edt-hero-r{ display:flex; flex-direction:column; gap:24px; }
.edt-hero-quote{
  font-size: clamp(18px, 1.6vw, 22px); line-height: 1.5; letter-spacing:-.01em;
  border-left: 2px solid var(--accent); padding-left: 20px; color: var(--fg);
}
.edt-hero-meta{ display:grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--line); border:1px solid var(--line); }
.edt-hero-meta > div{ background: var(--bg); padding: 18px 20px; }
.edt-hero-meta .k{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.12em;
  text-transform:uppercase; color: var(--fg-faint); }
.edt-hero-meta .v{ font-size: 22px; font-weight:600; letter-spacing:-.02em; margin-top:6px; line-height:1; }
.edt-hero-cta{ display:flex; gap:8px; flex-wrap:wrap; margin-top: 8px; }

.edt-btn{ display:inline-flex; align-items:center; gap:10px;
  padding: 16px 22px; cursor:default; font-size:13px; font-weight:600;
  letter-spacing:.04em; text-transform:uppercase;
  background: var(--glass); border:1px solid var(--line);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  color: var(--fg);
  transition: background .25s, transform .25s;
}
.edt-btn:hover{ background: var(--glass-2); transform: translate(2px, -2px); box-shadow: -3px 3px 0 var(--accent); }
.edt-btn.solid{ background: var(--accent); color: #0d0d0c; border-color: var(--accent); }
.edt-btn.solid:hover{ box-shadow: -3px 3px 0 var(--fg); }

/* Section heading */
.edt-section{ padding: var(--gy) 0; border-top: 1px solid var(--line); position:relative; }
.edt-shead{ display:grid; grid-template-columns: 80px 1fr; gap: 32px; margin-bottom: 56px; align-items:start; }
.edt-shead-num{ font-family:'Inter', serif; font-style:italic; font-size: 56px; font-weight:400;
  line-height: .8; color: var(--accent); }
.edt-shead-title{ font-size: clamp(40px, 6vw, 80px); font-weight:600; letter-spacing:-.025em;
  line-height: .95; font-family:'Pretendard','Inter',sans-serif; }
.edt-shead-title em{ font-style:italic; font-family:'Inter', serif; font-weight:400; }
.edt-shead-sub{ margin-top: 14px; max-width: 520px; color: var(--fg-dim); font-size: 16px; line-height:1.6; }

/* About — magazine layout */
.edt-about{ display:grid; grid-template-columns: 1.4fr 1fr; gap: 56px; align-items: start; }
@media (max-width: 900px){ .edt-about{ grid-template-columns: 1fr; } }
.edt-about-l{ columns:1; }
.edt-about-l p{ font-size: clamp(18px, 1.5vw, 22px); line-height: 1.6; letter-spacing:-.01em;
  margin: 0 0 18px; color: var(--fg); }
.edt-about-l p:first-child::first-letter{
  font-family:'Inter', serif; font-size: 5em; font-weight:600; float:left;
  line-height: .85; padding: 6px 14px 0 0; color: var(--accent);
}
.edt-about-r{ display:flex; flex-direction:column; gap: 12px; }
.edt-about-card{
  padding: 24px; background: var(--glass); border:1px solid var(--line);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
}
.edt-about-card .k{ font-family:'JetBrains Mono', monospace; font-size:10px; letter-spacing:.16em;
  text-transform:uppercase; color: var(--fg-faint); margin-bottom: 12px; }
.edt-about-card .v{ font-size: 24px; font-weight:600; letter-spacing:-.02em; line-height:1.1; }
.edt-about-card .sub{ font-size:13px; color: var(--fg-dim); margin-top: 6px; }

/* Tech — list view */
.edt-tech{ display:flex; flex-direction:column; gap: 0; }
.edt-tech-row{ display:grid; grid-template-columns: 60px 180px 1fr 80px; gap: 20px;
  padding: 22px 0; border-top:1px solid var(--line); align-items:center; }
@media (max-width: 760px){ .edt-tech-row{ grid-template-columns: 40px 1fr; row-gap: 4px; } .edt-tech-row .__hide-sm{ display:none; } }
.edt-tech-row .n{ font-family:'JetBrains Mono', monospace; font-size:11px; color: var(--fg-faint); }
.edt-tech-row .grp{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.1em;
  text-transform:uppercase; color: var(--fg-dim); }
.edt-tech-row .items{ display:flex; flex-wrap:wrap; gap: 14px 24px; align-items:center; }
.edt-tech-row .name{ font-size: 18px; letter-spacing:-.01em; display:inline-flex; align-items:center; gap:8px; }
.edt-tech-row .name .b{ width:6px; height:6px; background: var(--accent); }
.edt-tech-row .name:hover{ color: var(--accent); }
.edt-tech-row .count{ font-family:'JetBrains Mono', monospace; font-size:11px; color: var(--fg-faint); justify-self:end; }

/* Projects — featured + grid */
.edt-projects{ display:flex; flex-direction:column; gap: 0; }
.edt-proj{
  display:grid; grid-template-columns: 80px 1fr 1fr 1fr 80px; gap: 24px;
  padding: 36px 0; border-top:1px solid var(--line); align-items:start; cursor:default;
  transition: padding .35s, background .35s;
}
.edt-proj:last-of-type{ border-bottom:1px solid var(--line); }
.edt-proj:hover{ padding: 36px 16px; background: var(--glass); }
.edt-proj .idx{ font-family:'JetBrains Mono', monospace; font-size:13px; color: var(--fg-faint); padding-top: 6px; }
.edt-proj .ttl{ font-size: clamp(28px, 3.2vw, 44px); font-weight:600; letter-spacing:-.02em; line-height:1; }
.edt-proj .ttl em{ font-style: italic; font-family:'Inter', serif; }
.edt-proj .ttl-sub{ font-size:14px; color: var(--fg-dim); margin-top:8px; }
.edt-proj .body{ font-size: 14px; color: var(--fg-dim); line-height: 1.55; }
.edt-proj .stk{ display:flex; flex-wrap:wrap; gap:8px; }
.edt-proj .stk span{ font-family:'JetBrains Mono', monospace; font-size:11px; color: var(--fg-dim);
  padding: 4px 8px; border:1px solid var(--line); }
.edt-proj .yr{ font-family:'JetBrains Mono', monospace; font-size: 12px; color: var(--fg-faint); justify-self:end; padding-top:6px; }
@media (max-width: 900px){
  .edt-proj{ grid-template-columns: 60px 1fr; row-gap: 14px; }
  .edt-proj .body, .edt-proj .stk, .edt-proj .yr{ grid-column: 2; }
}

/* Career — timeline */
.edt-career{ position:relative; }
.edt-career-row{ display:grid; grid-template-columns: 220px 1fr 60px; gap: 32px;
  padding: 32px 0; border-top: 1px solid var(--line); align-items:start; }
.edt-career-row:last-child{ border-bottom: 1px solid var(--line); }
@media (max-width: 760px){ .edt-career-row{ grid-template-columns: 1fr; gap:8px; } }
.edt-career-year{ font-family:'JetBrains Mono', monospace; font-size:12px; letter-spacing:.06em;
  color: var(--fg-faint); padding-top: 6px; }
.edt-career-body .co{ font-size: clamp(28px, 3.4vw, 42px); font-weight:600; letter-spacing:-.025em; line-height:1; }
.edt-career-body .ro{ font-size: 15px; color: var(--fg-dim); margin-top: 8px; }
.edt-career-body .nt{ font-size: 14px; color: var(--fg-faint); margin-top: 6px; max-width: 540px; }
.edt-career-mark{ font-family:'Inter', serif; font-style:italic; font-size:32px; color:var(--accent); justify-self:end; }

/* Posts — featured + list */
.edt-posts{ display:grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 900px){ .edt-posts{ grid-template-columns: 1fr; } }
.edt-post-card{
  padding: 28px; border:1px solid var(--line);
  background: var(--glass); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  display:flex; flex-direction:column; gap:12px; min-height: 220px;
  transition: transform .3s, box-shadow .3s, background .3s;
}
.edt-post-card:hover{ transform: translate(2px,-2px); box-shadow: -4px 4px 0 var(--accent); background: var(--glass-2); }
.edt-post-card .top{ display:flex; justify-content:space-between; font-family:'JetBrains Mono', monospace;
  font-size:11px; color:var(--fg-faint); letter-spacing:.08em; text-transform:uppercase; }
.edt-post-card .ttl{ font-size: 24px; font-weight:600; letter-spacing:-.015em; line-height:1.2; }
.edt-post-card .tag{ margin-top:auto; font-family:'JetBrains Mono', monospace; font-size:11px;
  letter-spacing:.08em; color: var(--accent); text-transform:uppercase; }

/* Contact */
.edt-contact{
  padding: clamp(48px, 7vw, 110px) 0; border-top:1px solid var(--line);
  display:grid; grid-template-columns: 1.3fr .8fr; gap: 60px; align-items:end;
}
@media (max-width: 900px){ .edt-contact{ grid-template-columns: 1fr; } }
.edt-contact h2{ font-size: clamp(52px, 8vw, 130px); font-weight:600; letter-spacing:-.035em;
  line-height: .88; margin: 0; }
.edt-contact h2 .it{ font-family:'Inter', serif; font-style:italic; font-weight: 400; }
.edt-contact h2 .ac{ color: var(--accent); }
.edt-contact-r{ display:flex; flex-direction:column; gap: 16px; }
.edt-contact-r p{ font-size: 17px; line-height:1.5; color: var(--fg-dim); }
.edt-contact-list{ display:flex; flex-direction:column; }
.edt-contact-list a{
  display:flex; justify-content:space-between; align-items:center;
  padding: 18px 0; border-top: 1px solid var(--line);
  font-size: 17px; color: var(--fg); text-decoration:none;
  transition: padding .3s, color .3s;
}
.edt-contact-list a:last-child{ border-bottom: 1px solid var(--line); }
.edt-contact-list a:hover{ padding-left: 12px; color: var(--accent); }
.edt-contact-list a .lbl{ font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.1em;
  text-transform: uppercase; color: var(--fg-faint); }

/* Footer */
.edt-foot{ display:grid; grid-template-columns: 1fr 1fr 1fr; gap:24px; padding: 40px 0 60px;
  border-top:1px solid var(--line);
  font-family:'JetBrains Mono', monospace; font-size:11px; letter-spacing:.06em;
  text-transform:uppercase; color: var(--fg-faint); }
.edt-foot .right{ text-align:right; }
.edt-foot .mid{ text-align:center; }

/* Reveal */
.edt [data-reveal]{ opacity:0; transform: translateY(28px); transition: opacity 1s ease, transform 1s cubic-bezier(.2,.8,.2,1); }
.edt [data-reveal][data-in="1"]{ opacity:1; transform: none; }
.edt [data-reveal][data-delay="1"]{ transition-delay: .1s; }
.edt [data-reveal][data-delay="2"]{ transition-delay: .2s; }
.edt [data-reveal][data-delay="3"]{ transition-delay: .3s; }
.edt [data-reveal][data-delay="4"]{ transition-delay: .4s; }
`;

function EditorialVariation({ theme, density }) {
  useReveal();
  return (
    <div className="edt" data-theme={theme} data-density={density}>
      <style>{editorialCss}</style>
      <div className="edt-grid" />
      <div className="edt-noise" />
      <div className="edt-blob" />

      <div className="edt-main">
        <nav className="edt-nav">
          <div className="edt-nav-left">
            <a>Index 001</a>
            <a>Year 2026</a>
          </div>
          <div className="edt-nav-mid">JEJINNI / Portfolio</div>
          <div className="edt-nav-right">
            <span className="dot" />
            <span>Open to work</span>
            <span>↓ Resume</span>
          </div>
        </nav>
      </div>

      {/* Marquee */}
      <div className="edt-marq">
        <div className="edt-marq-track">
          {Array.from({ length: 2 }).flatMap((_, k) => [
          <span key={`a${k}`}>FRONTEND DEVELOPER</span>,
          <span key={`b${k}`} className="star">✦</span>,
          <span key={`c${k}`} style={{ fontStyle: "italic" }}>Je Jinmyeong</span>,
          <span key={`d${k}`} className="star">✦</span>,
          <span key={`e${k}`}>제 진 명</span>,
          <span key={`f${k}`} className="star">✦</span>,
          <span key={`g${k}`} style={{ fontStyle: "italic" }}>Selected Works 2019—2026</span>,
          <span key={`h${k}`} className="star">✦</span>]
          )}
        </div>
      </div>

      <main className="edt-main">
        {/* HERO */}
        <section className="edt-hero">
          <div className="edt-hero-l">
            <div className="edt-hero-issue" data-reveal>
              <span className="sq" />
              <span>ISSUE №01 · SEOUL · 2026</span>
              <span>·</span>
              <span>FRONTEND</span>
            </div>
            <h1 data-reveal data-delay="1">
              <span style={{ fontSize: "200px" }}>제진명</span>
              <span className="it ac" style={{ fontSize: "200px" }}>Je Jinmyeong</span>
              <span className="stk" style={{ fontSize: "200px" }}>PORTFOLIO</span>
            </h1>
          </div>
          <div className="edt-hero-r">
            <p className="edt-hero-quote" data-reveal data-delay="2">
              "디자인 시스템과 성능 사이의 균형을 찾는 일을 가장 좋아합니다 —
              <em style={{ fontStyle: "italic" }}> 작은 디테일이 큰 차이를 만든다고 믿어요.</em>"
            </p>
            <div className="edt-hero-meta" data-reveal data-delay="3">
              <div><div className="k">Role</div><div className="v">Frontend</div></div>
              <div><div className="k">Years</div><div className="v">{PROFILE.years}</div></div>
              <div><div className="k">Based In</div><div className="v">Seoul</div></div>
              <div><div className="k">Status</div><div className="v" style={{ color: "var(--accent)" }}>Available</div></div>
            </div>
            <div className="edt-hero-cta" data-reveal data-delay="4">
              <button className="edt-btn solid">↓ Download CV</button>
              <button className="edt-btn">View Work →</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="edt-section">
          <div className="edt-shead">
            <div className="edt-shead-num" data-reveal>01.</div>
            <div>
              <div data-reveal>
                <div className="edt-shead-title">
                  <em>About</em> — 코드로 그리는 인터페이스
                </div>
              </div>
              <p className="edt-shead-sub" data-reveal data-delay="1">
                작은 디테일이 큰 차이를 만든다고 믿습니다.
              </p>
            </div>
          </div>
          <div className="edt-about">
            <div className="edt-about-l" data-reveal>
              <p>
                저는 작은 디테일이 큰 차이를 만든다고 믿습니다. 마이크로 인터랙션,
                일관된 컴포넌트 API, 측정 가능한 성능 — 이 세 가지를 무기로
                제품팀이 빠르게 움직일 수 있는 토대를 만듭니다.
              </p>
              <p>
                지난 5년간 커머스, 협업 도구, 헬스케어 영역에서 30개 이상의
                프로덕트를 출시했고, 디자인 시스템을 두 번 0에서 구축해봤습니다.
              </p>
              <p>
                React, TypeScript, 그리고 좋은 디자이너와의 협업이 제 무대입니다.
              </p>
            </div>
            <div className="edt-about-r">
              {[
              ["Focus", "Frontend Architecture", "design systems · perf · interaction"],
              ["Currently", "Atelier Lab", "Senior Frontend, since 2024"],
              ["Speaks", "Korean (Native) · English", "fluent collaboration"],
              ["Open To", "Full-time · Contract", "remote-friendly"]].
              map(([k, v, s], i) =>
              <div key={k} className="edt-about-card" data-reveal data-delay={Math.min(i + 1, 4)}>
                  <div className="k">{k}</div>
                  <div className="v">{v}</div>
                  <div className="sub">{s}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TECH */}
        <section className="edt-section">
          <div className="edt-shead">
            <div className="edt-shead-num" data-reveal>02.</div>
            <div>
              <div data-reveal><div className="edt-shead-title"><em>Stack</em> — daily tools</div></div>
              <p className="edt-shead-sub" data-reveal data-delay="1">
                실무에서 일상적으로 사용하는 도구들.
              </p>
            </div>
          </div>
          <div className="edt-tech">
            {TECH_GROUPS.map((g, gi) => {
              const items = TECH.filter((t) => t.group === g);
              return (
                <div key={g} className="edt-tech-row" data-reveal data-delay={Math.min(gi + 1, 4)}>
                  <span className="n">{String(gi + 1).padStart(2, "0")}</span>
                  <span className="grp">{g}</span>
                  <div className="items">
                    {items.map((t) =>
                    <span key={t.name} className="name">
                        <span className="b" /> {t.name}
                      </span>
                    )}
                  </div>
                  <span className="count __hide-sm">{String(items.length).padStart(2, "0")} —</span>
                </div>);

            })}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="edt-section">
          <div className="edt-shead">
            <div className="edt-shead-num" data-reveal>03.</div>
            <div>
              <div data-reveal><div className="edt-shead-title"><em>Selected</em> Work</div></div>
              <p className="edt-shead-sub" data-reveal data-delay="1">
                임팩트 중심으로 선별한 작업물. 자세한 내용은 클릭하여 확인하세요.
              </p>
            </div>
          </div>
          <div className="edt-projects">
            {PROJECTS.map((p, i) =>
            <article key={p.idx} className="edt-proj" data-reveal data-delay={Math.min(i + 1, 4)}>
                <span className="idx">№ {p.idx}</span>
                <div>
                  <div className="ttl"><em>{p.title}</em></div>
                  <div className="ttl-sub">{p.sub}</div>
                </div>
                <div className="body">{p.desc}</div>
                <div className="stk">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                <span className="yr">{p.role.split(" · ")[1] || ""} →</span>
              </article>
            )}
          </div>
        </section>

        {/* CAREER */}
        <section className="edt-section">
          <div className="edt-shead">
            <div className="edt-shead-num" data-reveal>04.</div>
            <div>
              <div data-reveal><div className="edt-shead-title"><em>Career</em> Timeline</div></div>
            </div>
          </div>
          <div className="edt-career">
            {CAREER.map((c, i) =>
            <div key={c.year} className="edt-career-row" data-reveal data-delay={Math.min(i + 1, 4)}>
                <div className="edt-career-year">{c.year}</div>
                <div className="edt-career-body">
                  <div className="co">{c.company}</div>
                  <div className="ro">{c.role}</div>
                  <div className="nt">{c.note}</div>
                </div>
                <div className="edt-career-mark">{i === 0 ? "★" : "✦"}</div>
              </div>
            )}
          </div>
        </section>

        {/* WRITING */}
        <section className="edt-section">
          <div className="edt-shead">
            <div className="edt-shead-num" data-reveal>05.</div>
            <div>
              <div data-reveal><div className="edt-shead-title"><em>Writing</em></div></div>
              <p className="edt-shead-sub" data-reveal data-delay="1">
                생각과 학습의 기록.
              </p>
            </div>
          </div>
          <div className="edt-posts">
            {POSTS.map((p, i) =>
            <a key={p.title} className="edt-post-card" data-reveal data-delay={Math.min(i + 1, 4)}>
                <div className="top">
                  <span>{p.date}</span>
                  <span>{p.read}</span>
                </div>
                <div className="ttl">{p.title}</div>
                <div className="tag">— {p.tag}</div>
              </a>
            )}
          </div>
        </section>

        {/* CONTACT */}
        <section className="edt-contact">
          <h2 data-reveal>
            <span>Let's</span>{" "}
            <span className="it ac">talk.</span>
          </h2>
          <div className="edt-contact-r" data-reveal data-delay="1">
            <p>새로운 프로젝트, 협업, 혹은 그냥 인사 — 무엇이든 환영합니다.</p>
            <div className="edt-contact-list">
              {LINKS.map((l) =>
              <a key={l.label}>
                  <span className="lbl">{l.label}</span>
                  <span>{l.handle} →</span>
                </a>
              )}
            </div>
          </div>
        </section>

        <footer className="edt-foot">
          <span>© Je Jinmyeong / 2026</span>
          <span className="mid">— jejinni.site —</span>
          <span className="right">No. 001 / Edition 2026</span>
        </footer>
      </main>
    </div>);

}

window.EditorialVariation = EditorialVariation;