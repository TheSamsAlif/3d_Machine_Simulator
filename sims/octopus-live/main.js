import * as THREE from 'three';

// =========================================================================
// PELAGOS OC-8 · ROBOTIC CEPHALOPOD EIGHT-ARM SUBSEA DRONE
// SOFT-ARM MANIPULATOR / FIELD SIMULATOR
// Exact match to user lab console screenshots (Images 3, 4, 5)
// =========================================================================

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

  /* Jet Canvas */
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

  /* Arm Curl Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-bottom: 4px; }
  .servo-name { width: 22px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 8px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--accent-orange); transition: width 0.3s ease; }
  .servo-val { width: 44px; text-align: right; font-weight: 600; color: var(--text-dark); }
  .servo-val.detached { color: var(--accent-orange); font-size: 7.5px; font-weight: 700; }

  /* Buttons Grid */
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

  /* Attitude Horizon */
  .gimbal-box { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .gimbal-circle { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border-line); background: #eeebe3; position: relative; overflow: hidden; }
  .gimbal-horizon { position: absolute; left: -10px; right: -10px; top: 50%; height: 1.5px; background: var(--accent-orange); transform-origin: center; }
  .gimbal-sub { flex: 1; display: flex; flex-direction: column; gap: 3px; font-family: 'JetBrains Mono', monospace; }
  .gimbal-row { display: flex; justify-content: space-between; font-size: 8.5px; }
  .gimbal-lbl { color: var(--text-muted); }
  .gimbal-val { font-weight: 700; color: var(--text-dark); }

  /* Subsystems */
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

  /* Bottom Bar */
  .bottom-bar { display: flex; align-items: center; gap: 16px; background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 8px 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); pointer-events: auto; }
  .play-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-orange); border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s; }
  .play-btn:active { transform: scale(0.95); }
  .play-btn svg { width: 14px; height: 14px; fill: currentColor; }
  .timeline-track { flex: 1; height: 3px; background: #e3dfd7; border-radius: 2px; position: relative; display: flex; align-items: center; cursor: pointer; }
  .timeline-progress { height: 100%; background: var(--accent-orange); border-radius: 2px; width: 34%; }
  .timeline-thumb { width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2px solid var(--accent-orange); position: absolute; left: 34%; transform: translateX(-50%); }
  .timeline-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: var(--text-muted); }

  /* 3D Callout Labels */
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

  /* Grid overlay */
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
          <svg viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.2V15c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1.8c1.79-1.04 3-2.98 3-5.2a6 6 0 0 0-6-6zm-3.5 14.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-3.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>
          <span>OC-8</span>
        </div>
        <div class="title-block">
          <div class="title-tag">ROBOTIC CEPHALOPOD · EIGHT-ARM SUBSEA DRONE</div>
          <div class="title-main">Pelagos OC-8<span>/</span></div>
          <div class="title-sub">SOFT-ARM MANIPULATOR / FIELD SIMULATOR</div>
        </div>
      </div>

      <!-- Top Center Specs -->
      <div class="top-center interactive">
        <div class="spec-item">
          <span class="spec-label">JET LOAD</span>
          <div class="lift-load-bar" id="load-bar"></div>
        </div>
        <div class="spec-item">
          <span class="spec-label">SIM ID</span>
          <span class="spec-val">OC8-0731</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:08:06</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">STATUS</span>
          <span class="status-badge" id="val-status">
            <span class="status-dot"></span>
            <span id="val-status-text">HOLDING</span>
          </span>
        </div>
        <div class="spec-item">
          <span class="spec-label">OPERATOR</span>
          <span class="spec-val">TANK 2 · M.S.</span>
        </div>
      </div>
    </div>

    <!-- Operating Mode Floating Tag -->
    <div class="flight-mode-anchor">
      <div class="flight-mode-tag">OPERATING MODE</div>
      <div class="flight-mode-title" id="mode-title">HOLDING</div>
      <div class="flight-mode-sub" id="mode-desc">STATION KEEPING · 12.42 M DEPTH</div>
    </div>

    <!-- Panels Wrapper -->
    <div class="panels-wrapper">
      <!-- Left Column -->
      <div class="panel-col-left">
        <!-- 01 JET -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">JET</span>
            <span class="card-idx">01</span>
          </div>
          <div class="metric-row">
            <div>
              <span class="metric-big" id="val-kpa">17</span><span class="metric-unit">KPA</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">MANTLE PRESSURE</div>
            </div>
            <div style="text-align:right;">
              <span class="metric-big" id="val-thrust">6</span><span class="metric-unit">N</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">THRUST</div>
            </div>
          </div>
          <canvas class="wave-canvas" id="jet-canvas" width="200" height="42"></canvas>
          <div class="wave-meta">
            <span>PULSE <b id="val-pulse">0.0 HZ</b></span>
            <span>SIPHON IDLE</span>
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
              <span class="metric-big">86</span><span class="metric-unit">%</span>
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
              <div class="battery-seg fill-green"></div>
              <div class="battery-seg"></div>
            </div>
          </div>
          <div class="power-stats">
            <div>
              <div class="power-sub">DRAW</div>
              <div class="power-val" id="val-draw">16.1 W</div>
            </div>
            <div>
              <div class="power-sub">CELL</div>
              <div class="power-val">3.72 V</div>
            </div>
            <div>
              <div class="power-sub">MOTOR</div>
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
          <div style="display:flex; justify-content:space-between; font-size:7.5px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:6px;">
            <span>CURL PER ARM · TIP SPIRAL</span>
            <span class="subsys-tag green" id="arm-mode-tag">CURLING</span>
          </div>
          <div id="arm-rows"></div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="panel-col-right">
        <!-- 04 DEPTH -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">DEPTH</span>
            <span class="card-idx">04</span>
          </div>
          <div class="gimbal-box">
            <div class="gimbal-circle">
              <div class="gimbal-horizon" id="gimbal-line"></div>
            </div>
            <div class="gimbal-sub">
              <div class="gimbal-row">
                <span class="gimbal-lbl">DEPTH</span>
                <span class="gimbal-val" id="val-depth">12.42 M</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">V/S</span>
                <span class="gimbal-val">-0.04 M/S</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">PITCH</span>
                <span class="gimbal-val" id="val-pitch">+2.05°</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">ROLL</span>
                <span class="gimbal-val" id="val-roll">-1.82°</span>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:8px; font-family:'JetBrains Mono'; color:var(--text-muted); border-top:1px solid var(--border-line); padding-top:4px;">
            <span>HOLD</span>
            <span>STATION</span>
            <span>SPEED <b style="color:var(--text-dark);">0.05 M/S</b></span>
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
            <button class="pill-btn" data-assembly="mantle">MANTLE</button>
            <button class="pill-btn" data-assembly="arm-r2">ARM R2</button>
            <button class="pill-btn" data-assembly="siphon">SIPHON</button>
            <button class="pill-btn" data-assembly="beak">BEAK</button>
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
              <span class="subsys-name">01 OPTIC ARRAY</span>
              <span class="subsys-desc">2 x 52 MM LENS · IR RIM</span>
            </div>
            <span class="subsys-tag green">TRACKING</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">02 MANTLE SHELL</span>
              <span class="subsys-desc">6 PETALS · GLASS PORT</span>
            </div>
            <span class="subsys-tag green" id="sub-mantle-tag">SEALED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">03 PUMP CORE</span>
              <span class="subsys-desc">REACTOR RING · 7 PISTONS</span>
            </div>
            <span class="subsys-tag green" id="sub-pump-tag">RUNNING</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">04 ARM CHAINS</span>
              <span class="subsys-desc">282 LINKS · 489 WHEELS</span>
            </div>
            <span class="subsys-tag green" id="sub-arm-tag">8/8 LOCKED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">05 SIPHON</span>
              <span class="subsys-desc">2 SLEEVES · 4-FLAP NOZZLE</span>
            </div>
            <span class="subsys-tag green">IDLE</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">06 BEAK</span>
              <span class="subsys-desc">IRON JAW · RADULA BORE</span>
            </div>
            <span class="subsys-tag green">SEALED</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <button class="play-btn" id="btn-play">
        <svg viewBox="0 0 24 24" id="play-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:700; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:4px; text-transform:uppercase;">
          <span style="color:var(--text-dark); display:flex; align-items:center; gap:4px;"><span style="color:var(--accent-orange);">|</span> OPERATION LOG</span>
          <span>DIVE</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · HERO · RELEASE</span>
          <span>SURFACE</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:4px;">
          <span id="timeline-time">00:08 / 00:25</span>
          <span>8 OPERATOR ACTIONS</span>
        </div>
      </div>
    </div>
  </div>
