import * as THREE from 'three';

// =========================================================================
// SCORPIO SC-9 · BIONIC OCTOPOD EXOSKELETON & HEAVY ALL-TERRAIN ROVER
// HIGH-TORQUE MANIPULATOR / FIELD SIMULATOR
// Exact match to user lab console screenshots & high-fidelity 3D teardown
// =========================================================================

const app = document.getElementById('app');

// Inject CSS matching the screenshots
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
  
  :root {
    --bg-lab: #f6f4f0;
    --text-dark: #1a1917;
    --text-muted: #8c8983;
    --text-faint: #b8b5ae;
    --border-line: #e3dfd7;
    --border-dark: #2a2825;
    --accent-orange: #ff4800;
    --accent-orange-bg: #fff0eb;
    --accent-green: #0ea569;
    --accent-green-bg: #e6f7ef;
    --panel-bg: rgba(255, 255, 255, 0.94);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; background: var(--bg-lab); font-family: 'Inter', sans-serif; color: var(--text-dark); user-select: none; }
  
  #canvas-container { position: absolute; inset: 0; width: 100%; height: 100%; }
  #gl { width: 100%; height: 100%; display: block; cursor: grab; }
  #gl.grabbing { cursor: grabbing; }

  /* UI Layer */
  #hud-layer { position: absolute; inset: 0; pointer-events: none; z-index: 20; padding: 18px 24px; display: flex; flex-direction: column; justify-content: space-between; }
  .interactive { pointer-events: auto; }

  /* Top Bar */
  .top-bar { display: flex; justify-content: space-between; align-items: flex-start; }
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

  /* Panels Layout */
  .panels-wrapper { position: absolute; inset: 0; pointer-events: none; }
  .panel-col-left { position: absolute; left: 24px; top: 96px; width: 220px; display: flex; flex-direction: column; gap: 12px; pointer-events: auto; }
  .panel-col-right { position: absolute; right: 24px; top: 96px; width: 220px; display: flex; flex-direction: column; gap: 12px; pointer-events: auto; }

  .tech-card { background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 12px 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .card-title { font-size: 9px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--text-dark); display: flex; align-items: center; gap: 6px; }
  .card-title::before { content: ''; display: inline-block; width: 3px; height: 10px; background: var(--accent-orange); }
  .card-idx { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 600; color: var(--text-faint); }

  /* Big Metric Numbers */
  .metric-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .metric-big { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 800; letter-spacing: -1px; color: var(--text-dark); line-height: 1; }
  .metric-unit { font-size: 11px; font-weight: 600; color: var(--text-muted); margin-left: 2px; }

  /* Stinger Hydraulic Canvas */
  .wave-canvas { width: 100%; height: 42px; border-bottom: 1px solid var(--border-line); margin-bottom: 6px; display: block; }
  .wave-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); }

  /* Battery Gauge */
  .power-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--border-line); font-family: 'JetBrains Mono', monospace; }
  .power-sub { font-size: 7.5px; color: var(--text-muted); text-transform: uppercase; }
  .power-val { font-size: 10px; font-weight: 700; color: var(--text-dark); }
  .battery-bars { display: flex; gap: 2px; height: 12px; margin-top: 4px; }
  .battery-seg { flex: 1; border-radius: 1px; background: #e5e2da; }
  .battery-seg.fill-red { background: var(--accent-orange); }
  .battery-seg.fill-green { background: var(--accent-green); }

  /* Leg Servo Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-bottom: 4px; }
  .servo-name { width: 22px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 8px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--accent-orange); transition: width 0.3s ease; }
  .servo-val { width: 44px; text-align: right; font-weight: 600; color: var(--text-dark); }
  .servo-val.detached { color: var(--accent-orange); font-size: 7.5px; font-weight: 700; }

  /* Right Side Buttons Grid */
  .btn-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 4px; }
  .pill-btn {
    border: 1px solid var(--border-line);
    background: #fff;
    color: var(--text-dark);
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5px;
    font-weight: 700;
    padding: 6px 4px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s ease;
    text-transform: uppercase;
  }
  .pill-btn:hover { border-color: var(--text-dark); }
  .pill-btn.active {
    background: var(--accent-orange);
    color: #fff;
    border-color: var(--accent-orange);
  }

  /* Attitude / Horizon */
  .gimbal-box { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .gimbal-circle { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border-line); background: #eeebe3; position: relative; overflow: hidden; }
  .gimbal-horizon { position: absolute; left: -10px; right: -10px; top: 50%; height: 1.5px; background: var(--accent-orange); transform-origin: center; }
  .gimbal-sub { flex: 1; display: flex; flex-direction: column; gap: 3px; font-family: 'JetBrains Mono', monospace; }
  .gimbal-row { display: flex; justify-content: space-between; font-size: 8.5px; }
  .gimbal-lbl { color: var(--text-muted); }
  .gimbal-val { font-weight: 700; color: var(--text-dark); }

  /* Subsystems List */
  .subsys-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dotted var(--border-line); font-family: 'JetBrains Mono', monospace; font-size: 8px; }
  .subsys-item:last-child { border-bottom: none; }
  .subsys-left { display: flex; flex-direction: column; }
  .subsys-name { font-weight: 700; color: var(--text-dark); text-transform: uppercase; }
  .subsys-desc { color: var(--text-muted); font-size: 7px; }
  .subsys-tag { font-size: 7.5px; font-weight: 700; padding: 2px 5px; border-radius: 2px; }
  .subsys-tag.green { background: var(--accent-green-bg); color: var(--accent-green); }
  .subsys-tag.orange { background: var(--accent-orange-bg); color: var(--accent-orange); }

  /* Operating Mode Center Title */
  .flight-mode-anchor { position: absolute; left: 24px; bottom: 84px; pointer-events: none; }
  .flight-mode-tag { font-size: 8.5px; font-weight: 700; letter-spacing: 1.4px; color: var(--text-muted); text-transform: uppercase; font-family: 'JetBrains Mono', monospace; }
  .flight-mode-title { font-size: 32px; font-weight: 800; letter-spacing: -0.5px; color: var(--accent-orange); line-height: 1; margin: 3px 0; }
  .flight-mode-sub { font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }

  /* Bottom Timeline / Log Bar */
  .bottom-bar { display: flex; align-items: center; gap: 16px; background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 8px 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); pointer-events: auto; }
  .play-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-orange); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s; }
  .play-btn:active { transform: scale(0.95); }
  .play-btn svg { width: 14px; height: 14px; fill: currentColor; }
  .timeline-track { flex: 1; height: 3px; background: #e3dfd7; border-radius: 2px; position: relative; display: flex; align-items: center; cursor: pointer; }
  .timeline-progress { height: 100%; background: var(--accent-orange); border-radius: 2px; width: 46%; }
  .timeline-thumb { width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2px solid var(--accent-orange); position: absolute; left: 46%; transform: translateX(-50%); }
  .timeline-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: var(--text-muted); }

  /* 3D Screen Space Callout Labels Canvas */
  #labels-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 15; width: 100%; height: 100%; }
  .dom-label {
    position: absolute;
    transform: translate(0, -50%);
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--border-line);
    border-left: 3px solid var(--accent-orange);
    padding: 3px 8px;
    border-radius: 2px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: var(--text-dark);
    white-space: nowrap;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .dom-label .sub {
    font-size: 6.5px;
    color: var(--text-muted);
    font-weight: 500;
    display: block;
    margin-top: 1px;
  }

  /* Grid Overlay */
  .grid-bg-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 0%, transparent 70%),
      linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
  }
