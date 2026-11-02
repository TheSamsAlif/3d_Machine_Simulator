import * as THREE from 'three';

// =========================================================================
// PELAGOS OC-8 · ROBOTIC CEPHALOPOD EIGHT-ARM SUBSEA DRONE
// 1600x900 FIXED-VIRTUAL RESPONSIVE CONSOLE & 3D SIMULATOR
// =========================================================================

const W = 1600;
const H = 900;

const app = document.getElementById('app');

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
  
  :root {
    --bg-lab: #f6f4f0;
    --text-dark: #1a1917;
    --text-muted: #8c8983;
    --text-faint: #b8b5ae;
    --border-line: #e3dfd7;
    --accent-orange: #ff4800;
    --accent-orange-bg: #fff0eb;
    --accent-green: #0ea569;
    --accent-green-bg: #e6f7ef;
    --panel-bg: rgba(255, 255, 255, 0.95);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: var(--bg-lab); font-family: 'Inter', sans-serif; color: var(--text-dark); user-select: none; }
  
  #app {
    position: absolute;
    left: 0;
    top: 0;
    width: ${W}px;
    height: ${H}px;
    transform-origin: 0 0;
    overflow: hidden;
  }

  #canvas-container { position: absolute; inset: 0; width: ${W}px; height: ${H}px; }
  #gl { width: ${W}px; height: ${H}px; display: block; cursor: grab; }
  #gl.grabbing { cursor: grabbing; }
  #labels-canvas { position: absolute; inset: 0; pointer-events: none; width: ${W}px; height: ${H}px; z-index: 10; }

  /* UI Layer */
  #hud-layer { position: absolute; inset: 0; pointer-events: none; z-index: 20; }
  .interactive { pointer-events: auto; }

  /* Top Bar */
  .top-bar { position: absolute; top: 20px; left: 28px; right: 28px; display: flex; justify-content: space-between; align-items: flex-start; }
  .brand-group { display: flex; align-items: stretch; gap: 14px; }
  .logo-box { background: var(--accent-orange); color: #fff; border-radius: 4px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; }
  .logo-box svg { width: 20px; height: 20px; fill: currentColor; }
  .title-block { display: flex; flex-direction: column; justify-content: center; }
  .title-tag { font-size: 8.5px; font-weight: 600; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
  .title-main { font-size: 22px; font-weight: 800; letter-spacing: -0.3px; color: var(--text-dark); line-height: 1.1; margin-top: 1px; }
  .title-main span { color: var(--accent-orange); font-weight: 400; margin-left: 2px; }
  .title-sub { font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; }

  /* Top Center Specs */
  .top-center { display: flex; align-items: center; gap: 28px; background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 7px 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.03); }
  .spec-item { display: flex; flex-direction: column; gap: 2px; font-family: 'JetBrains Mono', monospace; }
  .spec-label { font-size: 8px; font-weight: 600; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
  .spec-val { font-size: 11px; font-weight: 700; color: var(--text-dark); }
  .lift-load-bar { width: 140px; height: 7px; background: #e8e5de; border-radius: 2px; overflow: hidden; display: flex; gap: 2px; }
  .lift-seg { flex: 1; height: 100%; background: #d0ccc3; }
  .lift-seg.fill { background: var(--text-dark); }
  .status-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: var(--accent-green); background: var(--accent-green-bg); padding: 2px 8px; border-radius: 3px; }
  .status-badge.orange { color: var(--accent-orange); background: var(--accent-orange-bg); }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

  /* Left & Right Fixed Columns */
  .panel-col-left { position: absolute; left: 28px; top: 92px; width: 230px; display: flex; flex-direction: column; gap: 10px; pointer-events: auto; }
  .panel-col-right { position: absolute; right: 28px; top: 92px; width: 230px; display: flex; flex-direction: column; gap: 10px; pointer-events: auto; }

  .tech-card { background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 11px 13px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .card-title { font-size: 8.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--text-dark); display: flex; align-items: center; gap: 6px; }
  .card-title::before { content: ''; display: inline-block; width: 3px; height: 9px; background: var(--accent-orange); }
  .card-idx { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 600; color: var(--text-faint); }

  /* Metric Numbers */
  .metric-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
  .metric-big { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; letter-spacing: -1px; color: var(--text-dark); line-height: 1; }
  .metric-unit { font-size: 10px; font-weight: 600; color: var(--text-muted); margin-left: 2px; }
  .metric-sub { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: var(--text-dark); }

  /* Jet Canvas */
  .wave-canvas { width: 100%; height: 38px; border-bottom: 1px solid var(--border-line); margin-bottom: 4px; display: block; }
  .wave-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 7.5px; color: var(--text-muted); }

  /* Battery Gauge */
  .power-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 6px; padding-top: 5px; border-top: 1px solid var(--border-line); font-family: 'JetBrains Mono', monospace; }
  .power-sub { font-size: 7.5px; color: var(--text-muted); text-transform: uppercase; }
  .power-val { font-size: 9.5px; font-weight: 700; color: var(--text-dark); }
  .battery-bars { display: flex; gap: 2px; height: 10px; margin-top: 3px; }
  .battery-seg { flex: 1; border-radius: 1px; background: #e5e2da; }
  .battery-seg.fill-red { background: var(--accent-orange); }
  .battery-seg.fill-green { background: var(--accent-green); }

  /* Arm Curl Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; margin-bottom: 3.5px; }
  .servo-name { width: 20px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 6px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--accent-orange); transition: width 0.3s ease; }
  .servo-val { width: 40px; text-align: right; font-weight: 600; color: var(--text-dark); }
  .servo-val.detached { color: var(--accent-orange); font-size: 7.5px; font-weight: 700; }

  /* Buttons Grid */
  .btn-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 3px; }
  .pill-btn {
    border: 1px solid var(--border-line);
    background: #fff;
    color: var(--text-dark);
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    padding: 5px 3px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }
  .pill-btn:hover { border-color: var(--text-dark); }
  .pill-btn.active { background: var(--accent-orange); color: #fff; border-color: var(--accent-orange); }

  /* Attitude Horizon */
  .horizon-wrapper { display: flex; align-items: center; gap: 10px; margin-top: 3px; }
  .horizon-circle { width: 56px; height: 56px; border-radius: 50%; background: #edeae2; border: 1px solid var(--border-line); position: relative; overflow: hidden; }
  .horizon-sky { position: absolute; inset: 0; background: #f0ece3; }
  .horizon-line { position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: var(--accent-orange); transform-origin: center; }
  .horizon-stats { display: flex; flex-direction: column; gap: 2px; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; }
  .h-stat { display: flex; justify-content: space-between; gap: 8px; }
  .h-lbl { color: var(--text-muted); font-size: 7.5px; }
  .h-num { font-weight: 700; color: var(--text-dark); }

  /* Subsystems List */
  .subsys-item { display: flex; justify-content: space-between; align-items: center; padding: 3px 0; border-bottom: 1px solid #f2efe8; }
  .subsys-item:last-child { border-bottom: none; }
  .subsys-left { display: flex; flex-direction: column; gap: 1px; }
  .subsys-name { font-size: 8px; font-weight: 700; color: var(--text-dark); font-family: 'JetBrains Mono', monospace; }
  .subsys-desc { font-size: 7px; color: var(--text-muted); }
  .subsys-tag { font-family: 'JetBrains Mono', monospace; font-size: 7.5px; font-weight: 700; padding: 1px 5px; border-radius: 2px; }
  .subsys-tag.green { background: var(--accent-green-bg); color: var(--accent-green); }
  .subsys-tag.orange { background: var(--accent-orange-bg); color: var(--accent-orange); }

  /* Center Bottom Status Overlay */
  .subsea-mode-tag { position: absolute; left: 280px; bottom: 84px; display: flex; flex-direction: column; pointer-events: none; }
  .subsea-mode-sub { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
  .subsea-mode-big { font-size: 26px; font-weight: 800; color: var(--accent-orange); letter-spacing: -0.5px; line-height: 1.1; }
  .subsea-mode-spec { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px; }

  /* Bottom Timeline Bar - PINNED AT BOTTOM */
  .bottom-bar {
    position: absolute;
    left: 28px;
    right: 28px;
    bottom: 20px;
    height: 48px;
    background: var(--panel-bg);
    border: 1px solid var(--border-line);
    border-radius: 6px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    pointer-events: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  .play-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-orange); border: none; cursor: pointer; display: grid; place-items: center; color: #fff; flex-shrink: 0; box-shadow: 0 2px 6px rgba(255, 72, 0, 0.3); }
  .play-btn svg { width: 13px; height: 13px; fill: currentColor; }
  .timeline-track { flex: 1; height: 5px; background: #e5e1d7; border-radius: 2px; position: relative; cursor: pointer; }
  .timeline-progress { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent-orange); border-radius: 2px; width: 48%; }
  .timeline-thumb { position: absolute; left: 48%; top: 50%; width: 11px; height: 11px; background: #fff; border: 2.5px solid var(--accent-orange); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .timeline-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 7.5px; color: var(--text-muted); }

  /* Screen Space Callout Labels */
  .dom-label {
    position: absolute;
    pointer-events: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    color: var(--text-dark);
    letter-spacing: 0.8px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.25s ease;
    transform: translate(12px, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 2px 6px;
    border-radius: 3px;
    border-left: 2px solid var(--accent-orange);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .dom-label .sub { display: block; font-size: 7px; font-weight: 500; color: var(--text-muted); }
`;
document.head.appendChild(style);

app.innerHTML = `
  <div id="canvas-container">
    <canvas id="gl"></canvas>
    <canvas id="labels-canvas"></canvas>
  </div>

  <div id="hud-layer">
    <!-- Top Bar -->
    <div class="top-bar interactive">
      <div class="brand-group">
        <div class="logo-box">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          OC-8
        </div>
        <div class="title-block">
          <div class="title-tag">CONTINUUM SOFT-ARM SUBSEA DRONE</div>
          <div class="title-main">Pelagos OC-8<span>/</span></div>
          <div class="title-sub">CEPHALOPOD DRONE · 8 CONTINUUM ARMS</div>
        </div>
      </div>

      <!-- Top Center Specs -->
      <div class="top-center">
        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:09:14</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">DEPTH</span>
          <span class="spec-val">12.42 M</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">CHAMBER LOAD</span>
          <div class="lift-load-bar" id="load-bar"></div>
        </div>
        <div class="spec-item">
          <span class="spec-label">STATUS</span>
          <span class="status-badge" id="val-status"><span class="status-dot"></span> <span id="val-status-text">HOLDING</span></span>
        </div>
      </div>

      <!-- Assembly Selector -->
      <div style="display:flex; gap:4px; background:var(--panel-bg); border:1px solid var(--border-line); border-radius:6px; padding:4px;">
        <button class="pill-btn active" data-assembly="hero">HERO</button>
        <button class="pill-btn" data-assembly="optics">OPTICS</button>
        <button class="pill-btn" data-assembly="mantle">MANTLE</button>
        <button class="pill-btn" data-assembly="armr2">ARM R2</button>
        <button class="pill-btn" data-assembly="siphon">SIPHON</button>
        <button class="pill-btn" data-assembly="beak">BEAK</button>
      </div>
    </div>

    <!-- Operating Mode Overlay -->
    <div class="subsea-mode-tag">
      <span class="subsea-mode-sub">OPERATING MODE</span>
      <span class="subsea-mode-big" id="mode-title">HOLDING</span>
      <span class="subsea-mode-spec" id="mode-desc">STATION KEEPING · 12.42 M DEPTH</span>
    </div>

    <!-- Left Column -->
    <div class="panel-col-left">
      <!-- 01 DEPTH -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">DEPTH</span>
          <span class="card-idx">01</span>
        </div>
        <div class="metric-row">
          <div>
            <span class="metric-big">12.42</span>
            <span class="metric-unit">M</span>
          </div>
          <span class="metric-sub">0.0 M/S</span>
        </div>
        <canvas class="wave-canvas" id="jet-canvas" width="200" height="38"></canvas>
        <div class="wave-meta">
          <span>SIPHON PULSE</span>
          <span>1.85 HZ</span>
          <span>STABLE</span>
        </div>
      </div>

      <!-- 02 POWER -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">POWER</span>
          <span class="card-idx">02</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span class="metric-big">78</span>
            <span class="metric-unit">%</span>
            <div style="font-size:7px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">BATTERY</div>
          </div>
          <div class="battery-bars" style="width:110px;">
            <div class="battery-seg fill-red"></div>
            <div class="battery-seg fill-red"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg"></div>
            <div class="battery-seg"></div>
          </div>
        </div>
        <div class="power-stats">
          <div>
            <div class="power-sub">DRAW</div>
            <div class="power-val">9.4 W</div>
          </div>
          <div>
            <div class="power-sub">CELL</div>
            <div class="power-val">3.72 V</div>
          </div>
          <div>
            <div class="power-sub">TEMP</div>
            <div class="power-val">25 °C</div>
          </div>
        </div>
      </div>

      <!-- 03 ARM CURL -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">ARM CURL</span>
          <span class="card-idx">03</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:5px; text-transform:uppercase;">
          <span>CURL PER ARM</span>
          <span>TIP SPIRAL</span>
          <span style="color:var(--accent-green); font-weight:700;" id="tag-curl-mode">HOLDING</span>
        </div>
        <div id="arm-rows"></div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="panel-col-right">
      <!-- 04 DIVE -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">DIVE</span>
          <span class="card-idx">04</span>
        </div>
        <div class="horizon-wrapper">
          <div class="horizon-circle">
            <div class="horizon-sky"></div>
            <div class="horizon-line" id="horizon-line"></div>
          </div>
          <div class="horizon-stats">
            <div class="h-stat"><span class="h-lbl">PITCH</span><span class="h-num">+0.4°</span></div>
            <div class="h-stat"><span class="h-lbl">ROLL</span><span class="h-num">-1.2°</span></div>
            <div class="h-stat"><span class="h-lbl">HEADING</span><span class="h-num">184° S</span></div>
          </div>
        </div>
      </div>

      <!-- 05 ACTUATORS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">ACTUATORS</span>
          <span class="card-idx">05</span>
        </div>
        <div class="metric-row">
          <div>
            <span class="metric-big" id="val-press">16</span>
            <span class="metric-unit">BAR</span>
          </div>
          <span class="metric-sub" style="color:var(--accent-green);">HYDRAULIC</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-family:'JetBrains Mono'; color:var(--text-muted); margin-top:2px;">
          <span>PUMP SPEED</span>
          <span style="font-weight:700; color:var(--text-dark);">2,400 RPM</span>
        </div>
      </div>

      <!-- 06 DISPLAY -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">DISPLAY</span>
          <span class="card-idx">06</span>
        </div>
        <div class="btn-grid-3">
          <button class="pill-btn active" id="btn-labels">LABELS</button>
          <button class="pill-btn" id="btn-exploded">EXPLODED</button>
          <button class="pill-btn" id="btn-jetwake">JET WAKE</button>
        </div>
        <button class="pill-btn" id="btn-turntable" style="width:100%; margin-top:4px;">TURNTABLE</button>
      </div>

      <!-- 07 SUBSYSTEMS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">SUBSYSTEMS</span>
          <span class="card-idx">07</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">01 OPTIC ARRAY</span>
            <span class="subsys-desc">2 x 52 MM LENS · IR RIM</span>
          </div>
          <span class="subsys-tag green">TRACKING</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">02 MANTLE HULL</span>
            <span class="subsys-desc">6 HINGED PETALS</span>
          </div>
          <span class="subsys-tag green">SEALED</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">03 REACTOR PUMP</span>
            <span class="subsys-desc">7 RADIAL PISTONS · 44T GEAR</span>
          </div>
          <span class="subsys-tag green">ACTIVE</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">04 CONTINUUM ARMS</span>
            <span class="subsys-desc">282 LINKS · 489 WHEELS</span>
          </div>
          <span class="subsys-tag green">HOLDING</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">05 BEAK MECHANISM</span>
            <span class="subsys-desc">TITANIUM RADULA</span>
          </div>
          <span class="subsys-tag green">READY</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">06 SIPHON JET</span>
            <span class="subsys-desc">4 VECTOR VANES</span>
          </div>
          <span class="subsys-tag green">TRIMMED</span>
        </div>
      </div>
    </div>

    <!-- Bottom Bar (Strictly pinned at bottom 20px) -->
    <div class="bottom-bar">
      <button class="play-btn" id="btn-play">
        <svg viewBox="0 0 24 24" id="play-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; font-size:7px; font-weight:700; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:3px; text-transform:uppercase;">
          <span style="color:var(--text-dark); display:flex; align-items:center; gap:4px;"><span style="color:var(--accent-orange);">|</span> OPERATION LOG</span>
          <span>DIVE</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · ISOLATE ARM R2</span>
          <span>SURFACE</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:3px;">
          <span id="timeline-time">00:12 / 00:25</span>
          <span>8 OPERATOR ACTIONS</span>
        </div>
      </div>
    </div>
  </div>
`;

// Responsive Scaling Engine (Identical to V8 & Cessna architecture)
function fitViewport() {
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  const left = (window.innerWidth - W * scale) / 2;
  const top = (window.innerHeight - H * scale) / 2;
  app.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
}
window.addEventListener('resize', fitViewport);
fitViewport();

// Populate load bar
const loadBar = document.getElementById('load-bar');
for (let i = 0; i < 20; i++) {
  const seg = document.createElement('div');
  seg.className = `lift-seg ${i < 14 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate Arm Curl rows (R1..R4, L1..L4)
const armRowsContainer = document.getElementById('arm-rows');
const armData = [
  { id: 'R1', val: 91 },
  { id: 'R2', val: 75 },
  { id: 'R3', val: 89 },
  { id: 'R4', val: 86 },
  { id: 'L1', val: 67 },
  { id: 'L2', val: 85 },
  { id: 'L3', val: 88 },
  { id: 'L4', val: 79 }
];

armData.forEach(item => {
  const row = document.createElement('div');
  row.className = 'servo-row';
  row.id = `servo-row-${item.id}`;
  row.innerHTML = `
    <span class="servo-name">${item.id}</span>
    <div class="servo-track">
      <div class="servo-fill" id="servo-fill-${item.id}" style="width: ${item.val}%;"></div>
    </div>
    <span class="servo-val" id="servo-val-${item.id}">${item.val}%</span>
  `;
  armRowsContainer.appendChild(row);
});

// =========================================================================
// THREE.JS 3D SCENE SETUP & STUDIO LIGHTING
// =========================================================================

const canvas = document.getElementById('gl');
const labelsCanvas = document.getElementById('labels-canvas');
labelsCanvas.width = W;
labelsCanvas.height = H;
const labelsCtx = labelsCanvas.getContext('2d');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
camera.position.set(4.2, 2.2, 4.4);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

// Studio Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xfffbf5, 2.6);
mainKeyLight.position.set(6, 9, 6);
mainKeyLight.castShadow = true;
mainKeyLight.shadow.mapSize.width = 2048;
mainKeyLight.shadow.mapSize.height = 2048;
mainKeyLight.shadow.camera.near = 0.5;
mainKeyLight.shadow.camera.far = 25;
mainKeyLight.shadow.camera.left = -5;
mainKeyLight.shadow.camera.right = 5;
mainKeyLight.shadow.camera.top = 5;
mainKeyLight.shadow.camera.bottom = -5;
mainKeyLight.shadow.bias = -0.0001;
scene.add(mainKeyLight);

const fillLight = new THREE.DirectionalLight(0xebf3ff, 0.9);
fillLight.position.set(-6, 3, -5);
scene.add(fillLight);

// Studio Floor Shadow Receiver
const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.ShadowMaterial({ opacity: 0.15 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.92;
floor.receiveShadow = true;
scene.add(floor);

// Precision Grid Helper
const gridHelper = new THREE.GridHelper(14, 28, 0xd8d4cc, 0xe9e5dc);
gridHelper.position.y = -0.91;
scene.add(gridHelper);

// 3D Orbit Calibration Circles
const orbitRingsGroup = new THREE.Group();
scene.add(orbitRingsGroup);
[1.4, 2.2, 3.2].forEach(r => {
  const circleGeo = new THREE.BufferGeometry();
  const pts = [];
  for (let a = 0; a <= 72; a++) {
    const ang = (a / 72) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r));
  }
  circleGeo.setFromPoints(pts);
  const ringLine = new THREE.Line(circleGeo, new THREE.LineDashedMaterial({ color: 0xd2cfc6, dashSize: 0.08, gapSize: 0.06 }));
  ringLine.computeLineDistances();
  ringLine.position.y = 0.1;
  orbitRingsGroup.add(ringLine);
});

// =========================================================================
// PREMIUM STUDIO MATERIALS (Physical clearcoat & brushed titanium)
// =========================================================================

const whiteShellMat = new THREE.MeshPhysicalMaterial({
  color: 0xfcfbf8,
  metalness: 0.08,
  roughness: 0.20,
  clearcoat: 1.0,
  clearcoatRoughness: 0.08,
  reflectivity: 0.85
});

const orangeMat = new THREE.MeshStandardMaterial({
  color: 0xff4800,
  metalness: 0.45,
  roughness: 0.25
});

const darkMechMat = new THREE.MeshStandardMaterial({
  color: 0x18181c,
  metalness: 0.88,
  roughness: 0.32
});

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xf2f2f4,
  metalness: 0.96,
  roughness: 0.08
});

const copperMat = new THREE.MeshStandardMaterial({
  color: 0xd9743c,
  metalness: 0.82,
  roughness: 0.28
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.95,
  opacity: 1.0,
  transparent: true,
  roughness: 0.05,
  ior: 1.52,
  thickness: 0.1,
  clearcoat: 1.0,
  side: THREE.DoubleSide
});

const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0x0a182c,
  metalness: 0.92,
  roughness: 0.04,
  transmission: 0.70,
  reflectivity: 0.95,
  clearcoat: 1.0
});

// Helper for bevelled gear disc
function makeGearDisc(radius, thickness, teeth, colorMat, holeRadius = 0) {
  const group = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 36), colorMat);
  group.add(disc);

  const toothW = (Math.PI * 2 * radius) / teeth * 0.45;
  const toothH = radius * 0.12;
  for (let i = 0; i < teeth; i++) {
    const ang = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(toothW, thickness * 0.98, toothH), colorMat);
    tooth.position.set(Math.cos(ang) * (radius + toothH * 0.45), 0, Math.sin(ang) * (radius + toothH * 0.45));
    tooth.rotation.y = -ang;
    group.add(tooth);
  }
  if (holeRadius > 0) {
    const bore = new THREE.Mesh(new THREE.CylinderGeometry(holeRadius, holeRadius, thickness * 1.05, 20), darkMechMat);
    group.add(bore);
  }
  return group;
}

// =========================================================================
// 3D MODEL HIERARCHY: PELAGOS OC-8
// =========================================================================

const octoRoot = new THREE.Group();
scene.add(octoRoot);

const coreGroup = new THREE.Group();
const mantleGroup = new THREE.Group();
const opticsGroup = new THREE.Group();
const siphonGroup = new THREE.Group();
const beakGroup = new THREE.Group();
const armsGroup = new THREE.Group();

octoRoot.add(coreGroup);
octoRoot.add(mantleGroup);
octoRoot.add(opticsGroup);
octoRoot.add(siphonGroup);
octoRoot.add(beakGroup);
octoRoot.add(armsGroup);

// --- 1. CENTRAL PRESSURE HULL & INNER REACTOR CORE ---
const hullMesh = new THREE.Mesh(new THREE.SphereGeometry(0.64, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.65), whiteShellMat);
hullMesh.castShadow = true;
hullMesh.receiveShadow = true;
coreGroup.add(hullMesh);

// Equatorial Circumference Ring with Rivets
const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.642, 0.014, 12, 48), orangeMat);
ringMesh.rotation.x = Math.PI / 2;
coreGroup.add(ringMesh);

for (let r = 0; r < 28; r++) {
  const ang = (r / 28) * Math.PI * 2;
  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), darkMechMat);
  rivet.position.set(Math.cos(ang) * 0.645, 0, Math.sin(ang) * 0.645);
  coreGroup.add(rivet);
}