`;

// Populate load bar (53% = 11 filled)
const loadBar = document.getElementById('load-bar');
for (let i = 0; i < 20; i++) {
  const seg = document.createElement('div');
  seg.className = `lift-seg ${i < 11 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate Arm curl rows
const armRowsContainer = document.getElementById('arm-rows');
const armData = [
  { id: 'R1', val: 91 },
  { id: 'R2', val: 75 },
  { id: 'R3', val: 89 },
  { id: 'R4', val: 80 },
  { id: 'L1', val: 67 },
  { id: 'L2', val: 85 },
  { id: 'L3', val: 80 },
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

const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
scene.add(ambientLight);

const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
mainKeyLight.position.set(5, 8, 5);
mainKeyLight.castShadow = true;
mainKeyLight.shadow.mapSize.width = 2048;
mainKeyLight.shadow.mapSize.height = 2048;
mainKeyLight.shadow.bias = -0.0001;
scene.add(mainKeyLight);

const fillLight = new THREE.DirectionalLight(0xffeedd, 0.7);
fillLight.position.set(-5, 2, -3);
scene.add(fillLight);

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.14 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.1;
floor.receiveShadow = true;
scene.add(floor);

// Ground Grid
const gridHelper = new THREE.GridHelper(12, 24, 0xd0ccc3, 0xe5e1d7);
gridHelper.position.y = -1.09;
scene.add(gridHelper);

// Teardown Orbit Calibration Circles in 3D Space (matching Images 3 & 5)
const orbitRingsGroup = new THREE.Group();
scene.add(orbitRingsGroup);
[1.4, 2.0, 2.8].forEach(r => {
  const circleGeo = new THREE.BufferGeometry();
  const pts = [];
  for (let a = 0; a <= 64; a++) {
    const ang = (a / 64) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r));
  }
  circleGeo.setFromPoints(pts);
  const ringLine = new THREE.Line(circleGeo, new THREE.LineDashedMaterial({ color: 0xcdcac0, dashSize: 0.08, gapSize: 0.06 }));
  ringLine.computeLineDistances();
  ringLine.position.y = 0.2;
  orbitRingsGroup.add(ringLine);
});

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
  metalness: 0.85,
  roughness: 0.35
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.05,
  transmission: 0.92,
  transparent: true,
  opacity: 1,
  ior: 1.5
});