`;
document.head.appendChild(style);

// Build HUD HTML
app.innerHTML = `
  <div id="canvas-container">
    <canvas id="gl"></canvas>
    <div class="grid-bg-overlay"></div>
    <canvas id="labels-canvas"></canvas>
  </div>

  <div id="hud-layer">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="brand-group interactive">
        <div class="logo-box">
          <svg viewBox="0 0 24 24"><path d="M19 8l-3-3v2H8V5L5 8l3 3V9h8v2l3-3zm-7 5c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
          <span>SC-9</span>
        </div>
        <div class="title-block">
          <div class="title-tag">BIONIC OCTOPOD EXOSKELETON · HEAVY ALL-TERRAIN ROVER</div>
          <div class="title-main">Scorpio SC-9<span>/</span></div>
          <div class="title-sub">HIGH-TORQUE MANIPULATOR / FIELD SIMULATOR</div>
        </div>
      </div>

      <!-- Top Center Telemetry Pill -->
      <div class="top-center interactive">
        <div class="spec-item">
          <span class="spec-label">HYDRAULIC LOAD</span>
          <div class="lift-load-bar" id="load-bar">
            <!-- 20 segments -->
          </div>
        </div>
        <div class="spec-item">
          <span class="spec-label">SIM ID</span>
          <span class="spec-val">SC9-0824</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:14:32</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">STATUS</span>
          <span class="status-badge" id="val-status">
            <span class="status-dot"></span>
            <span id="val-status-text">STRIKE ARMED</span>
          </span>
        </div>
        <div class="spec-item">
          <span class="spec-label">OPERATOR</span>
          <span class="spec-val">DESERT LAB 4 · K.S.</span>
        </div>
      </div>
    </div>

    <!-- Operating Mode Floating Tag (Center Left) -->
    <div class="flight-mode-anchor">
      <div class="flight-mode-tag">OPERATING MODE</div>
      <div class="flight-mode-title" id="mode-title">STRIKE ARMED</div>
      <div class="flight-mode-sub" id="mode-desc">HEXAPOD WAVE GAIT · 18.5 CM CLEARANCE</div>
    </div>

    <!-- Panels Wrapper -->
    <div class="panels-wrapper">
      <!-- Left Column -->
      <div class="panel-col-left">
        <!-- 01 STINGER TAIL -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">STINGER TAIL</span>
            <span class="card-idx">01</span>
          </div>
          <div class="metric-row">
            <div>
              <span class="metric-big" id="val-force">320</span><span class="metric-unit">N</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">STRIKE FORCE</div>
            </div>
            <div style="text-align:right;">
              <span class="metric-big" id="val-vel">7.2</span><span class="metric-unit">M/S</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">VELOCITY</div>
            </div>
          </div>
          <canvas class="wave-canvas" id="stinger-canvas" width="200" height="42"></canvas>
          <div class="wave-meta">
            <span>6 HYDRAULIC JOINTS</span>
            <span id="valve-status" style="color:var(--accent-green); font-weight:700;">VALVE ARMED</span>
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
              <span class="metric-big">82</span><span class="metric-unit">%</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono';">BATTERY</div>
            </div>
            <div class="battery-bars" style="width: 100px;">
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
              <div class="power-val" id="val-draw">44.0 W</div>
            </div>
            <div>
              <div class="power-sub">CELL</div>
              <div class="power-val">4.10 V</div>
            </div>
            <div>
              <div class="power-sub">MOTOR</div>
              <div class="power-val">42 °C</div>
            </div>
          </div>
        </div>

        <!-- 03 LEG SERVOS -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">LEG SERVOS</span>
            <span class="card-idx">03</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:7.5px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:6px;">
            <span>LOAD PER LEG · KNEE TORQUE</span>
            <span class="subsys-tag green" id="legs-mode-tag">GAIT LOCK</span>
          </div>
          <div id="arm-rows">
            <!-- L1..L4, R1..R4 injected dynamically -->
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="panel-col-right">
        <!-- 04 HORIZON & ATTITUDE -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">ATTITUDE</span>
            <span class="card-idx">04</span>
          </div>
          <div class="gimbal-box">
            <div class="gimbal-circle">
              <div class="gimbal-horizon" id="gimbal-line"></div>
            </div>
            <div class="gimbal-sub">
              <div class="gimbal-row">
                <span class="gimbal-lbl">CLEARANCE</span>
                <span class="gimbal-val">18.5 CM</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">PITCH</span>
                <span class="gimbal-val" id="val-pitch">+0.82°</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">ROLL</span>
                <span class="gimbal-val" id="val-roll">-0.45°</span>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:8px; font-family:'JetBrains Mono'; color:var(--text-muted); border-top:1px solid var(--border-line); padding-top:4px;">
            <span>GROUND</span>
            <span>TRACTION</span>
            <span>SPEED <b style="color:var(--text-dark);">0.82 M/S</b></span>
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
            <button class="pill-btn" data-assembly="chelae">CHELAE</button>
            <button class="pill-btn" data-assembly="stinger">STINGER</button>
            <button class="pill-btn" data-assembly="carapace">CARAPACE</button>
            <button class="pill-btn" data-assembly="legs">LEGS</button>
            <button class="pill-btn" data-assembly="optics">OPTICS</button>
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
            <button class="pill-btn" id="btn-strike" style="color:var(--accent-orange);">STRIKE ⚡</button>
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
              <span class="subsys-name">01 CHELAE CLAWS</span>
              <span class="subsys-desc">DUAL 3-AXIS HYDRAULIC PINCERS</span>
            </div>
            <span class="subsys-tag green" id="sub-chelae-tag">ARMED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">02 STINGER TAIL</span>
              <span class="subsys-desc">6 PIVOT JOINTS · TITANIUM SPUR</span>
            </div>
            <span class="subsys-tag green" id="sub-stinger-tag">LOCKED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">03 CARAPACE</span>
              <span class="subsys-desc">5 ARTICULATED CERAMIC PLATES</span>
            </div>
            <span class="subsys-tag green" id="sub-carapace-tag">SEALED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">04 WALKING GEAR</span>
              <span class="subsys-desc">8 INDEPENDENT SERVO LEGS</span>
            </div>
            <span class="subsys-tag green" id="sub-legs-tag">ENGAGED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">05 OCULAR SENSORS</span>
              <span class="subsys-desc">TRIPLE STEREO CAMERA</span>
            </div>
            <span class="subsys-tag green">TRACKING</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">06 HYDRAULICS</span>
              <span class="subsys-desc">240 BAR CLOSED-LOOP MANIFOLD</span>
            </div>
            <span class="subsys-tag green">NOMINAL</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar: Operation Log Timeline -->
    <div class="bottom-bar">
      <button class="play-btn" id="btn-play">
        <svg viewBox="0 0 24 24" id="play-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:700; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:4px; text-transform:uppercase;">
          <span style="color:var(--text-dark); display:flex; align-items:center; gap:4px;"><span style="color:var(--accent-orange);">|</span> MISSION LOG</span>
          <span>START</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · SCORPIO PATROL RELEASE</span>
          <span>SECURE</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:4px;">
          <span id="timeline-time">00:14 / 00:30</span>
          <span>12 OPERATOR ACTIONS</span>
        </div>
      </div>
    </div>
  </div>