// Inner Dense Reactor Pump Core (Spectacular when mantle blossoms!)
const reactorCoreGroup = new THREE.Group();
coreGroup.add(reactorCoreGroup);

const innerCoreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 24), darkMechMat);
reactorCoreGroup.add(innerCoreSphere);

// 7 Radial Pump Core Pistons
const pistons = [];
for (let p = 0; p < 7; p++) {
  const ang = (p / 7) * Math.PI * 2;
  const pistonGroup = new THREE.Group();
  pistonGroup.position.set(Math.cos(ang) * 0.3, 0.12, Math.sin(ang) * 0.3);
  pistonGroup.rotation.y = -ang;

  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.28, 18), darkMechMat);
  sleeve.rotation.z = Math.PI / 2;
  pistonGroup.add(sleeve);

  const orangeRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.01, 8, 16), orangeMat);
  orangeRing.rotation.y = Math.PI / 2;
  pistonGroup.add(orangeRing);

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.22, 14), chromeMat);
  rod.rotation.z = Math.PI / 2;
  pistonGroup.add(rod);

  reactorCoreGroup.add(pistonGroup);
  pistons.push({ group: pistonGroup, basePos: pistonGroup.position.clone(), dir: new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)) });
}

// Interlocking Drive Gears (44 x 36 teeth)
const driveGear1 = makeGearDisc(0.36, 0.06, 44, orangeMat, 0.08);
driveGear1.position.y = 0.12;
reactorCoreGroup.add(driveGear1);