const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0x050b14,
  metalness: 0.9,
  roughness: 0.05,
  transmission: 0.4,
  reflectivity: 0.9
});

// =========================================================================
// 3D MODEL HIERARCHY: PELAGOS OC-8
// =========================================================================

const robotRoot = new THREE.Group();
scene.add(robotRoot);

const coreGroup = new THREE.Group();
const mantleGroup = new THREE.Group();
const opticsGroup = new THREE.Group();
const siphonGroup = new THREE.Group();
const beakGroup = new THREE.Group();
const armsGroup = new THREE.Group();

robotRoot.add(coreGroup);
robotRoot.add(mantleGroup);
robotRoot.add(opticsGroup);
robotRoot.add(siphonGroup);
robotRoot.add(beakGroup);
robotRoot.add(armsGroup);

// --- 1. CENTRAL SPHERICAL HULL WITH RIVETS ---
const hullGeo = new THREE.SphereGeometry(0.62, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65);
const hullMesh = new THREE.Mesh(hullGeo, whiteMat);
hullMesh.castShadow = true;
hullMesh.receiveShadow = true;
coreGroup.add(hullMesh);

// Circumference Rivet Ring
const ringGeo = new THREE.TorusGeometry(0.622, 0.01, 12, 48);
const ringMesh = new THREE.Mesh(ringGeo, orangeMat);
ringMesh.rotation.x = Math.PI / 2;
coreGroup.add(ringMesh);