`;

// Populate load bar
const loadBar = document.getElementById('load-bar');
for (let i = 0; i < 20; i++) {
  const seg = document.createElement('div');
  seg.className = `lift-seg ${i < 13 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate 8 Leg rows (L1..L4, R1..R4)
const armRowsContainer = document.getElementById('arm-rows');
const legData = [
  { id: 'L1', val: 58 },
  { id: 'L2', val: 76 },
  { id: 'L3', val: 64 },
  { id: 'L4', val: 71 },
  { id: 'R1', val: 55 },
  { id: 'R2', val: 74 },
  { id: 'R3', val: 62 },
  { id: 'R4', val: 69 }
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
// THREE.JS 3D SCENE SETUP
// =========================================================================

const canvas = document.getElementById('gl');
const labelsCanvas = document.getElementById('labels-canvas');
const labelsCtx = labelsCanvas.getContext('2d');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3.4, 2.2, 3.8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  labelsCanvas.width = w;
  labelsCanvas.height = h;
}
window.addEventListener('resize', resize);
resize();

// =========================================================================
// LIGHTING & SHADOW GROUND
// =========================================================================

const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
mainKeyLight.position.set(5, 8, 5);
mainKeyLight.castShadow = true;
mainKeyLight.shadow.mapSize.width = 2048;
mainKeyLight.shadow.mapSize.height = 2048;
mainKeyLight.shadow.bias = -0.0001;
scene.add(mainKeyLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 0.7);
fillLight.position.set(-5, 3, -3);
scene.add(fillLight);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.15 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.85;
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(12, 24, 0xd0ccc3, 0xe5e1d7);
gridHelper.position.y = -0.84;
scene.add(gridHelper);

// =========================================================================
// MATERIALS
// =========================================================================

const whiteMat = new THREE.MeshStandardMaterial({
  color: 0xfaf8f5,
  metalness: 0.1,
  roughness: 0.22
});

const orangeMat = new THREE.MeshStandardMaterial({
  color: 0xff4800,
  metalness: 0.4,
  roughness: 0.28
});

const darkMechMat = new THREE.MeshStandardMaterial({
  color: 0x18181a,
  metalness: 0.8,
  roughness: 0.35
});

const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0x050b14,
  metalness: 0.9,
  roughness: 0.05,
  transmission: 0.5,
  reflectivity: 0.9
});