const driveGear2 = makeGearDisc(0.26, 0.08, 36, darkMechMat, 0.06);
driveGear2.position.set(0.12, 0.22, 0);
reactorCoreGroup.add(driveGear2);

// Dense tangled conduit harnesses (braided pipes & copper lines)
for (let w = 0; w < 32; w++) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.35),
    new THREE.Vector3((Math.random() - 0.5) * 0.65, 0.2 + (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.65),
    new THREE.Vector3((Math.random() - 0.5) * 0.45, 0.35 + (Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.45)
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.011, 6, false), w % 3 === 0 ? orangeMat : (w % 3 === 1 ? darkMechMat : copperMat));
  reactorCoreGroup.add(tube);
}

// --- 2. OPTIC TURRETS (TWIN 52MM LENSES WITH ORANGE BEZELS) ---
function createOpticTurret() {
  const turret = new THREE.Group();
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.14, 32), whiteShellMat);
  base.rotation.x = Math.PI / 2;
  base.castShadow = true;
  turret.add(base);

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.026, 16, 36), orangeMat);
  bezel.position.z = 0.08;
  turret.add(bezel);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 32), darkMechMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.07;
  turret.add(barrel);

  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  lens.rotation.x = -Math.PI / 2;
  lens.position.z = 0.09;
  turret.add(lens);

  const irDot = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), orangeMat);
  irDot.position.z = 0.11;
  turret.add(irDot);

  return turret;
}