// Rivet studs along the ring
for (let r = 0; r < 24; r++) {
  const ang = (r / 24) * Math.PI * 2;
  const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), darkMechMat);
  rivet.position.set(Math.cos(ang) * 0.625, 0, Math.sin(ang) * 0.625);
  coreGroup.add(rivet);
}

// Inner high-density reactor pump core (gorgeously detailed in Image 5)
const reactorCoreGroup = new THREE.Group();
coreGroup.add(reactorCoreGroup);

const innerCoreSphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 28, 20), darkMechMat);
reactorCoreGroup.add(innerCoreSphere);

// 7 Radial Pump Core Pistons
for (let p = 0; p < 7; p++) {
  const ang = (p / 7) * Math.PI * 2;
  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.28, 16), darkMechMat);
  piston.position.set(Math.cos(ang) * 0.28, 0.12, Math.sin(ang) * 0.28);
  piston.rotation.z = Math.PI / 2;
  piston.rotation.y = -ang;
  reactorCoreGroup.add(piston);

  const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 16), orangeMat);
  pRing.position.copy(piston.position);
  reactorCoreGroup.add(pRing);
}

// Interlocking Drive Gears (44 x 36 teeth)
const driveGear1 = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 12, 36), orangeMat);
driveGear1.rotation.x = Math.PI / 2;
driveGear1.position.y = 0.1;
reactorCoreGroup.add(driveGear1);

const driveGear2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 28), darkMechMat);
driveGear2.position.y = 0.2;
reactorCoreGroup.add(driveGear2);

// Dense black & orange wire conduit harnesses (tangled ball look from Image 5)
for (let w = 0; w < 32; w++) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.35),
    new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.2 + (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.6),
    new THREE.Vector3((Math.random() - 0.5) * 0.45, 0.35 + (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.45)
  ]);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(curve, 14, 0.012, 6, false), Math.random() > 0.45 ? darkMechMat : orangeMat);
  reactorCoreGroup.add(wire);
}

// --- 2. OPTIC TURRETS (Twin 52mm lenses with orange bezels) ---
function createOpticTurret() {
  const turret = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 28), whiteMat);
  base.rotation.x = Math.PI / 2;
  base.castShadow = true;
  turret.add(base);

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.024, 16, 32), orangeMat);
  bezel.position.z = 0.08;
  turret.add(bezel);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.08, 28), darkMechMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.z = 0.07;
  turret.add(barrel);

  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  lens.rotation.x = -Math.PI / 2;
  lens.position.z = 0.09;
  turret.add(lens);

  const irDot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 12), orangeMat);
  irDot.position.z = 0.1;
  turret.add(irDot);

  return turret;
}

const eyeL = createOpticTurret();
eyeL.position.set(-0.35, 0.08, 0.42);
eyeL.rotation.set(0.15, -0.55, 0);
opticsGroup.add(eyeL);

const eyeR = createOpticTurret();
eyeR.position.set(0.35, 0.08, 0.42);
eyeR.rotation.set(0.15, 0.55, 0);
opticsGroup.add(eyeR);

// --- 3. 6 HINGED MANTLE PETALS (Opens dramatically like in Image 5) ---
const mantlePetals = [];
const numPetals = 6;

for (let i = 0; i < numPetals; i++) {
  const petalPivot = new THREE.Group();
  const angle = (i / numPetals) * Math.PI * 2;
  
  petalPivot.rotation.y = angle;
  petalPivot.position.set(0, 0.28, 0);

  // Curved shell petal
  const petalGeo = new THREE.CylinderGeometry(0.42, 0.64, 0.52, 14, 1, false, -0.45, 0.9);
  const petalMesh = new THREE.Mesh(petalGeo, whiteMat);
  petalMesh.position.set(0, 0.2, 0.15);
  petalMesh.rotation.x = -0.32;
  petalMesh.castShadow = true;
  petalMesh.receiveShadow = true;
  petalPivot.add(petalMesh);

  // Circular glass inspection port with orange bezel
  const portBezel = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.015, 12, 24), orangeMat);
  portBezel.position.set(0, 0.24, 0.55);
  portBezel.rotation.x = -0.32;
  petalPivot.add(portBezel);

  const portGlass = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), glassMat);
  portGlass.position.copy(portBezel.position);
  portGlass.rotation.copy(portBezel.rotation);
  petalPivot.add(portGlass);

  mantleGroup.add(petalPivot);
  mantlePetals.push({ pivot: petalPivot, baseAngle: angle, mesh: petalMesh });
}