// =========================================================================
// 3D MODEL HIERARCHY: SCORPIO SC-9
// =========================================================================

const scorpionRoot = new THREE.Group();
scene.add(scorpionRoot);

const carapaceGroup = new THREE.Group();
const stingerGroup = new THREE.Group();
const chelaeLGroup = new THREE.Group();
const chelaeRGroup = new THREE.Group();
const legsGroup = new THREE.Group();
const opticsGroup = new THREE.Group();

scorpionRoot.add(carapaceGroup);
scorpionRoot.add(stingerGroup);
scorpionRoot.add(chelaeLGroup);
scorpionRoot.add(chelaeRGroup);
scorpionRoot.add(legsGroup);
scorpionRoot.add(opticsGroup);

// --- 1. SEGMENTED CARAPACE (5 Armored Shell Tiers) ---
const carapacePlates = [];
for (let c = 0; c < 5; c++) {
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(0.75 - c * 0.08, 0.16, 0.32 - c * 0.02),
    whiteMat
  );
  plate.position.set(0, 0.06 + c * 0.03, 0.25 - c * 0.22);
  plate.castShadow = true;
  plate.receiveShadow = true;
  carapaceGroup.add(plate);

  // Orange joint accent ring
  const accent = new THREE.Mesh(new THREE.BoxGeometry(0.78 - c * 0.08, 0.02, 0.04), orangeMat);
  accent.position.set(0, 0.14 + c * 0.03, 0.36 - c * 0.22);
  carapaceGroup.add(accent);

  carapacePlates.push(plate);
}

// Internal chassis frame
const chassisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.2, 0.9), darkMechMat);
chassisMesh.position.set(0, -0.05, -0.1);
chassisMesh.castShadow = true;
carapaceGroup.add(chassisMesh);

// --- 2. TRIPLE STEREO OPTIC SENSORS ---
for (let e = -1; e <= 1; e++) {
  const eye = new THREE.Group();
  const eyeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.08, 16), darkMechMat);
  eyeBase.rotation.x = Math.PI / 2;
  eye.add(eyeBase);

  const eyeBezel = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.012, 10, 20), orangeMat);
  eyeBezel.position.z = 0.04;
  eye.add(eyeBezel);

  const eyeLens = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  eyeLens.rotation.x = -Math.PI / 2;
  eyeLens.position.z = 0.045;
  eye.add(eyeLens);

  eye.position.set(e * 0.18, 0.12, 0.45);
  opticsGroup.add(eye);
}