const eyeL = createOpticTurret();
eyeL.position.set(-0.36, 0.08, 0.44);
eyeL.rotation.set(0.15, -0.55, 0);
opticsGroup.add(eyeL);

const eyeR = createOpticTurret();
eyeR.position.set(0.36, 0.08, 0.44);
eyeR.rotation.set(0.15, 0.55, 0);
opticsGroup.add(eyeR);

// --- 3. 6 HINGED MANTLE PETALS (OPENS DRAMATICALLY TO REVEAL REACTOR) ---
const mantlePetals = [];
const numPetals = 6;

for (let i = 0; i < numPetals; i++) {
  const petalPivot = new THREE.Group();
  const angle = (i / numPetals) * Math.PI * 2;
  
  petalPivot.rotation.y = angle;
  petalPivot.position.set(0, 0.28, 0);

  // Curved Shell Petal
  const petalGeo = new THREE.CylinderGeometry(0.44, 0.66, 0.54, 18, 1, false, -0.46, 0.92);
  const petalMesh = new THREE.Mesh(petalGeo, whiteShellMat);
  petalMesh.position.set(0, 0.2, 0.16);
  petalMesh.rotation.x = -0.32;
  petalMesh.castShadow = true;
  petalMesh.receiveShadow = true;
  petalPivot.add(petalMesh);

  // Circular glass inspection port on Petal 2
  if (i === 1) {
    const portBezel = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.016, 12, 28), orangeMat);
    portBezel.position.set(0, 0.24, 0.56);
    portBezel.rotation.x = -0.32;
    petalPivot.add(portBezel);

    const portGlass = new THREE.Mesh(new THREE.CircleGeometry(0.078, 24), glassMat);
    portGlass.position.copy(portBezel.position);
    portGlass.rotation.copy(portBezel.rotation);
    petalPivot.add(portGlass);
  }

  mantleGroup.add(petalPivot);
  mantlePetals.push({ pivot: petalPivot, baseAngle: angle, mesh: petalMesh });
}