// Mantle Top Cap
const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.35, 0.1, 24), whiteMat);
topCap.position.y = 0.7;
topCap.castShadow = true;
mantleGroup.add(topCap);

const topCapBezel = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 12, 32), orangeMat);
topCapBezel.rotation.x = Math.PI / 2;
topCapBezel.position.y = 0.75;
mantleGroup.add(topCapBezel);

// --- 4. VENTRAL SIPHON JET & BEAK ---
const siphonMesh = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 24, 1, true), whiteMat);
siphonMesh.rotation.x = -Math.PI / 2 + 0.4;
siphonMesh.position.set(0, -0.42, 0.35);
siphonMesh.castShadow = true;
siphonGroup.add(siphonMesh);

const siphonRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 12, 24), orangeMat);
siphonRing.position.copy(siphonMesh.position);
siphonRing.rotation.copy(siphonMesh.rotation);
siphonGroup.add(siphonRing);

const beakJaw = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.25, 4), darkMechMat);
beakJaw.rotation.x = Math.PI;
beakJaw.position.set(0, -0.55, 0);
beakGroup.add(beakJaw);

// --- 5. 8 SEGMENTED CONTINUUM TENTACLE ARMS ---
// Built to look chunky, mechanical, and grounded like Image 4!
const arms = [];
const numArms = 8;
const linksPerArm = 11;

for (let a = 0; a < numArms; a++) {
  const armId = a < 4 ? `R${a + 1}` : `L${a - 3}`;
  const baseAngle = (a / numArms) * Math.PI * 2;
  
  const armRoot = new THREE.Group();
  armRoot.position.set(Math.cos(baseAngle) * 0.52, -0.32, Math.sin(baseAngle) * 0.52);
  armRoot.rotation.y = -baseAngle + Math.PI / 2;
  armsGroup.add(armRoot);

  // Root actuator socket
  const socketMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.12, 16), darkMechMat);
  socketMesh.rotation.x = Math.PI / 2;
  armRoot.add(socketMesh);

  const socketBezel = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.018, 10, 20), orangeMat);
  armRoot.add(socketBezel);

  // Segmented links
  const linkObjects = [];
  let prevParent = armRoot;

  for (let l = 0; l < linksPerArm; l++) {
    const linkGroup = new THREE.Group();
    const linkLen = 0.18 * Math.pow(0.93, l);
    linkGroup.position.z = l === 0 ? 0.09 : linkLen;

    const radius = 0.13 * Math.pow(0.92, l);
    
    // Armored cylindrical white shell
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius, linkLen, 16), whiteMat);
    shell.rotation.x = Math.PI / 2;
    shell.position.z = linkLen / 2;
    shell.castShadow = true;
    linkGroup.add(shell);

    // Orange joint ring collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.02, 0.012, 8, 16), orangeMat);
    collar.position.z = 0.01;
    linkGroup.add(collar);

    // Ventral suction wheels (visible orange cups underneath)
    const suction = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.5, radius * 0.54, 0.045, 12), orangeMat);
    suction.position.set(0, -radius * 0.96, linkLen / 2);
    suction.rotation.x = Math.PI / 2;
    linkGroup.add(suction);

    const suctionHole = new THREE.Mesh(new THREE.CircleGeometry(radius * 0.35, 10), darkMechMat);
    suctionHole.position.set(0, -radius * 0.99, linkLen / 2);
    suctionHole.rotation.x = Math.PI / 2;
    linkGroup.add(suctionHole);

    prevParent.add(linkGroup);
    linkObjects.push(linkGroup);
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
// CALLOUT LABELS & LEADER LINES (Matching Images 3 & 5)
// =========================================================================

