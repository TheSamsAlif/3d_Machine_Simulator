import * as THREE from 'three';

// =========================================================================
// MELLIS HB-7 · ROBOTIC POLLINATOR MICRO AIR VEHICLE
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

  /* Canvas wave */
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

  /* Leg Servos Rows */
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
  .flight-mode-tag { position: absolute; left: 280px; bottom: 84px; display: flex; flex-direction: column; pointer-events: none; }
  .flight-mode-sub { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
  .flight-mode-big { font-size: 26px; font-weight: 800; color: var(--accent-orange); letter-spacing: -0.5px; line-height: 1.1; }
  .flight-mode-spec { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px; }

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
  .timeline-progress { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent-orange); border-radius: 2px; width: 85%; }
  .timeline-thumb { position: absolute; left: 85%; top: 50%; width: 11px; height: 11px; background: #fff; border: 2.5px solid var(--accent-orange); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
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
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          HB-7
        </div>
        <div class="title-block">
          <div class="title-tag">ROBOTIC POLLINATOR · MICRO AIR VEHICLE</div>
          <div class="title-main">Mellis HB-7<span>/</span></div>
          <div class="title-sub">FLAPPING-WING DRONE / FIELD SIMULATOR</div>
        </div>
      </div>

      <div class="top-center">
        <div class="spec-item">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span class="spec-label">LIFT LOAD</span>
            <span class="spec-label" style="color:var(--text-dark); font-weight:700;">66%</span>
          </div>
          <div class="lift-load-bar" id="load-bar"></div>
          <div style="display:flex; justify-content:space-between; font-size:6.5px; color:var(--text-muted); margin-top:1px;">
            <span>IDLE</span>
            <span>HOVER</span>
            <span>MAX</span>
          </div>
        </div>

        <div class="spec-item">
          <span class="spec-label">SIM ID</span>
          <span class="spec-val">HB7-0412</span>
        </div>

        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:00:21</span>
        </div>

        <div class="spec-item">
          <span class="spec-label">STATUS</span>
          <span class="status-badge" id="val-status">
            <span class="status-dot"></span>
            <span id="val-status-text">HOVER</span>
          </span>
        </div>

        <div class="spec-item">
          <span class="spec-label">OPERATOR</span>
          <span class="spec-val">LAB 3 - R.K.</span>
        </div>
      </div>
    </div>

    <!-- Center Floating Flight Status Tag -->
    <div class="flight-mode-tag">
      <span class="flight-mode-sub">FLIGHT MODE</span>
      <span class="flight-mode-big" id="mode-title">HOVER</span>
      <span class="flight-mode-spec" id="mode-desc">STATION KEEPING · 144 MM AGL</span>
    </div>

    <!-- Left Column -->
    <div class="panel-col-left">
      <!-- 01 WING BEAT -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">WING BEAT</span>
          <span class="card-idx">01</span>
        </div>
        <div class="metric-row">
          <div>
            <span class="metric-big" id="val-freq">7.5</span>
            <span class="metric-unit">HZ</span>
            <div style="font-size:7px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">STROKE FREQUENCY</div>
          </div>
          <div style="text-align:right;">
            <span class="metric-sub" id="val-amp">±32°</span>
            <div style="font-size:7px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">AMPLITUDE</div>
          </div>
        </div>
        <canvas class="wave-canvas" id="wing-canvas" width="200" height="38"></canvas>
        <div class="wave-meta">
          <span>-1.2 S</span>
          <span>PLAYBACK 1.0x</span>
          <span>SHUTTER 1/60</span>
          <span>NOW</span>
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
            <span class="metric-big">80</span>
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
            <div class="power-val" id="val-draw">34.0 W</div>
          </div>
          <div>
            <div class="power-sub">CELL</div>
            <div class="power-val">3.70 V</div>
          </div>
          <div>
            <div class="power-sub">MOTOR</div>
            <div class="power-val">41 °C</div>
          </div>
        </div>
      </div>

      <!-- 03 LEG SERVOS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">LEG SERVOS</span>
          <span class="card-idx">03</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:5px; text-transform:uppercase;">
          <span>LOAD PER LEG</span>
          <span>KNEE TORQUE</span>
          <span style="color:var(--accent-green); font-weight:700;">PASSIVE</span>
        </div>
        <div id="arm-rows"></div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="panel-col-right">
      <!-- 04 FLIGHT -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">FLIGHT</span>
          <span class="card-idx">04</span>
        </div>
        <div class="horizon-wrapper">
          <div class="horizon-circle">
            <div class="horizon-sky"></div>
            <div class="horizon-line" id="horizon-line"></div>
          </div>
          <div class="horizon-stats">
            <div class="h-stat"><span class="h-lbl">ALT AGL</span><span class="h-num" id="val-alt">144.0 MM</span></div>
            <div class="h-stat"><span class="h-lbl">V/S</span><span class="h-num">+0.6 MM/S</span></div>
            <div class="h-stat"><span class="h-lbl">PITCH</span><span class="h-num">+0.03°</span></div>
            <div class="h-stat"><span class="h-lbl">ROLL</span><span class="h-num">-0.57°</span></div>
          </div>
        </div>
      </div>

      <!-- 05 ASSEMBLIES -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">ASSEMBLIES</span>
          <span class="card-idx">05</span>
        </div>
        <div class="btn-grid-3">
          <button class="pill-btn active" data-assembly="hero">HERO</button>
          <button class="pill-btn" data-assembly="optics">OPTICS</button>
          <button class="pill-btn" data-assembly="wing">WING</button>
          <button class="pill-btn" data-assembly="leg">LEG L2</button>
          <button class="pill-btn" data-assembly="thorax">THORAX</button>
          <button class="pill-btn" data-assembly="abdomen">ABDOMEN</button>
        </div>
      </div>

      <!-- 06 DISPLAY -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">DISPLAY</span>
          <span class="card-idx">06</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:4px;">
          <button class="pill-btn active" id="btn-labels">LABELS</button>
          <button class="pill-btn" id="btn-exploded">EXPLODED</button>
          <button class="pill-btn active" id="btn-motion">MOTION BLUR</button>
        </div>
        <div style="margin-top:4px;">
          <button class="pill-btn" id="btn-turntable" style="width:100%;">TURNTABLE</button>
        </div>
      </div>

      <!-- 07 SUBSYSTEMS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">SUBSYSTEMS</span>
          <span class="card-idx">07</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">01 OPTIC HEAD</span>
            <span class="subsys-desc">2 x 18 MM LENS · AMBER IR</span>
          </div>
          <span class="subsys-tag green" id="sub-01">TRACKING</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">02 NECK BEARING</span>
            <span class="subsys-desc">10-SEGMENT COLLAR</span>
          </div>
          <span class="subsys-tag green" id="sub-02">LOCKED</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">03 THORAX DRIVE</span>
            <span class="subsys-desc">3 GEARS · 11 ACTUATORS</span>
          </div>
          <span class="subsys-tag green" id="sub-03">ENGAGED</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">04 WING ROOTS</span>
            <span class="subsys-desc">4 HINGES · 7.5 HZ CRANK</span>
          </div>
          <span class="subsys-tag green" id="sub-04">7.5 HZ</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">05 LEG SERVOS</span>
            <span class="subsys-desc">6 LEGS · 3 JOINTS</span>
          </div>
          <span class="subsys-tag green" id="sub-05">ACTIVE</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">06 ABDOMEN CAPSULE</span>
            <span class="subsys-desc">GEAR TRAIN · RETURN SPRING</span>
          </div>
          <span class="subsys-tag green" id="sub-06">SEALED</span>
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
          <span style="color:var(--text-dark); display:flex; align-items:center; gap:4px;"><span style="color:var(--accent-orange);">|</span> FLIGHT LOG</span>
          <span>TAKE-OFF</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · HERO · RELEASE</span>
          <span>LAND</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:3px;">
          <span id="timeline-time">00:21 / 00:24</span>
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
  seg.className = `lift-seg ${i < 13 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate Leg Servos rows (L1..L3, R1..R3) matching Image 1
const armRowsContainer = document.getElementById('arm-rows');
const legData = [
  { id: 'L1', val: 57 },
  { id: 'L2', val: 74 },
  { id: 'L3', val: 63 },
  { id: 'R1', val: 54 },
  { id: 'R2', val: 73 },
  { id: 'R3', val: 63 }
];

legData.forEach(item => {
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
const labelsCtx = labelsCanvas.getContext('2d');

canvas.width = W;
canvas.height = H;
labelsCanvas.width = W;
labelsCanvas.height = H;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
camera.position.set(3.4, 1.8, 3.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

// Studio Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xfffbf5, 2.5);
mainKeyLight.position.set(5, 8, 5);
mainKeyLight.castShadow = true;
mainKeyLight.shadow.mapSize.width = 2048;
mainKeyLight.shadow.mapSize.height = 2048;
mainKeyLight.shadow.bias = -0.0001;
scene.add(mainKeyLight);

const fillLight = new THREE.DirectionalLight(0xedf4ff, 0.85);
fillLight.position.set(-6, 3, -4);
scene.add(fillLight);

// Studio Floor Shadow Receiver
const floor = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), new THREE.ShadowMaterial({ opacity: 0.16 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.0;
floor.receiveShadow = true;
scene.add(floor);

// Precision Grid Helper
const gridHelper = new THREE.GridHelper(12, 24, 0xd8d4cc, 0xe9e5dc);
gridHelper.position.y = -0.99;
scene.add(gridHelper);

// 3D Teardown Orbit Calibration Circles (Image 2)
const orbitRingsGroup = new THREE.Group();
orbitRingsGroup.visible = false;
scene.add(orbitRingsGroup);

[1.1, 1.7, 2.3].forEach(r => {
  const circleGeo = new THREE.BufferGeometry();
  const pts = [];
  for (let a = 0; a <= 72; a++) {
    const ang = (a / 72) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r));
  }
  circleGeo.setFromPoints(pts);
  const ringLine = new THREE.Line(circleGeo, new THREE.LineDashedMaterial({ color: 0xcdcac0, dashSize: 0.08, gapSize: 0.06 }));
  ringLine.computeLineDistances();
  ringLine.position.y = 0.2;
  orbitRingsGroup.add(ringLine);
});

// Materials
const whiteShellMat = new THREE.MeshStandardMaterial({ color: 0xfaf8f5, metalness: 0.08, roughness: 0.22 });
const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff4800, metalness: 0.42, roughness: 0.26 });
const darkMechMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.88, roughness: 0.35 });
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe6e4e0, metalness: 0.95, roughness: 0.12 });
const copperMat = new THREE.MeshStandardMaterial({ color: 0xc86a36, metalness: 0.82, roughness: 0.3 });
const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x050b16, metalness: 0.92, roughness: 0.04, transmission: 0.65, reflectivity: 0.95, clearcoat: 1.0 });
const wingMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.86, transparent: true, roughness: 0.12, thickness: 0.04, clearcoat: 1.0, side: THREE.DoubleSide });
const motionBlurMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, side: THREE.DoubleSide });

// 3D Model Hierarchy
const beeRoot = new THREE.Group();
scene.add(beeRoot);

const headGroup = new THREE.Group();
const neckGroup = new THREE.Group();
const thoraxGroup = new THREE.Group();
const gearCoreGroup = new THREE.Group();
const abdomenGroup = new THREE.Group();
const wingsGroup = new THREE.Group();
const legsGroup = new THREE.Group();
const hardwareGroup = new THREE.Group();

beeRoot.add(headGroup, neckGroup, thoraxGroup, gearCoreGroup, abdomenGroup, wingsGroup, legsGroup, hardwareGroup);

// --- 1. HEAD & OPTICS ---
headGroup.position.set(0, 0.18, 0.68);
const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 36, 28), whiteShellMat);
headMesh.scale.set(0.96, 0.92, 1.15);
headMesh.castShadow = true;
headGroup.add(headMesh);

const snoutGroup = new THREE.Group();
snoutGroup.position.set(0, 0.02, 0.38);
headGroup.add(snoutGroup);

const snoutBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.08, 32), darkMechMat);
snoutBase.rotation.x = Math.PI / 2;
snoutGroup.add(snoutBase);

const snoutOrangeRim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.032, 16, 36), orangeMat);
snoutOrangeRim.position.z = 0.05;
snoutGroup.add(snoutOrangeRim);

const eyeLens = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
eyeLens.rotation.x = -Math.PI / 2;
eyeLens.position.z = 0.09;
snoutGroup.add(eyeLens);

const irDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), orangeMat);
irDot.position.z = 0.11;
snoutGroup.add(irDot);

// Lateral Optics
function createSideOptic(side) {
  const g = new THREE.Group();
  g.position.set(side * 0.32, 0.04, 0.15);
  g.rotation.set(0, side * 0.7, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.088, 0.016, 12, 24), orangeMat);
  ring.position.z = 0.03;
  g.add(ring);
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  lens.rotation.x = -Math.PI / 2;
  lens.position.z = 0.035;
  g.add(lens);
  return g;
}
headGroup.add(createSideOptic(-1), createSideOptic(1));

// Antennae
function createAntenna(side) {
  const ant = new THREE.Group();
  ant.position.set(side * 0.14, 0.32, 0.18);
  ant.rotation.set(-0.25, side * 0.12, side * 0.28);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 12), darkMechMat);
  stem.position.y = 0.31;
  stem.castShadow = true;
  ant.add(stem);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.026, 0.16, 16), orangeMat);
  tip.position.y = 0.65;
  ant.add(tip);
  return ant;
}
const antL = createAntenna(-1);
const antR = createAntenna(1);
headGroup.add(antL, antR);

// --- 2. 10-SEGMENT NECK COLLAR BEARING ---
neckGroup.position.set(0, 0.15, 0.4);
const collarOuter = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.032, 16, 36), orangeMat);
neckGroup.add(collarOuter);

const neckBeads = [];
for (let b = 0; b < 10; b++) {
  const ang = (b / 10) * Math.PI * 2;
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), chromeMat);
  bead.position.set(Math.cos(ang) * 0.34, Math.sin(ang) * 0.34, 0);
  neckGroup.add(bead);
  neckBeads.push(bead);
}

// --- 3. THORAX & INNER DRIVE GEAR TRAIN ---
thoraxGroup.position.set(0, 0.12, 0);
const thoraxTop = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.72, 32, 1, false, 0, Math.PI), whiteShellMat);
thoraxTop.rotation.set(0, 0, Math.PI / 2);
thoraxTop.rotation.y = Math.PI / 2;
thoraxTop.castShadow = true;
thoraxGroup.add(thoraxTop);

const tRibbon1 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.018, 12, 36), orangeMat);
tRibbon1.position.z = -0.22;
thoraxGroup.add(tRibbon1);
const tRibbon2 = tRibbon1.clone();
tRibbon2.position.z = 0.22;
thoraxGroup.add(tRibbon2);

// Functional Gears
gearCoreGroup.position.set(0, 0.12, 0);
const gears = [];
[
  { z: -0.16, r: 0.28, teeth: 24, mat: darkMechMat },
  { z: 0.0, r: 0.34, teeth: 32, mat: orangeMat },
  { z: 0.16, r: 0.26, teeth: 20, mat: darkMechMat }
].forEach((g, idx) => {
  const gearPivot = new THREE.Group();
  gearPivot.position.z = g.z;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(g.r, g.r, 0.05, g.teeth), g.mat);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  gearPivot.add(rim);
  gearCoreGroup.add(gearPivot);
  gears.push({ group: gearPivot, dir: idx % 2 === 0 ? 1 : -1, speed: 2.5 + idx * 0.8 });
});

for (let w = 0; w < 16; w++) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.2, -0.25),
    new THREE.Vector3((Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 0.35, 0),
    new THREE.Vector3((Math.random() - 0.5) * 0.25, (Math.random() - 0.5) * 0.2, 0.25)
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.01, 6, false), w % 3 === 0 ? orangeMat : (w % 3 === 1 ? darkMechMat : copperMat));
  gearCoreGroup.add(tube);
}

// --- 4. ABDOMEN CAPSULE ---
abdomenGroup.position.set(0, 0.08, -0.72);
const abdSegments = [];
for (let s = 0; s < 4; s++) {
  const segGroup = new THREE.Group();
  segGroup.position.z = -s * 0.22;
  const rad = 0.42 * Math.pow(0.88, s);
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.88, rad, 0.24, 28), whiteShellMat);
  shell.rotation.x = Math.PI / 2;
  shell.castShadow = true;
  segGroup.add(shell);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.016, 10, 28), orangeMat);
  ring.position.z = 0.11;
  segGroup.add(ring);
  abdomenGroup.add(segGroup);
  abdSegments.push(segGroup);
}

const stingerTip = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.36, 20), darkMechMat);
stingerTip.rotation.x = -Math.PI / 2;
stingerTip.position.z = -0.92;
abdomenGroup.add(stingerTip);

// --- 5. 4 WINGS & MOTION BLUR FANS ---
wingsGroup.position.set(0, 0.42, 0.05);
const wingLRoot = new THREE.Group();
wingLRoot.position.set(-0.36, 0, 0);
wingsGroup.add(wingLRoot);

const wingRRoot = new THREE.Group();
wingRRoot.position.set(0.36, 0, 0);
wingsGroup.add(wingRRoot);

function createVeinedWing(isLeft, isForewing) {
  const wing = new THREE.Group();
  const dir = isLeft ? -1 : 1;
  const scale = isForewing ? 1.0 : 0.72;

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 16), orangeMat);
  hinge.rotation.z = Math.PI / 2;
  wing.add(hinge);

  const spar = new THREE.Mesh(new THREE.CylinderGeometry(0.018 * scale, 0.008 * scale, 2.1 * scale, 12), darkMechMat);
  spar.position.set(dir * 1.05 * scale, 0, 0.38 * scale);
  spar.rotation.z = -dir * 0.42;
  wing.add(spar);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(dir * 0.6 * scale, 0.2 * scale, dir * 1.4 * scale, 0.7 * scale, dir * 2.1 * scale, 0.82 * scale);
  shape.bezierCurveTo(dir * 2.15 * scale, 0.65 * scale, dir * 1.6 * scale, 0.15 * scale, dir * 0.7 * scale, -0.05 * scale);
  shape.bezierCurveTo(dir * 0.25 * scale, -0.08 * scale, 0, 0, 0, 0);

  const membrane = new THREE.Mesh(new THREE.ShapeGeometry(shape, 24), wingMat);
  membrane.rotation.x = -Math.PI / 2;
  membrane.castShadow = true;
  wing.add(membrane);

  const veinLines = [
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(dir * 0.9 * scale, 0, 0.38 * scale), new THREE.Vector3(dir * 2.0 * scale, 0, 0.8 * scale)],
    [new THREE.Vector3(dir * 0.5 * scale, 0, 0.2 * scale), new THREE.Vector3(dir * 0.7 * scale, 0, 0.05 * scale)],
    [new THREE.Vector3(dir * 1.0 * scale, 0, 0.42 * scale), new THREE.Vector3(dir * 1.3 * scale, 0, 0.18 * scale)]
  ];
  veinLines.forEach(pts => {
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x222226, transparent: true, opacity: 0.6 }));
    wing.add(line);
  });

  return wing;
}

const forewingL = createVeinedWing(true, true);
const hindwingL = createVeinedWing(true, false);
hindwingL.position.set(-0.06, -0.04, -0.16);
wingLRoot.add(forewingL, hindwingL);

const forewingR = createVeinedWing(false, true);
const hindwingR = createVeinedWing(false, false);
hindwingR.position.set(0.06, -0.04, -0.16);
wingRRoot.add(forewingR, hindwingR);

function createMotionBlurFan(isLeft) {
  const dir = isLeft ? -1 : 1;
  const fanGeo = new THREE.RingGeometry(0.25, 2.15, 32, 1, isLeft ? Math.PI * 0.78 : -Math.PI * 0.28, Math.PI * 0.5);
  const fan = new THREE.Mesh(fanGeo, motionBlurMat);
  fan.rotation.x = Math.PI / 2;
  fan.position.set(dir * 0.22, 0, 0.2);
  return fan;
}
const blurFanL = createMotionBlurFan(true);
const blurFanR = createMotionBlurFan(false);
wingLRoot.add(blurFanL);
wingRRoot.add(blurFanR);

// --- 6. 6 ARTICULATED ROBOTIC LEGS (TRIPOD STANCE) ---
const legs = [];
const legSpecs = [
  { id: 'L1', side: -1, z: 0.28, angY: 0.45, kneeLen: 0.58, tibLen: 0.72 },
  { id: 'L2', side: -1, z: 0.0,  angY: 0.0,  kneeLen: 0.64, tibLen: 0.78 },
  { id: 'L3', side: -1, z: -0.28, angY: -0.45, kneeLen: 0.68, tibLen: 0.82 },
  { id: 'R1', side: 1,  z: 0.28, angY: -0.45, kneeLen: 0.58, tibLen: 0.72 },
  { id: 'R2', side: 1,  z: 0.0,  angY: 0.0,  kneeLen: 0.64, tibLen: 0.78 },
  { id: 'R3', side: 1,  z: -0.28, angY: 0.45, kneeLen: 0.68, tibLen: 0.82 }
];

legSpecs.forEach(spec => {
  const legRoot = new THREE.Group();
  legRoot.position.set(spec.side * 0.36, -0.05, spec.z);
  legRoot.rotation.y = spec.angY;
  legsGroup.add(legRoot);

  const hipServo = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.09, 16), orangeMat);
  hipServo.rotation.x = Math.PI / 2;
  legRoot.add(hipServo);

  const femurGroup = new THREE.Group();
  femurGroup.rotation.z = -spec.side * 0.75;
  legRoot.add(femurGroup);

  const femurBox = new THREE.Mesh(new THREE.BoxGeometry(0.07, spec.kneeLen, 0.06), whiteShellMat);
  femurBox.position.y = spec.kneeLen / 2;
  femurBox.castShadow = true;
  femurGroup.add(femurBox);

  const kneeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 20), orangeMat);
  kneeHub.position.y = spec.kneeLen;
  kneeHub.rotation.x = Math.PI / 2;
  femurGroup.add(kneeHub);

  const tibiaGroup = new THREE.Group();
  tibiaGroup.position.set(0, spec.kneeLen, 0);
  tibiaGroup.rotation.z = spec.side * 1.55;
  femurGroup.add(tibiaGroup);

  const tibiaStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, spec.tibLen, 12), whiteShellMat);
  tibiaStrut.position.y = spec.tibLen / 2;
  tibiaStrut.castShadow = true;
  tibiaGroup.add(tibiaStrut);

  const footPad = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.03, 12), darkMechMat);
  footPad.position.y = spec.tibLen + 0.02;
  tibiaGroup.add(footPad);

  legs.push({ id: spec.id, root: legRoot, side: spec.side });
});

// Floating fasteners for exploded view
for (let h = 0; h < 24; h++) {
  const fastener = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8), chromeMat);
  const ang = (h / 24) * Math.PI * 2;
  const dist = 1.1 + Math.random() * 0.8;
  fastener.position.set(Math.cos(ang) * dist, (Math.random() - 0.5) * 0.8 + 0.3, Math.sin(ang) * dist);
  hardwareGroup.add(fastener);
}
hardwareGroup.visible = false;

// Callout Labels
const calloutDefs = [
  { id: 'wing_hinge', text: 'WING HINGE', sub: 'QUICK RELEASE', getPos: () => forewingR.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.15, 0.1, 0)) },
  { id: 'optic_head', text: 'OPTIC HEAD', sub: '2 x 18 MM LENS · AMBER IR', getPos: () => snoutGroup.getWorldPosition(new THREE.Vector3()) },
  { id: 'neck_bearing', text: 'NECK BEARING', sub: '10-SEGMENT COLLAR', getPos: () => neckGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.28, 0)) },
  { id: 'drive_gears', text: 'DRIVE GEARS', sub: 'SPINNING FREE · 3 GEARS', getPos: () => gearCoreGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)) },
  { id: 'abdomen', text: 'ABDOMEN CAPSULE', sub: 'GEAR TRAIN · RETURN SPRING', getPos: () => abdomenGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, -0.3)) },
  { id: 'leg_servos', text: 'LEG SERVOS', sub: '6 LEGS · 3 JOINTS', getPos: () => legs[1].root.getWorldPosition(new THREE.Vector3()) }
];

const domLabels = [];
calloutDefs.forEach(def => {
  const el = document.createElement('div');
  el.className = 'dom-label';
  el.innerHTML = `${def.text}<span class="sub">${def.sub}</span>`;
  document.getElementById('canvas-container').appendChild(el);
  domLabels.push({ def, el });
});

// Controls & Camera
let currentAssembly = 'hero';
let showLabels = true;
let isExploded = false;
let isTurntable = false;
let isPlaying = true;
let showMotionBlur = true;
let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);
let spherical = new THREE.Spherical(4.8, Math.PI / 2.6, 0.82);

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
  spherical.radius = Math.max(1.8, Math.min(8.5, spherical.radius + e.deltaY * 0.004));
}, { passive: false });

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
    titleEl.textContent = 'HOVER';
    descEl.textContent = 'STATION KEEPING · 144 MM AGL';
    statusText.textContent = 'HOVER';
    statusBadge.className = 'status-badge';
    spherical.radius = 4.8;
    spherical.phi = Math.PI / 2.6;
    camLookAt.set(0, 0, 0);
  } else if (mode === 'optics') {
    titleEl.textContent = 'OPTIC HEAD';
    descEl.textContent = '2 x 18 MM LENS · AMBER IR';
    statusText.textContent = 'OPTICS';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.4;
    spherical.phi = Math.PI / 2.5;
    camLookAt.set(0, 0.18, 0.68);
  } else if (mode === 'wing') {
    titleEl.textContent = 'WING ROOTS';
    descEl.textContent = '4 HINGES · 7.5 HZ CRANK';
    statusText.textContent = 'WING';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 3.0;
    camLookAt.set(0.35, 0.42, 0.1);
  } else if (mode === 'leg') {
    titleEl.textContent = 'LEG SERVOS';
    descEl.textContent = 'LOAD PER LEG · KNEE TORQUE';
    statusText.textContent = 'LEG L2';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.6;
    spherical.phi = Math.PI / 2.1;
    camLookAt.set(-0.38, -0.2, 0);
  } else if (mode === 'thorax') {
    titleEl.textContent = 'THORAX DRIVE';
    descEl.textContent = '3 GEARS · 11 ACTUATORS';
    statusText.textContent = 'THORAX';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 2.5;
    camLookAt.set(0, 0.12, 0);
  } else if (mode === 'abdomen') {
    titleEl.textContent = 'ABDOMEN CAPSULE';
    descEl.textContent = 'GEAR TRAIN · RETURN SPRING';
    statusText.textContent = 'ABDOMEN';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.0;
    spherical.phi = Math.PI / 2.4;
    spherical.theta = Math.PI * 0.85;
    camLookAt.set(0, 0.08, -0.72);
  }
}

document.getElementById('btn-labels').addEventListener('click', function() {
  showLabels = !showLabels;
  this.classList.toggle('active', showLabels);
});

document.getElementById('btn-exploded').addEventListener('click', function() {
  isExploded = !isExploded;
  this.classList.toggle('active', isExploded);
  if (isExploded) {
    document.getElementById('mode-title').textContent = 'TEARDOWN';
    document.getElementById('mode-desc').textContent = 'TURNTABLE 104° · 100% APART';
    document.getElementById('val-status-text').textContent = 'TEARDOWN';
    document.getElementById('val-status').className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · EXPLODED ON';
  } else {
    setAssemblyMode(currentAssembly);
  }
});

document.getElementById('btn-turntable').addEventListener('click', function() {
  isTurntable = !isTurntable;
  this.classList.toggle('active', isTurntable);
});

document.getElementById('btn-motion').addEventListener('click', function() {
  showMotionBlur = !showMotionBlur;
  this.classList.toggle('active', showMotionBlur);
  blurFanL.visible = showMotionBlur;
  blurFanR.visible = showMotionBlur;
});

document.getElementById('btn-play').addEventListener('click', function() {
  isPlaying = !isPlaying;
  document.getElementById('play-icon').innerHTML = isPlaying ?
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' :
    '<path d="M8 5v14l11-7z"/>';
});

// Wing Wave Canvas
const wingCanvas = document.getElementById('wing-canvas');
const wingCtx = wingCanvas.getContext('2d');
let waveOffset = 0;

function drawWingWave() {
  wingCtx.clearRect(0, 0, wingCanvas.width, wingCanvas.height);
  wingCtx.strokeStyle = '#e8e5de';
  wingCtx.lineWidth = 1;
  wingCtx.beginPath();
  wingCtx.moveTo(0, wingCanvas.height / 2);
  wingCtx.lineTo(wingCanvas.width, wingCanvas.height / 2);
  wingCtx.stroke();

  wingCtx.strokeStyle = '#ff4800';
  wingCtx.lineWidth = 1.8;
  wingCtx.beginPath();

  const w = wingCanvas.width;
  const h = wingCanvas.height;
  const mid = h / 2;
  const amp = isPlaying ? 13 : 2;

  for (let x = 0; x < w; x++) {
    const progress = x / w;
    const envelope = Math.sin(progress * Math.PI);
    const y = mid - Math.sin((x * 0.16) - waveOffset) * amp * envelope;
    if (x === 0) wingCtx.moveTo(x, y);
    else wingCtx.lineTo(x, y);
  }
  wingCtx.stroke();
}

// Animation loop
let clock = new THREE.Clock();
let elapsedSimTime = 21;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    waveOffset += delta * 7.5 * Math.PI * 2;
    elapsedSimTime += delta;
    if (isTurntable) spherical.theta += delta * 0.35;
  }

  const targetCamPos = new THREE.Vector3().setFromSpherical(spherical).add(camLookAt);
  camera.position.lerp(targetCamPos, 0.08);
  currentLookAt.lerp(camLookAt, 0.08);
  camera.lookAt(currentLookAt);

  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // Teardown displacements
  headGroup.position.set(0, 0.18 + explodedFactor * 0.45, 0.68 + explodedFactor * 0.85);
  neckGroup.position.set(0, 0.15 + explodedFactor * 0.25, 0.4 + explodedFactor * 0.45);
  neckBeads.forEach((bead, i) => {
    const ang = (i / 10) * Math.PI * 2;
    const r = 0.34 + explodedFactor * 0.55;
    bead.position.set(Math.cos(ang) * r, Math.sin(ang) * r, 0);
  });

  thoraxTop.position.y = explodedFactor * 0.35;
  gearCoreGroup.position.set(0, 0.12 + explodedFactor * 0.25, 0);
  gears.forEach(g => {
    if (isPlaying) g.group.rotation.z += delta * g.dir * g.speed;
  });

  abdomenGroup.position.set(0, 0.08 - explodedFactor * 0.2, -0.72 - explodedFactor * 0.95);
  abdSegments.forEach((seg, s) => {
    seg.position.z = -s * (0.22 + explodedFactor * 0.25);
  });

  wingsGroup.position.y = 0.42 + explodedFactor * 0.5;
  wingLRoot.position.x = -0.36 - explodedFactor * 0.65;
  wingRRoot.position.x = 0.36 + explodedFactor * 0.65;

  legs.forEach(leg => {
    leg.root.position.x = leg.side * (0.36 + explodedFactor * 0.5);
    leg.root.position.y = -0.05 - explodedFactor * 0.3;
  });

  hardwareGroup.visible = (explodedFactor > 0.05);
  orbitRingsGroup.visible = (explodedFactor > 0.05);

  if (!isExploded) {
    const hoverY = Math.sin(time * 3.5) * 0.035;
    const hoverPitch = Math.cos(time * 2.2) * 0.02;
    const hoverRoll = Math.sin(time * 2.8) * 0.02;
    beeRoot.position.y = hoverY;
    beeRoot.rotation.set(hoverPitch, 0, hoverRoll);

    const strokeAngle = Math.sin(waveOffset) * (32 * Math.PI / 180);
    const featherAngle = Math.cos(waveOffset) * 0.22;
    wingLRoot.rotation.set(featherAngle, strokeAngle, 0);
    wingRRoot.rotation.set(featherAngle, -strokeAngle, 0);

    blurFanL.visible = showMotionBlur;
    blurFanR.visible = showMotionBlur;

    antL.rotation.z = -0.28 + Math.sin(time * 6) * 0.04;
    antR.rotation.z = 0.28 + Math.cos(time * 6) * 0.04;
  } else {
    beeRoot.position.set(0, 0, 0);
    beeRoot.rotation.set(0, 0, 0);
    wingLRoot.rotation.set(0.35, 0.45, 0);
    wingRRoot.rotation.set(0.35, -0.45, 0);
    blurFanL.visible = false;
    blurFanR.visible = false;
  }

  renderScreenLabels();
  drawWingWave();
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
  document.getElementById('timeline-time').textContent = `00:${s} / 00:24`;

  const rollDeg = (Math.sin(time * 2.8) * 0.57).toFixed(2);
  const pitchDeg = (Math.cos(time * 2.2) * 0.03).toFixed(2);
  const hLine = document.getElementById('horizon-line');
  if (hLine) hLine.style.transform = `translateY(${pitchDeg * 8}px) rotate(${rollDeg * 12}deg)`;

  const drawVal = (34.0 + Math.sin(time * 5) * 1.8).toFixed(1);
  const drawEl = document.getElementById('val-draw');
  if (drawEl) drawEl.textContent = `${drawVal} W`;
}

requestAnimationFrame(animate);