// Mantle Top Cap
const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 0.1, 28), whiteShellMat);
topCap.position.y = 0.72;
topCap.castShadow = true;
mantleGroup.add(topCap);

const topCapBezel = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 12, 36), orangeMat);
topCapBezel.rotation.x = Math.PI / 2;
topCapBezel.position.y = 0.77;
mantleGroup.add(topCapBezel);

// --- 4. VENTRAL SIPHON JET & BEAK ---
const siphonMesh = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 24, 1, true), whiteShellMat);
siphonMesh.rotation.x = -Math.PI / 2 + 0.4;
siphonMesh.position.set(0, -0.44, 0.36);
siphonMesh.castShadow = true;
siphonGroup.add(siphonMesh);

const siphonRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 12, 28), orangeMat);
siphonRing.position.copy(siphonMesh.position);
siphonRing.rotation.copy(siphonMesh.rotation);
siphonGroup.add(siphonRing);

const beakJaw = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.25, 4), darkMechMat);
beakJaw.rotation.x = Math.PI;
beakJaw.position.set(0, -0.56, 0);
beakGroup.add(beakJaw);

// --- 5. 8 SEGMENTED CONTINUUM TENTACLE ARMS (HIGH-FIDELITY OVERHAUL) ---
// Each arm rests gracefully along the studio floor (y = -0.92) in natural S-curves
// Dual bold orange suction wheels per link with concentric hubs & bevelled pods!
const arms = [];
const numArms = 8;
const linksPerArm = 12;