const calloutDefs = [
  { id: 'optics', text: 'OPTIC ARRAY', sub: '2 x 52 MM LENS · IR RIM', getPos: () => eyeR.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.12, 0.05, 0.1)) },
  { id: 'mantle', text: 'SHELL PETAL', sub: '6 x HINGED · GLASS PORT', getPos: () => mantlePetals[1].pivot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.45, 0.35)) },
  { id: 'reactor', text: 'REACTOR RING', sub: 'PUMP DRIVE · 7 PISTONS', getPos: () => reactorCoreGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, 0)) },
  { id: 'drive', text: 'DRIVE GEARS', sub: '44 x 36 TEETH', getPos: () => reactorCoreGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.25, -0.05, -0.1)) },
  { id: 'root', text: 'ROOT ACTUATOR', sub: 'ARM R2 · 3 DOF', getPos: () => arms[1].root.getWorldPosition(new THREE.Vector3()) },
  { id: 'glass_link', text: 'GLASS LINK', sub: 'GEAR TRAIN', getPos: () => arms[1].links[3].getWorldPosition(new THREE.Vector3()) },
  { id: 'wheels', text: 'ARM CHAINS', sub: '282 LINKS · 489 WHEELS', getPos: () => arms[4].links[5].getWorldPosition(new THREE.Vector3()) },
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
// INTERACTIVE STATE & CONTROLS
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

let camLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);
let spherical = new THREE.Spherical(5.0, Math.PI / 2.7, 0.85);

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
  spherical.radius = Math.max(1.8, Math.min(9.0, spherical.radius));
}, { passive: false });

// Assembly Switcher
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
  const timelineOp = document.getElementById('timeline-operator-text');

  const subMantle = document.getElementById('sub-mantle-tag');
  const subPump = document.getElementById('sub-pump-tag');
  const subArm = document.getElementById('sub-arm-tag');
  const armModeTag = document.getElementById('arm-mode-tag');

  if (mode === 'hero') {
    titleEl.textContent = 'HOLDING';
    descEl.textContent = 'STATION KEEPING · 12.42 M DEPTH';
    statusText.textContent = 'HOLDING';
    statusBadge.className = 'status-badge';
    timelineOp.textContent = 'OPERATOR · HERO · RELEASE';
    subMantle.textContent = 'SEALED';
    subMantle.className = 'subsys-tag green';
    subPump.textContent = 'RUNNING';
    subPump.className = 'subsys-tag green';
    subArm.textContent = '8/8 LOCKED';
    subArm.className = 'subsys-tag green';
    armModeTag.textContent = 'CURLING';
    armModeTag.className = 'subsys-tag green';
    spherical.radius = 5.0;
    spherical.phi = Math.PI / 2.7;
    camLookAt.set(0, 0, 0);
  } else if (mode === 'mantle') {
    titleEl.textContent = 'MANTLE OPEN';
    descEl.textContent = 'PETALS · 63% APART';
    statusText.textContent = 'MANTLE OPEN';
    statusBadge.className = 'status-badge orange';
    timelineOp.textContent = 'OPERATOR · ISOLATE MANTLE';
    subMantle.textContent = 'OPEN';
    subMantle.className = 'subsys-tag orange';
    subPump.textContent = 'EXPOSED';
    subPump.className = 'subsys-tag orange';
    spherical.radius = 3.8;
    spherical.phi = Math.PI / 3.2;
    camLookAt.set(0, 0.4, 0);
  } else if (mode === 'arm-r2') {
    titleEl.textContent = 'ARM R2 APART';
    descEl.textContent = 'ARM R2 · 48% APART';
    statusText.textContent = 'ARM R2 APART';
    statusBadge.className = 'status-badge orange';
    timelineOp.textContent = 'OPERATOR · ISOLATE ARM R2';
    subArm.textContent = 'DETACHED';
    subArm.className = 'subsys-tag orange';
    armModeTag.textContent = 'DETACHED';
    armModeTag.className = 'subsys-tag orange';
    spherical.radius = 4.4;
    spherical.phi = Math.PI / 2.5;
    spherical.theta = 0.55;
    camLookAt.set(0.6, 0.1, 0);
  } else if (mode === 'optics') {
    titleEl.textContent = 'OPTIC ARRAY';
    descEl.textContent = 'DUAL 52 MM · TRACKING CALIBRATION';
    statusText.textContent = 'OPTICS';
    statusBadge.className = 'status-badge';
    timelineOp.textContent = 'OPERATOR · ISOLATE OPTICS';
    spherical.radius = 2.4;
    spherical.phi = Math.PI / 2.3;
    spherical.theta = 0.2;
    camLookAt.set(0, 0.08, 0.42);
  } else if (mode === 'siphon') {
    titleEl.textContent = 'SIPHON JET';
    descEl.textContent = 'VECTOR NOZZLE · HYDRO PROPULSION';
    statusText.textContent = 'SIPHON';
    statusBadge.className = 'status-badge';
    timelineOp.textContent = 'OPERATOR · ISOLATE SIPHON';
    spherical.radius = 2.6;
    spherical.phi = Math.PI / 1.9;
    camLookAt.set(0, -0.4, 0.3);
  } else if (mode === 'beak') {
    titleEl.textContent = 'BEAK JAW';
    descEl.textContent = 'RADULA FEED MECHANISM';
    statusText.textContent = 'BEAK';
    statusBadge.className = 'status-badge';
    timelineOp.textContent = 'OPERATOR · ISOLATE BEAK';
    spherical.radius = 2.6;
    spherical.phi = Math.PI / 1.6;
    camLookAt.set(0, -0.5, 0);
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
    descEl.textContent = 'TURNTABLE 104° · 100% APART';
    document.getElementById('val-status-text').textContent = 'TEARDOWN';
    document.getElementById('val-status').className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · EXPLODED ON';
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

// Jet Pressure Wave Canvas
const jetCanvas = document.getElementById('jet-canvas');
const jetCtx = jetCanvas.getContext('2d');
let waveOffset = 0;

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
  const amp = currentAssembly === 'mantle' ? 14 : (isPlaying ? 8 : 2);

  for (let x = 0; x < w; x++) {
    const progress = x / w;
    const envelope = Math.sin(progress * Math.PI);
    const y = mid - Math.sin((x * 0.08) - waveOffset) * amp * envelope;
    if (x === 0) jetCtx.moveTo(x, y);
    else jetCtx.lineTo(x, y);
  }
  jetCtx.stroke();
}