// --- 3. 6-SEGMENT ARMORED STINGER TAIL ---
const tailSegments = [];
let prevTail = stingerGroup;
stingerGroup.position.set(0, 0.08, -0.55);

for (let s = 0; s < 6; s++) {
  const segPivot = new THREE.Group();
  segPivot.position.set(0, s === 0 ? 0 : 0.22, s === 0 ? 0 : -0.08);

  // Arched segment cylinder
  const segMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 - s * 0.015, 0.14 - s * 0.015, 0.24, 16),
    whiteMat
  );
  segMesh.position.y = 0.11;
  segMesh.castShadow = true;
  segPivot.add(segMesh);

  // Orange hydraulic actuator joint
  const joint = new THREE.Mesh(new THREE.TorusGeometry(0.13 - s * 0.015, 0.018, 10, 24), orangeMat);
  joint.rotation.x = Math.PI / 2;
  joint.position.y = 0.22;
  segPivot.add(joint);

  prevTail.add(segPivot);
  tailSegments.push(segPivot);
  prevTail = segPivot;
}

// Terminal Stinger Bulb & Titanium Puncture Spur
const stingerBulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), whiteMat);
stingerBulb.position.y = 0.22;
stingerBulb.castShadow = true;
prevTail.add(stingerBulb);

const stingerCollar = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.02, 12, 24), orangeMat);
stingerCollar.rotation.x = Math.PI / 2;
stingerCollar.position.y = 0.22;
prevTail.add(stingerCollar);

// Curved puncture spur needle
const spurCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.22, 0),
  new THREE.Vector3(0, 0.35, 0.1),
  new THREE.Vector3(0, 0.48, 0.28)
]);
const spurMesh = new THREE.Mesh(new THREE.TubeGeometry(spurCurve, 16, 0.025, 8, false), darkMechMat);
prevTail.add(spurMesh);

const spurTip = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.1, 16), orangeMat);
spurTip.position.set(0, 0.52, 0.33);
spurTip.rotation.x = Math.PI / 3;
prevTail.add(spurTip);

// --- 4. DUAL CHELAE (HYDRAULIC PINCERS) ---
const clawL = createChelae(true);
chelaeLGroup.add(clawL);

const clawR = createChelae(false);
chelaeRGroup.add(clawR);

let clawFingersL, clawFingersR;

function createChelae(isLeft) {
  const root = new THREE.Group();
  const side = isLeft ? -1 : 1;
  root.position.set(side * 0.42, 0, 0.32);

  // Arm segment 1 (Humerus)
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.38, 16), whiteMat);
  arm1.rotation.z = side * 0.7;
  arm1.rotation.y = side * 0.4;
  arm1.position.set(side * 0.18, 0.05, 0.15);
  arm1.castShadow = true;
  root.add(arm1);

  // Arm segment 2 (Brachium)
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.35, 16), whiteMat);
  arm2.rotation.z = -side * 0.5;
  arm2.position.set(side * 0.34, 0.12, 0.38);
  arm2.castShadow = true;
  root.add(arm2);

  // Orange elbow joint
  const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), orangeMat);
  elbow.position.set(side * 0.32, 0.1, 0.26);
  root.add(elbow);

  // Pincer Palm Bulb
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.28), whiteMat);
  palm.position.set(side * 0.42, 0.14, 0.58);
  palm.castShadow = true;
  root.add(palm);

  // Pincer Opposed Fingers
  const fingerFixed = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.26, 4), darkMechMat);
  fingerFixed.rotation.x = Math.PI / 2;
  fingerFixed.rotation.z = side * 0.2;
  fingerFixed.position.set(side * 0.38, 0.14, 0.76);
  root.add(fingerFixed);

  const fingerMobile = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.26, 4), orangeMat);
  fingerMobile.rotation.x = Math.PI / 2;
  fingerMobile.rotation.z = -side * 0.3;
  fingerMobile.position.set(side * 0.46, 0.14, 0.76);
  root.add(fingerMobile);

  if (isLeft) clawFingersL = fingerMobile;
  else clawFingersR = fingerMobile;

  return root;
}