for (let a = 0; a < numArms; a++) {
  const armId = a < 4 ? `R${a + 1}` : `L${a - 3}`;
  const baseAngle = (a / numArms) * Math.PI * 2;
  
  const armRoot = new THREE.Group();
  armRoot.position.set(Math.cos(baseAngle) * 0.54, -0.22, Math.sin(baseAngle) * 0.54);
  armRoot.rotation.y = -baseAngle + Math.PI / 2;
  armsGroup.add(armRoot);

  // Root actuator socket
  const socketMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.14, 24), darkMechMat);
  socketMesh.rotation.x = Math.PI / 2;
  armRoot.add(socketMesh);

  const socketBezel = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 12, 28), orangeMat);
  armRoot.add(socketBezel);

  // Segmented links chain
  const linkObjects = [];
  let prevParent = armRoot;

  for (let l = 0; l < linksPerArm; l++) {
    const linkGroup = new THREE.Group();
    const linkLen = 0.22 * Math.pow(0.93, l);
    linkGroup.position.z = l === 0 ? 0.08 : linkLen;

    const radius = 0.15 * Math.pow(0.92, l);
    
    // Armored cylindrical white shell with bevel
    const isGlassLink = (armId === 'R2' && (l === 3 || l === 4));
    const shellMat = isGlassLink ? glassMat : whiteShellMat;
    
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius, linkLen, 20), shellMat);
    shell.rotation.x = Math.PI / 2;
    shell.position.z = linkLen / 2;
    shell.castShadow = true;
    linkGroup.add(shell);

    // If glass link: show internal orange gear train and actuator rod inside!
    if (isGlassLink) {
      const innerGear = makeGearDisc(radius * 0.58, 0.03, 16, orangeMat, radius * 0.15);
      innerGear.position.z = linkLen / 2;
      linkGroup.add(innerGear);

      const innerRod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, linkLen * 0.92, 10), chromeMat);
      innerRod.rotation.x = Math.PI / 2;
      innerRod.position.z = linkLen / 2;
      linkGroup.add(innerRod);
    }

    // Orange joint ring collar with mechanical knurl
    const collar = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.02, 0.014, 8, 20), orangeMat);
    collar.position.z = 0.01;
    linkGroup.add(collar);

    // Mechanical joint knuckle connector
    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.72, 14, 12), darkMechMat);
    knuckle.position.z = 0.0;
    linkGroup.add(knuckle);

    // Ventral side: TWO suction wheels per link with gear tooth rims & dark vacuum ports
    [-1, 1].forEach(offset => {
      const suctionGroup = new THREE.Group();
      suctionGroup.position.set(offset * radius * 0.45, -radius * 0.95, linkLen / 2);
      suctionGroup.rotation.x = Math.PI / 2;

      const suctionWheel = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.42, radius * 0.45, 0.045, 16), orangeMat);
      suctionGroup.add(suctionWheel);

      const suctionBore = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.28, 14), darkMechMat);
      suctionBore.position.y = 0.024;
      suctionBore.rotation.x = -Math.PI / 2;
      suctionGroup.add(suctionBore);

      linkGroup.add(suctionGroup);
    });

    // Dorsal hydraulic orange tube segment
    const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, linkLen, 8), orangeMat);
    hose.position.set(0, radius * 0.95, linkLen / 2);
    hose.rotation.x = Math.PI / 2;
    linkGroup.add(hose);

    prevParent.add(linkGroup);
    linkObjects.push({ group: linkGroup, baseLen: linkLen, radius, isGlassLink });
    prevParent = linkGroup;
  }

  arms.push({
    id: armId,
    root: armRoot,
    baseAngle,
    links: linkObjects,
    curlOffset: a * 0.78
  });
}

// =========================================================================
// CALLOUT LABELS & LEADER LINES
// =========================================================================

const calloutDefs = [
  { id: 'optics', text: 'OPTIC ARRAY', sub: '2 x 52 MM LENS · IR RIM', getPos: () => eyeR.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.12, 0.05, 0.1)) },
  { id: 'mantle', text: 'SHELL PETAL', sub: '6 x HINGED · GLASS PORT', getPos: () => mantlePetals[1].pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.45, 0.35)) },
  { id: 'reactor', text: 'REACTOR RING', sub: 'PUMP DRIVE · 7 PISTONS', getPos: () => reactorCoreGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.22, 0)) },
  { id: 'drive', text: 'DRIVE GEARS', sub: '44 x 36 TEETH', getPos: () => driveGear1.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.2, 0, 0)) },
  { id: 'root', text: 'ROOT ACTUATOR', sub: 'ARM R2 · 2 DOF', getPos: () => arms[1].root.getWorldPosition(new THREE.Vector3()) },
  { id: 'glass_link', text: 'GLASS LINK', sub: 'GEAR TRAIN', getPos: () => arms[1].links[3].group.getWorldPosition(new THREE.Vector3()) },
  { id: 'wheels', text: 'ARM CHAINS', sub: '282 LINKS · 489 WHEELS', getPos: () => arms[4].links[5].group.getWorldPosition(new THREE.Vector3()) },
  { id: 'siphon', text: 'SIPHON JET', sub: 'VECTOR NOZZLE', getPos: () => siphonMesh.getWorldPosition(new THREE.Vector3()) }
];

const domLabels = [];
calloutDefs.forEach(def => {
  const el = document.createElement('div');
  el.className = 'dom-label';
  el.innerHTML = `${def.text}<span class="sub">${def.sub}</span>`;
  document.getElementById('canvas-container').appendChild(el);
  domLabels.push({ def, el });
});

// =========================================================================
// INTERACTIVE CONTROLS & CAMERA SYSTEM
// =========================================================================

let currentAssembly = 'hero';
let showLabels = true;
let isExploded = false;
let isTurntable = false;
let isPlaying = true;
let showJetWake = false;

let mantleOpenFactor = 0;
let armApartFactor = 0;
let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, -0.2, 0);
let currentLookAt = new THREE.Vector3(0, -0.2, 0);
let spherical = new THREE.Spherical(5.4, Math.PI / 2.7, 0.88);

let isPointerDown = false;
let prevPointerX = 0;
let prevPointerY = 0;

canvas.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  prevPointerX = e.clientX;
  prevPointerY = e.clientY;
  canvas.classList.add('grabbing');
});

window.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;
  const dx = e.clientX - prevPointerX;
  const dy = e.clientY - prevPointerY;
  prevPointerX = e.clientX;
  prevPointerY = e.clientY;

  spherical.theta -= dx * 0.006;
  spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.02, spherical.phi - dy * 0.006));
});

window.addEventListener('pointerup', () => {
  isPointerDown = false;
  canvas.classList.remove('grabbing');
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  spherical.radius = Math.max(2.0, Math.min(9.0, spherical.radius + e.deltaY * 0.004));
}, { passive: false });