// =========================================================================
// ANIMATION LOOP
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 8 * 60 + 6;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    waveOffset += delta * 4;
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

  const targetMantleOpen = (currentAssembly === 'mantle' || isExploded) ? 1.0 : 0.0;
  mantleOpenFactor += (targetMantleOpen - mantleOpenFactor) * 0.08;

  const targetArmApart = (currentAssembly === 'arm-r2') ? 1.0 : 0.0;
  armApartFactor += (targetArmApart - armApartFactor) * 0.08;

  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // Orbit rings visibility
  orbitRingsGroup.visible = (explodedFactor > 0.05 || armApartFactor > 0.05);

  // --- 1. MANTLE PETALS BLOSSOM & TOP CAP ---
  mantlePetals.forEach(petal => {
    // Open outward 0.78 rad (approx 45° to 65°)
    const openAngle = 0.78 * mantleOpenFactor + (0.5 * explodedFactor);
    petal.pivot.rotation.x = openAngle;
    
    const radialDist = explodedFactor * 0.45;
    petal.pivot.position.set(
      Math.sin(petal.baseAngle) * radialDist,
      0.28 + (explodedFactor * 0.35),
      Math.cos(petal.baseAngle) * radialDist
    );
  });

  topCap.position.y = 0.7 + (mantleOpenFactor * 0.35) + (explodedFactor * 0.75);
  topCapBezel.position.y = 0.75 + (mantleOpenFactor * 0.35) + (explodedFactor * 0.75);

  // --- 2. REACTOR CORE & DRIVE GEARS ROTATION ---
  if (isPlaying) {
    reactorCoreGroup.rotation.y += delta * 1.4;
  }
  reactorCoreGroup.position.y = explodedFactor * 0.35;

  // --- 3. OPTIC ARRAY DISPLACEMENT ---
  opticsGroup.position.z = explodedFactor * 0.42;

  // --- 4. VENTRAL SIPHON & BEAK DISPLACEMENT ---
  siphonGroup.position.y = -explodedFactor * 0.45;
  beakGroup.position.y = -explodedFactor * 0.6;

  // --- 5. TENTACLE ARMS WAVE KINEMATICS & APART DISASSEMBLY ---
  // Subsea hovering breathing bob
  const subseaHover = Math.sin(time * 1.5) * 0.04;
  robotRoot.position.y = isExploded ? 0 : subseaHover;

  arms.forEach((arm, aIdx) => {
    const isIsolatedR2 = (arm.id === 'R2');
    const apartBlend = isIsolatedR2 ? armApartFactor : 0.0;

    const expX = Math.cos(arm.baseAngle) * (explodedFactor * 0.6);
    const expZ = Math.sin(arm.baseAngle) * (explodedFactor * 0.6);

    if (isIsolatedR2 && apartBlend > 0.01) {
      // Pull Arm R2 out horizontally into a straight disassembled line (Image 3)
      arm.root.position.set(
        -1.3 * apartBlend + expX,
        -0.05 * apartBlend,
        0.4 * apartBlend + expZ
      );
      arm.root.rotation.set(0, -Math.PI / 2, 0);
    } else {
      arm.root.position.set(
        Math.cos(arm.baseAngle) * 0.52 + expX,
        -0.32 - (explodedFactor * 0.2),
        Math.sin(arm.baseAngle) * 0.52 + expZ
      );
      arm.root.rotation.set(0, -arm.baseAngle + Math.PI / 2, 0);
    }

    // Kinematics: Natural graceful octopus curling & grounding
    arm.links.forEach((link, lIdx) => {
      if (isIsolatedR2 && apartBlend > 0.01) {
        // Disassembled spaced-out links horizontally (Image 3)
        const spreadDistance = lIdx * 0.14 * apartBlend;
        link.position.z = 0.18 + spreadDistance;
        link.rotation.set((1 - apartBlend) * 0.18, 0, 0);
      } else {
        // Grounded natural holding pose:
        // Arch slightly down and curl tip gracefully upwards
        const wavePhase = time * 2.0 - (lIdx * 0.35) + arm.curlOffset;
        const breathing = Math.sin(time * 1.5 + aIdx * 0.5) * 0.06;
        
        // Base links arch down toward the floor, distal links curl inwards/upwards
        const baseArch = lIdx < 4 ? 0.22 : -0.15;
        const curlX = baseArch + Math.sin(wavePhase) * (0.08 + lIdx * 0.015) + breathing;
        const curlY = Math.cos(wavePhase * 0.8) * (0.04 + lIdx * 0.012);
        
        link.rotation.x = isPlaying ? curlX : 0.18;
        link.rotation.y = isPlaying ? curlY : 0;
        link.rotation.z = 0;
      }
    });
  });

  // Screen Labels
  renderScreenLabels();
  drawJetWave(time);
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
  document.getElementById('timeline-time').textContent = `${mins}:${secs} / 00:25`;

  const pitchAngle = Math.sin(time * 0.8) * 2.05;
  const rollAngle = Math.cos(time * 0.6) * 1.82;
  const gimbalLine = document.getElementById('gimbal-line');
  gimbalLine.style.transform = `translateY(${pitchAngle * 1.5}px) rotate(${rollAngle}deg)`;
  document.getElementById('val-pitch').textContent = `${pitchAngle >= 0 ? '+' : ''}${pitchAngle.toFixed(2)}°`;
  document.getElementById('val-roll').textContent = `${rollAngle >= 0 ? '+' : ''}${rollAngle.toFixed(2)}°`;

  const kpa = (16 + Math.sin(time * 2) * 5 + (currentAssembly === 'mantle' ? 8 : 0)).toFixed(0);
  document.getElementById('val-kpa').textContent = kpa;
  document.getElementById('val-draw').textContent = `${(16.1 + Math.sin(time) * 4.9).toFixed(1)} W`;

  armData.forEach(item => {
    const isDetached = (currentAssembly === 'arm-r2' && item.id === 'R2');
    const valEl = document.getElementById(`servo-val-${item.id}`);
    const fillEl = document.getElementById(`servo-fill-${item.id}`);

    if (isDetached) {
      valEl.textContent = 'DETACHED';
      valEl.className = 'servo-val detached';
      fillEl.style.width = '0%';
    } else {
      const dynamicVal = Math.min(100, Math.max(20, Math.round(item.val + Math.sin(time * 1.5 + item.val) * 8)));
      valEl.textContent = `${dynamicVal}%`;
      valEl.className = 'servo-val';
      fillEl.style.width = `${dynamicVal}%`;
    }
  });
}

animate();