// --- 5. 8 ARTICULATED LEGS (L1..L4, R1..R4) ---
const legs = [];
for (let side = -1; side <= 1; side += 2) {
  const isLeft = side < 0;
  for (let idx = 0; idx < 4; idx++) {
    const legRoot = new THREE.Group();
    const legZ = 0.28 - idx * 0.24;
    legRoot.position.set(side * 0.38, -0.05, legZ);
    legsGroup.add(legRoot);

    // Coxa joint
    const coxa = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.15, 12), orangeMat);
    coxa.rotation.z = Math.PI / 2;
    legRoot.add(coxa);

    // Femur
    const femurGroup = new THREE.Group();
    femurGroup.position.set(side * 0.08, 0, 0);
    legRoot.add(femurGroup);

    const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.42, 12), whiteMat);
    femur.position.set(side * 0.18, 0.1, 0);
    femur.rotation.z = side * 0.65;
    femur.castShadow = true;
    femurGroup.add(femur);

    // Knee joint
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), darkMechMat);
    knee.position.set(side * 0.34, 0.18, 0);
    femurGroup.add(knee);

    // Tibia
    const tibiaGroup = new THREE.Group();
    tibiaGroup.position.copy(knee.position);
    femurGroup.add(tibiaGroup);

    const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.52, 12), whiteMat);
    tibia.position.set(side * 0.12, -0.22, 0);
    tibia.rotation.z = -side * 0.45;
    tibia.castShadow = true;
    tibiaGroup.add(tibia);

    // Foot pad
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), orangeMat);
    foot.position.set(side * 0.22, -0.45, 0);
    tibiaGroup.add(foot);

    legs.push({
      id: `${isLeft ? 'L' : 'R'}${idx + 1}`,
      root: legRoot,
      femur: femurGroup,
      tibia: tibiaGroup,
      side,
      phase: idx * 0.8 + (isLeft ? 0 : Math.PI)
    });
  }
}

// =========================================================================
// CALLOUT LABELS & LEADER LINES
// =========================================================================

const calloutDefs = [
  { id: 'spur', text: 'TITANIUM SPUR', sub: 'PUNCTURE TIP · ARMED', getPos: () => spurTip.getWorldPosition(new THREE.Vector3()) },
  { id: 'stinger_bulb', text: 'STINGER BULB', sub: 'HYDRAULIC RESERVOIR', getPos: () => stingerBulb.getWorldPosition(new THREE.Vector3()) },
  { id: 'carapace', text: 'CARAPACE DORSAL', sub: '5 ARMOR TIERS', getPos: () => carapacePlates[1].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.15, 0)) },
  { id: 'chelae', text: 'CHELAE CLAW', sub: 'DUAL 3-AXIS PINCER', getPos: () => clawR.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.3, 0.1, 0.4)) },
  { id: 'leg', text: 'WALKING LEG R2', sub: '3 DOF HIGH-TORQUE SERVO', getPos: () => legs[5].femur.getWorldPosition(new THREE.Vector3()) },
  { id: 'optics', text: 'STEREO OPTICS', sub: 'TRIPLE HIGH-RES SENSOR', getPos: () => opticsGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0.4)) }
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
// INTERACTION LOGIC
// =========================================================================

let currentAssembly = 'hero';
let showLabels = true;
let isExploded = false;
let isTurntable = false;
let isPlaying = true;
let strikeTriggered = false;
let strikeTimer = 0;

let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);
let spherical = new THREE.Spherical(5.2, Math.PI / 2.6, 0.85);

let isPointerDown = false;
let prevPointerX = 0;
let prevPointerY = 0;

canvas.addEventListener('pointerdown', (e) => {
  isPointerDown = true;
  prevPointerX = e.clientX;
  prevPointerY = e.clientY;
  canvas.classList.add('grabbing');
});

window.addEventListener('pointerup', () => {
  isPointerDown = false;
  canvas.classList.remove('grabbing');
});

window.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return;
  const dx = e.clientX - prevPointerX;
  const dy = e.clientY - prevPointerY;
  prevPointerX = e.clientX;
  prevPointerY = e.clientY;

  spherical.theta -= dx * 0.007;
  spherical.phi -= dy * 0.007;
  spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi));
  
  if (isTurntable) {
    isTurntable = false;
    document.getElementById('btn-turntable').classList.remove('active');
  }
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  spherical.radius += e.deltaY * 0.004;
  spherical.radius = Math.max(2.0, Math.min(9.5, spherical.radius));
}, { passive: false });