// Assembly Selector Buttons
const assemblyBtns = document.querySelectorAll('[data-assembly]');
assemblyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    assemblyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    setAssemblyMode(btn.dataset.assembly);
  });
});

function setAssemblyMode(mode) {
  currentAssembly = mode;
  const titleEl = document.getElementById('mode-title');
  const descEl = document.getElementById('mode-desc');
  const statusBadge = document.getElementById('val-status');
  const statusText = document.getElementById('val-status-text');

  if (mode === 'hero') {
    titleEl.textContent = 'HOLDING';
    descEl.textContent = 'STATION KEEPING · 12.42 M DEPTH';
    statusText.textContent = 'HOLDING';
    statusBadge.className = 'status-badge';
    document.getElementById('tag-curl-mode').textContent = 'HOLDING';
    spherical.radius = 5.4;
    spherical.phi = Math.PI / 2.7;
    camLookAt.set(0, -0.2, 0);
  } else if (mode === 'optics') {
    titleEl.textContent = 'OPTIC ARRAY';
    descEl.textContent = '2 x 52 MM LENS · IR RIM';
    statusText.textContent = 'OPTICS';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 2.5;
    camLookAt.set(0, 0.1, 0.45);
  } else if (mode === 'mantle') {
    titleEl.textContent = 'MANTLE OPEN';
    descEl.textContent = '6 PETALS · 65% APART';
    statusText.textContent = 'MANTLE OPEN';
    statusBadge.className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · ISOLATE MANTLE';
    spherical.radius = 4.2;
    spherical.phi = Math.PI / 3.0;
    camLookAt.set(0, 0.35, 0);
  } else if (mode === 'armr2') {
    titleEl.textContent = 'ARM R2 APART';
    descEl.textContent = 'ARM R2 · 48% APART';
    statusText.textContent = 'ARM R2 APART';
    statusBadge.className = 'status-badge orange';
    document.getElementById('tag-curl-mode').textContent = 'DETACHED';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · ISOLATE ARM R2';
    spherical.radius = 5.0;
    spherical.phi = Math.PI / 2.6;
    spherical.theta = 1.35;
    camLookAt.set(-0.6, -0.2, 0);
  } else if (mode === 'siphon') {
    titleEl.textContent = 'SIPHON JET';
    descEl.textContent = '2 SLEEVES · 4-FLAP NOZZLE';
    statusText.textContent = 'SIPHON';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.6;
    spherical.phi = Math.PI / 2.0;
    camLookAt.set(0, -0.4, 0.35);
  } else if (mode === 'beak') {
    titleEl.textContent = 'BEAK JAW';
    descEl.textContent = 'TITANIUM RADULA · SEALED';
    statusText.textContent = 'BEAK';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.5;
    spherical.phi = Math.PI / 1.8;
    camLookAt.set(0, -0.55, 0);
  }
}

// Display Buttons
const btnLabels = document.getElementById('btn-labels');
btnLabels.addEventListener('click', () => {
  showLabels = !showLabels;
  btnLabels.classList.toggle('active', showLabels);
});

const btnExploded = document.getElementById('btn-exploded');
btnExploded.addEventListener('click', () => {
  isExploded = !isExploded;
  btnExploded.classList.toggle('active', isExploded);
  if (isExploded) {
    document.getElementById('mode-title').textContent = 'EXPLODED';
    document.getElementById('mode-desc').textContent = 'TURNTABLE · 100% DISASSEMBLED';
    document.getElementById('val-status-text').textContent = 'EXPLODED';
    document.getElementById('val-status').className = 'status-badge orange';
  } else {
    setAssemblyMode(currentAssembly);
  }
});

const btnTurntable = document.getElementById('btn-turntable');
btnTurntable.addEventListener('click', () => {
  isTurntable = !isTurntable;
  btnTurntable.classList.toggle('active', isTurntable);
});

const btnJetWake = document.getElementById('btn-jetwake');
btnJetWake.addEventListener('click', () => {
  showJetWake = !showJetWake;
  btnJetWake.classList.toggle('active', showJetWake);
});

const btnPlay = document.getElementById('btn-play');
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('play-icon').innerHTML = isPlaying ?
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' :
    '<path d="M8 5v14l11-7z"/>';
});

// Jet Pulse Canvas
const jetCanvas = document.getElementById('jet-canvas');
const jetCtx = jetCanvas.getContext('2d');
let jetWaveOffset = 0;

function drawJetWave(time) {
  jetCtx.clearRect(0, 0, jetCanvas.width, jetCanvas.height);
  jetCtx.strokeStyle = '#e8e5de';
  jetCtx.lineWidth = 1;
  jetCtx.beginPath();
  jetCtx.moveTo(0, jetCanvas.height / 2);
  jetCtx.lineTo(jetCanvas.width, jetCanvas.height / 2);
  jetCtx.stroke();

  jetCtx.strokeStyle = '#ff4800';
  jetCtx.lineWidth = 1.8;
  jetCtx.beginPath();

  const w = jetCanvas.width;
  const h = jetCanvas.height;
  const mid = h / 2;
  const amp = isPlaying ? 8 : 2;

  for (let x = 0; x < w; x++) {
    const y = mid - Math.sin((x * 0.08) - jetWaveOffset) * amp;
    if (x === 0) jetCtx.moveTo(x, y);
    else jetCtx.lineTo(x, y);
  }
  jetCtx.stroke();
}

// =========================================================================
// MAIN ANIMATION LOOP & KINEMATICS
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 12;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    jetWaveOffset += delta * 3.5;
    elapsedSimTime += delta;
    if (isTurntable) {
      spherical.theta += delta * 0.3;
    }
  }

  // Camera lerp
  const targetCamPos = new THREE.Vector3().setFromSpherical(spherical).add(camLookAt);
  camera.position.lerp(targetCamPos, 0.08);
  currentLookAt.lerp(camLookAt, 0.08);
  camera.lookAt(currentLookAt);

  // Animation Target Factors
  const targetMantleOpen = (currentAssembly === 'mantle' || isExploded) ? 1.0 : 0.0;
  mantleOpenFactor += (targetMantleOpen - mantleOpenFactor) * 0.08;

  const targetArmApart = (currentAssembly === 'armr2') ? 1.0 : 0.0;
  armApartFactor += (targetArmApart - armApartFactor) * 0.08;

  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // 1. MANTLE OPEN KINEMATICS
  mantlePetals.forEach((p, idx) => {
    p.pivot.rotation.x = -mantleOpenFactor * 1.13;
  });
  topCap.position.y = 0.72 + mantleOpenFactor * 0.65;
  topCapBezel.position.y = 0.77 + mantleOpenFactor * 0.65;

  // Spin reactor pump gears and pulse pistons
  if (isPlaying) {
    driveGear1.rotation.y += delta * 2.0;
    driveGear2.rotation.y -= delta * 2.8;

    pistons.forEach((pst, idx) => {
      const pulse = Math.sin(time * 6.0 + idx) * 0.04;
      pst.group.position.copy(pst.basePos).addScaledVector(pst.dir, pulse);
    });
  }

  // Subsea gentle buoyant breathing bob
  const bobY = Math.sin(time * 1.8) * 0.025;
  const bobRoll = Math.sin(time * 1.2) * 0.012;
  octoRoot.position.y = bobY;
  octoRoot.rotation.z = bobRoll;

  // 2. 8 CONTINUUM TENTACLE ARMS KINEMATICS
  // In holding pose: arms sweep downward towards the ground plane (y = -0.92)
  // and curl naturally outward with underside suction cups touching the floor
  arms.forEach((arm, aIdx) => {
    const isArmR2 = (arm.id === 'R2');

    if (isArmR2 && armApartFactor > 0.01) {
      // In ARM R2 APART mode:
      // Arm R2 separates and extends straight horizontally into an exploded inspection line
      arm.root.position.x = THREE.MathUtils.lerp(Math.cos(arm.baseAngle) * 0.54, -0.65, armApartFactor);
      arm.root.position.y = THREE.MathUtils.lerp(-0.22, 0.25, armApartFactor);
      arm.root.position.z = THREE.MathUtils.lerp(Math.sin(arm.baseAngle) * 0.54, 0.15, armApartFactor);
      arm.root.rotation.y = THREE.MathUtils.lerp(-arm.baseAngle + Math.PI / 2, -Math.PI / 2, armApartFactor);

      arm.links.forEach((link, lIdx) => {
        const targetZ = lIdx * (link.baseLen + 0.16 * armApartFactor);
        link.group.position.z = THREE.MathUtils.lerp(link.baseLen, targetZ, armApartFactor);
        link.group.rotation.set(0, 0, 0); // straight inspection line
      });

      const r2ValEl = document.getElementById('servo-val-R2');
      if (r2ValEl) {
        r2ValEl.textContent = 'DETACHED';
        r2ValEl.className = 'servo-val detached';
      }
    } else {
      // Normal HOLDING mode:
      // Links 0-3 angle downwards to reach floor level (y = -0.92)
      // Links 4-11 curve outward along floor plane in organic S-curves
      arm.root.position.set(Math.cos(arm.baseAngle) * 0.54, -0.22, Math.sin(arm.baseAngle) * 0.54);
      arm.root.rotation.y = -arm.baseAngle + Math.PI / 2;

      arm.links.forEach((link, lIdx) => {
        link.group.position.z = lIdx === 0 ? 0.08 : link.baseLen;

        let bendX = 0;
        let bendY = 0;
        if (lIdx < 4) {
          // Downward plunge towards floor
          bendX = 0.22 + Math.sin(time * 1.6 + arm.curlOffset) * 0.02;
          bendY = Math.sin(time * 1.2 + aIdx) * 0.02;
        } else if (lIdx < 8) {
          // Level out along floor
          bendX = -0.08 + Math.cos(time * 1.4 + arm.curlOffset) * 0.02;
          bendY = 0.12 + Math.sin(time * 1.5 + lIdx) * 0.03;
        } else {
          // Gentle tip spiral
          bendX = 0.06;
          bendY = 0.22 + Math.sin(time * 2.0 + lIdx) * 0.04;
        }

        link.group.rotation.x = bendX;
        link.group.rotation.y = bendY;
      });

      if (isArmR2) {
        const r2ValEl = document.getElementById('servo-val-R2');
        if (r2ValEl) {
          r2ValEl.textContent = '75%';
          r2ValEl.className = 'servo-val';
        }
      }
    }
  });

  // UI & HUD UPDATES
  renderScreenLabels();
  drawJetWave(time);
  updateTelemetryUI(time);

  renderer.render(scene, camera);
}

function renderScreenLabels() {
  labelsCtx.clearRect(0, 0, W, H);
  if (!showLabels) {
    domLabels.forEach(item => { item.el.style.opacity = '0'; });
    return;
  }

  domLabels.forEach(({ def, el }) => {
    const pos3D = def.getPos();
    const p = pos3D.clone().project(camera);

    if (p.z > 1.0) {
      el.style.opacity = '0';
      return;
    }

    const sx = (p.x * 0.5 + 0.5) * W;
    const sy = (-p.y * 0.5 + 0.5) * H;

    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
    el.style.opacity = '1';

    labelsCtx.strokeStyle = 'rgba(255, 72, 0, 0.4)';
    labelsCtx.lineWidth = 1.2;
    labelsCtx.beginPath();
    labelsCtx.arc(sx, sy, 3, 0, Math.PI * 2);
    labelsCtx.fillStyle = '#ff4800';
    labelsCtx.fill();

    labelsCtx.moveTo(sx, sy);
    labelsCtx.lineTo(sx + 10, sy);
    labelsCtx.stroke();
  });
}

function updateTelemetryUI(time) {
  const totalSec = Math.floor(elapsedSimTime);
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const s = String(totalSec % 60).padStart(2, '0');
  document.getElementById('val-runtime').textContent = `00:${m}:${s}`;
  document.getElementById('timeline-time').textContent = `00:${s} / 00:25`;

  const pressVal = (16.0 + Math.sin(time * 2.5) * 1.2).toFixed(0);
  const pressEl = document.getElementById('val-press');
  if (pressEl) pressEl.textContent = pressVal;

  const rollDeg = (Math.sin(time * 1.2) * 1.76).toFixed(2);
  const hLine = document.getElementById('horizon-line');
  if (hLine) {
    hLine.style.transform = `rotate(${rollDeg * 8}deg)`;
  }
}

requestAnimationFrame(animate);