// Assembly buttons
const assemblyButtons = document.querySelectorAll('[data-assembly]');
assemblyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    assemblyButtons.forEach(b => b.classList.remove('active'));
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
    titleEl.textContent = 'STRIKE ARMED';
    descEl.textContent = 'HEXAPOD WAVE GAIT · 18.5 CM CLEARANCE';
    statusText.textContent = 'STRIKE ARMED';
    statusBadge.className = 'status-badge';
    spherical.radius = 5.2;
    spherical.phi = Math.PI / 2.6;
    camLookAt.set(0, 0, 0);
  } else if (mode === 'stinger') {
    titleEl.textContent = 'STINGER TAIL';
    descEl.textContent = 'TITANIUM SPUR · HYDRAULIC ELEVATION';
    statusText.textContent = 'STINGER';
    statusBadge.className = 'status-badge orange';
    spherical.radius = 3.2;
    spherical.phi = Math.PI / 3.0;
    spherical.theta = Math.PI * 0.8;
    camLookAt.set(0, 0.4, -0.3);
  } else if (mode === 'chelae') {
    titleEl.textContent = 'CHELAE CLAWS';
    descEl.textContent = 'DUAL 3-AXIS HYDRAULIC PINCERS';
    statusText.textContent = 'CHELAE';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.2;
    spherical.phi = Math.PI / 2.4;
    spherical.theta = 0.2;
    camLookAt.set(0, 0.1, 0.5);
  } else if (mode === 'carapace') {
    titleEl.textContent = 'CARAPACE DORSAL';
    descEl.textContent = '5 ARTICULATED CERAMIC ARMOR PLATES';
    statusText.textContent = 'CARAPACE';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.6;
    spherical.phi = Math.PI / 4.0;
    camLookAt.set(0, 0.1, 0);
  } else if (mode === 'legs') {
    titleEl.textContent = 'WALKING GEAR';
    descEl.textContent = '8 HIGH-TORQUE SERVO ACTUATORS';
    statusText.textContent = 'LEGS';
    statusBadge.className = 'status-badge';
    spherical.radius = 4.2;
    spherical.phi = Math.PI / 2.2;
    camLookAt.set(0, -0.2, 0);
  } else if (mode === 'optics') {
    titleEl.textContent = 'STEREO OPTICS';
    descEl.textContent = 'TRIPLE SENSOR · TARGETING TRACKER';
    statusText.textContent = 'OPTICS';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.4;
    spherical.phi = Math.PI / 2.3;
    spherical.theta = 0;
    camLookAt.set(0, 0.12, 0.45);
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
  const titleEl = document.getElementById('mode-title');
  const descEl = document.getElementById('mode-desc');
  if (isExploded) {
    titleEl.textContent = 'TEARDOWN';
    descEl.textContent = 'TURNTABLE 98° · 100% APART';
    document.getElementById('val-status-text').textContent = 'TEARDOWN';
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

const btnStrike = document.getElementById('btn-strike');
btnStrike.addEventListener('click', () => {
  strikeTriggered = true;
  strikeTimer = 0;
  document.getElementById('val-force').textContent = '480';
  document.getElementById('val-vel').textContent = '14.8';
  setTimeout(() => {
    document.getElementById('val-force').textContent = '320';
    document.getElementById('val-vel').textContent = '7.2';
  }, 1000);
});

const btnPlay = document.getElementById('btn-play');
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('play-icon').innerHTML = isPlaying ?
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' :
    '<path d="M8 5v14l11-7z"/>';
});

// Wave Canvas
const stingerCanvas = document.getElementById('stinger-canvas');
const stingerCtx = stingerCanvas.getContext('2d');
let waveOffset = 0;

function drawStingerWave(time) {
  stingerCtx.clearRect(0, 0, stingerCanvas.width, stingerCanvas.height);
  stingerCtx.strokeStyle = '#e8e5de';
  stingerCtx.lineWidth = 1;
  stingerCtx.beginPath();
  stingerCtx.moveTo(0, stingerCanvas.height / 2);
  stingerCtx.lineTo(stingerCanvas.width, stingerCanvas.height / 2);
  stingerCtx.stroke();

  stingerCtx.strokeStyle = '#ff4800';
  stingerCtx.lineWidth = 1.8;
  stingerCtx.beginPath();

  const w = stingerCanvas.width;
  const h = stingerCanvas.height;
  const mid = h / 2;
  const amp = strikeTriggered ? 16 : (isPlaying ? 8 : 2);

  for (let x = 0; x < w; x++) {
    const progress = x / w;
    const envelope = Math.sin(progress * Math.PI);
    const y = mid - Math.sin((x * 0.1) - waveOffset) * amp * envelope;
    if (x === 0) stingerCtx.moveTo(x, y);
    else stingerCtx.lineTo(x, y);
  }
  stingerCtx.stroke();
}

// =========================================================================
// ANIMATION LOOP
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 14 * 60 + 32;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    waveOffset += delta * 5;
    elapsedSimTime += delta;
    if (isTurntable) {
      spherical.theta += delta * 0.35;
    }
  }

  // Camera lerp
  const targetCamPos = new THREE.Vector3().setFromSpherical(spherical).add(camLookAt);
  camera.position.lerp(targetCamPos, 0.08);
  currentLookAt.lerp(camLookAt, 0.08);
  camera.lookAt(currentLookAt);

  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // --- 1. CARAPACE PLATES DISPLACEMENT ---
  carapacePlates.forEach((plate, idx) => {
    plate.position.y = (0.06 + idx * 0.03) + (explodedFactor * (0.2 + idx * 0.12));
  });

  // --- 2. STINGER TAIL ARCH & STRIKE DYNAMICS ---
  let strikeAngle = 0;
  if (strikeTriggered) {
    strikeTimer += delta * 4;
    strikeAngle = Math.sin(strikeTimer * Math.PI) * 0.45;
    if (strikeTimer >= 1.0) strikeTriggered = false;
  }

  tailSegments.forEach((seg, sIdx) => {
    const naturalArch = 0.28 + Math.sin(time * 1.5 + sIdx * 0.4) * 0.04;
    const arch = naturalArch + strikeAngle;
    seg.rotation.x = arch;
  });

  stingerGroup.position.y = 0.08 + (explodedFactor * 0.4);
  stingerGroup.position.z = -0.55 - (explodedFactor * 0.35);

  // --- 3. DUAL CHELAE PINCERS ANIMATION ---
  const snapL = Math.sin(time * 3) * 0.15;
  const snapR = Math.cos(time * 3) * 0.15;
  if (clawFingersL) clawFingersL.rotation.z = -0.3 + (isPlaying ? snapL : 0);
  if (clawFingersR) clawFingersR.rotation.z = 0.3 - (isPlaying ? snapR : 0);

  chelaeLGroup.position.x = -explodedFactor * 0.4;
  chelaeRGroup.position.x = explodedFactor * 0.4;

  // --- 4. 8 LEGS TRIPOD / WAVE GAIT ---
  legs.forEach(leg => {
    const wave = Math.sin(time * 4 + leg.phase);
    const lift = Math.max(0, wave);
    
    if (isPlaying) {
      leg.femur.rotation.z = leg.side * (0.65 + wave * 0.1);
      leg.femur.position.y = lift * 0.06;
      leg.tibia.rotation.z = -leg.side * (0.45 + wave * 0.08);
    }

    leg.root.position.x = leg.side * (0.38 + explodedFactor * 0.35);
  });

  // Screen Labels
  renderScreenLabels();
  drawStingerWave(time);
  updateTelemetryUI(time);

  renderer.render(scene, camera);
}

function renderScreenLabels() {
  labelsCtx.clearRect(0, 0, labelsCanvas.width, labelsCanvas.height);
  if (!showLabels) {
    domLabels.forEach(item => { item.el.style.opacity = '0'; });
    return;
  }

  const w = labelsCanvas.width;
  const h = labelsCanvas.height;

  domLabels.forEach(item => {
    const pos3D = item.def.getPos();
    const screenPos = pos3D.clone().project(camera);

    if (screenPos.z > 1.0) {
      item.el.style.opacity = '0';
      return;
    }

    const x = (screenPos.x * 0.5 + 0.5) * w;
    const y = (-screenPos.y * 0.5 + 0.5) * h;

    const offsetX = screenPos.x > 0 ? 55 : -140;
    const offsetY = screenPos.y > 0 ? -35 : 35;
    const labelX = x + offsetX;
    const labelY = y + offsetY;

    item.el.style.left = `${labelX}px`;
    item.el.style.top = `${labelY}px`;
    item.el.style.opacity = '1';

    labelsCtx.strokeStyle = 'rgba(255, 72, 0, 0.65)';
    labelsCtx.lineWidth = 1.2;
    labelsCtx.setLineDash([2, 2]);

    labelsCtx.beginPath();
    labelsCtx.arc(x, y, 2.5, 0, Math.PI * 2);
    labelsCtx.fillStyle = '#ff4800';
    labelsCtx.fill();

    labelsCtx.beginPath();
    labelsCtx.moveTo(x, y);
    labelsCtx.lineTo(labelX + (screenPos.x > 0 ? 0 : 80), labelY);
    labelsCtx.stroke();
    labelsCtx.setLineDash([]);
  });
}

function updateTelemetryUI(time) {
  const totalSecs = Math.floor(elapsedSimTime);
  const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
  const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
  const secs = String(totalSecs % 60).padStart(2, '0');
  document.getElementById('val-runtime').textContent = `${hrs}:${mins}:${secs}`;
  document.getElementById('timeline-time').textContent = `${mins}:${secs} / 00:30`;

  const pitchAngle = Math.sin(time * 0.8) * 1.5;
  const rollAngle = Math.cos(time * 0.6) * 1.2;
  const gimbalLine = document.getElementById('gimbal-line');
  gimbalLine.style.transform = `translateY(${pitchAngle * 1.5}px) rotate(${rollAngle}deg)`;
  document.getElementById('val-pitch').textContent = `${pitchAngle >= 0 ? '+' : ''}${pitchAngle.toFixed(2)}°`;
  document.getElementById('val-roll').textContent = `${rollAngle >= 0 ? '+' : ''}${rollAngle.toFixed(2)}°`;

  document.getElementById('val-draw').textContent = `${(44.0 + Math.sin(time) * 6.5).toFixed(1)} W`;

  legData.forEach(item => {
    const valEl = document.getElementById(`servo-val-${item.id}`);
    const fillEl = document.getElementById(`servo-fill-${item.id}`);
    const dynamicVal = Math.min(100, Math.max(20, Math.round(item.val + Math.sin(time * 2.5 + item.val) * 12)));
    valEl.textContent = `${dynamicVal}%`;
    fillEl.style.width = `${dynamicVal}%`;
  });
}

animate();
