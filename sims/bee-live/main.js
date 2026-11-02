import * as THREE from 'three';

// =========================================================================
// MELLIS HB-7 · ROBOTIC POLLINATOR MICRO AIR VEHICLE
// FIELD SIMULATOR & 3D TEARDOWN
// Exact match to user lab console screenshots (Images 1 & 2)
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
  .metric-sub { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; color: var(--text-dark); }

  /* Sine Wave Canvas */
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

  /* Leg Servos Rows */
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
  .timeline-progress { height: 100%; background: var(--accent-orange); border-radius: 2px; width: 66%; }
  .timeline-thumb { width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2px solid var(--accent-orange); position: absolute; left: 66%; transform: translateX(-50%); }
  .timeline-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: var(--text-muted); }

  /* 3D Callouts */
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
          <svg viewBox="0 0 24 24"><path d="M12 2C8 2 6 5 6 7c0 1.5.8 2.8 2 3.8V14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-3.2c1.2-1 2-2.3 2-3.8 0-2-2-5-6-5zm-3 15v4h2v-4H9zm4 0v4h2v-4h-2z"/></svg>
          <span>HB-7</span>
        </div>
        <div class="title-block">
          <div class="title-tag">ROBOTIC POLLINATOR · MICRO AIR VEHICLE</div>
          <div class="title-main">Mellis HB-7<span>/</span></div>
          <div class="title-sub">FLAPPING-WING DRONE / FIELD SIMULATOR</div>
        </div>
      </div>

      <!-- Top Center Specs -->
      <div class="top-center interactive">
        <div class="spec-item">
          <span class="spec-label">LIFT LOAD</span>
          <div class="lift-load-bar" id="load-bar"></div>
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
          <span class="spec-val">LAB 3 · R.K.</span>
        </div>
      </div>
    </div>

    <!-- Operating Mode Floating Tag -->
    <div class="flight-mode-anchor">
      <div class="flight-mode-tag">FLIGHT MODE</div>
      <div class="flight-mode-title" id="mode-title">HOVER</div>
      <div class="flight-mode-sub" id="mode-desc">STATION KEEPING · 144 MM AGL</div>
    </div>

    <!-- Panels Wrapper -->
    <div class="panels-wrapper">
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
              <span class="metric-big" id="val-freq">7.5</span><span class="metric-unit">HZ</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">STROKE FREQUENCY</div>
            </div>
            <div style="text-align:right;">
              <span class="metric-big">±32°</span>
              <div style="font-size:7px; color:var(--text-muted); font-family:'JetBrains Mono'; text-transform:uppercase;">AMPLITUDE</div>
            </div>
          </div>
          <canvas class="wave-canvas" id="wing-canvas" width="200" height="42"></canvas>
          <div class="wave-meta">
            <span>PLAYBACK <b style="color:var(--text-dark);">1.0×</b></span>
            <span>SHUTTER 1/60</span>
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
              <span class="metric-big">80</span><span class="metric-unit">%</span>
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
          <div style="display:flex; justify-content:space-between; font-size:7.5px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:6px;">
            <span>LOAD PER LEG · KNEE TORQUE</span>
            <span class="subsys-tag green" id="leg-tag">ACTIVE</span>
          </div>
          <div id="arm-rows"></div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="panel-col-right">
        <!-- 04 FLIGHT / ATTITUDE -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">FLIGHT</span>
            <span class="card-idx">04</span>
          </div>
          <div class="gimbal-box">
            <div class="gimbal-circle">
              <div class="gimbal-horizon" id="gimbal-line"></div>
            </div>
            <div class="gimbal-sub">
              <div class="gimbal-row">
                <span class="gimbal-lbl">ALT AGL</span>
                <span class="gimbal-val" id="val-alt">144.0 MM</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">V/S</span>
                <span class="gimbal-val">+0.6 MM/S</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">PITCH</span>
                <span class="gimbal-val" id="val-pitch">+0.03°</span>
              </div>
              <div class="gimbal-row">
                <span class="gimbal-lbl">ROLL</span>
                <span class="gimbal-val" id="val-roll">-0.57°</span>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:8px; font-family:'JetBrains Mono'; color:var(--text-muted); border-top:1px solid var(--border-line); padding-top:4px;">
            <span>HOLD</span>
            <span>POSITION</span>
            <span>AIRSPEED <b style="color:var(--text-dark);">0.00 M/S</b></span>
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
            <button class="pill-btn" data-assembly="leg-l2">LEG L2</button>
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
          <div class="btn-grid-3">
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
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <button class="play-btn" id="btn-play">
        <svg viewBox="0 0 24 24" id="play-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:700; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:4px; text-transform:uppercase;">
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
        <div class="timeline-meta" style="margin-top:4px;">
          <span id="timeline-time">00:21 / 00:24</span>
          <span>8 OPERATOR ACTIONS</span>
        </div>
      </div>
    </div>
  </div>
`;

// Populate load bar (66% = 13 filled)
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
// THREE.JS 3D SCENE SETUP
// =========================================================================

const canvas = document.getElementById('gl');
const labelsCanvas = document.getElementById('labels-canvas');
const labelsCtx = labelsCanvas.getContext('2d');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3.2, 1.6, 3.6);

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
mainKeyLight.position.set(4, 7, 5);
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
floor.position.y = -1.0;
floor.receiveShadow = true;
scene.add(floor);

// Ground Grid
const gridHelper = new THREE.GridHelper(12, 24, 0xd0ccc3, 0xe5e1d7);
gridHelper.position.y = -0.99;
scene.add(gridHelper);

// Teardown Orbit Calibration Circles in 3D Space (matching Image 2)
const orbitRingsGroup = new THREE.Group();
scene.add(orbitRingsGroup);
const orbitRadii = [1.2, 1.8, 2.4];
orbitRadii.forEach(r => {
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
  roughness: 0.24
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

const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0x050b14,
  metalness: 0.9,
  roughness: 0.05,
  transmission: 0.5,
  reflectivity: 0.95
});

const wingMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.88,
  opacity: 0.85,
  transparent: true,
  roughness: 0.15,
  thickness: 0.04,
  side: THREE.DoubleSide
});

const motionBlurMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.18,
  side: THREE.DoubleSide
});

// =========================================================================
// 3D MODEL HIERARCHY: MELLIS HB-7
// =========================================================================

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

beeRoot.add(headGroup);
beeRoot.add(neckGroup);
beeRoot.add(thoraxGroup);
beeRoot.add(gearCoreGroup);
beeRoot.add(abdomenGroup);
beeRoot.add(wingsGroup);
beeRoot.add(legsGroup);
beeRoot.add(hardwareGroup);

// --- 1. HEAD & OPTIC ASSEMBLY ---
headGroup.position.set(0, 0.15, 0.65);

// White Dome Shell
const headShell = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), whiteMat);
headShell.scale.set(1.0, 0.95, 1.15);
headShell.castShadow = true;
headGroup.add(headShell);

// Large Camera Eye with Orange Bezel
const eyeBezel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 16, 32), orangeMat);
eyeBezel.position.set(0, 0.02, 0.4);
headGroup.add(eyeBezel);

const eyeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24), lensMat);
eyeLens.rotation.x = Math.PI / 2;
eyeLens.position.set(0, 0.02, 0.41);
headGroup.add(eyeLens);

const irDot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), orangeMat);
irDot.position.set(0, 0.02, 0.43);
headGroup.add(irDot);

// Dual Articulated Antennae
function createAntenna(side) {
  const ant = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 8), darkMechMat);
  stem.position.y = 0.28;
  ant.add(stem);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.15, 12), orangeMat);
  tip.position.y = 0.56;
  ant.add(tip);
  ant.position.set(side * 0.16, 0.32, 0.2);
  ant.rotation.set(-0.25, side * 0.15, side * 0.35);
  return ant;
}
const antL = createAntenna(-1);
const antR = createAntenna(1);
headGroup.add(antL, antR);

// --- 2. 10-SEGMENT NECK COLLAR BEARING ---
neckGroup.position.set(0, 0.12, 0.38);
const neckCollar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 16, 32), orangeMat);
neckGroup.add(neckCollar);

for (let b = 0; b < 10; b++) {
  const ang = (b / 10) * Math.PI * 2;
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), darkMechMat);
  bead.position.set(Math.cos(ang) * 0.32, Math.sin(ang) * 0.32, 0);
  neckGroup.add(bead);
}

// --- 3. THORAX & INNER DRIVE GEAR CORE ---
thoraxGroup.position.set(0, 0.1, 0);

// White segmented shell pods
const thoraxShell = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.65, 32), whiteMat);
thoraxShell.rotation.x = Math.PI / 2;
thoraxShell.castShadow = true;
thoraxGroup.add(thoraxShell);

const tRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.02, 12, 32), orangeMat);
tRing1.position.z = -0.18;
thoraxGroup.add(tRing1);

const tRing2 = tRing1.clone();
tRing2.position.z = 0.18;
thoraxGroup.add(tRing2);

// Dense inner drive gears (spinning free)
gearCoreGroup.position.set(0, 0.1, 0);
for (let g = 0; g < 4; g++) {
  const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.26 - g * 0.04, 0.26 - g * 0.04, 0.06, 24), darkMechMat);
  gear.rotation.x = Math.PI / 2;
  gear.position.z = (g - 1.5) * 0.1;
  gearCoreGroup.add(gear);

  const gTeeth = new THREE.Mesh(new THREE.TorusGeometry(0.26 - g * 0.04, 0.015, 8, 24), orangeMat);
  gTeeth.position.z = gear.position.z;
  gearCoreGroup.add(gTeeth);
}

// Inner high-density wires and pistons
for (let w = 0; w < 12; w++) {
  const wireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, -0.2),
    new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3, 0),
    new THREE.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, 0.2)
  ]);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(wireCurve, 12, 0.012, 6, false), Math.random() > 0.4 ? darkMechMat : orangeMat);
  gearCoreGroup.add(wire);
}

// --- 4. ABDOMEN CAPSULE (GEAR TRAIN & RETURN SPRING) ---
abdomenGroup.position.set(0, 0.06, -0.65);

const abdShell = new THREE.Mesh(new THREE.SphereGeometry(0.44, 32, 24), whiteMat);
abdShell.scale.set(0.9, 0.9, 1.7);
abdShell.castShadow = true;
abdomenGroup.add(abdShell);

const abdRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.025, 12, 32), orangeMat);
abdRing.position.z = 0.18;
abdomenGroup.add(abdRing);

const stingerTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.38, 16), darkMechMat);
stingerTip.rotation.x = -Math.PI / 2;
stingerTip.position.z = -0.82;
abdomenGroup.add(stingerTip);

// --- 5. TRANSLUCENT FLAPPING WINGS & MOTION BLUR FAN ARCS ---
wingsGroup.position.set(0, 0.36, 0.05);

const wingLRoot = new THREE.Group();
wingLRoot.position.set(-0.35, 0, 0);
wingsGroup.add(wingLRoot);

const wingRRoot = new THREE.Group();
wingRRoot.position.set(0.35, 0, 0);
wingsGroup.add(wingRRoot);

function createVeinedWingMesh(isLeft) {
  const g = new THREE.Group();
  const dir = isLeft ? -1 : 1;

  // Wing shape outline
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(dir * 0.5, 0.2, dir * 1.2, 0.6, dir * 1.8, 0.85);
  shape.bezierCurveTo(dir * 1.9, 0.7, dir * 1.5, 0.15, dir * 0.6, 0);
  shape.bezierCurveTo(dir * 0.2, -0.1, 0, 0, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 18);
  const mesh = new THREE.Mesh(geo, wingMat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.castShadow = true;
  g.add(mesh);

  // Black leading edge spar
  const spar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.008, 1.8, 8), darkMechMat);
  spar.position.set(dir * 0.9, 0, 0.42);
  spar.rotation.z = -dir * 0.45;
  g.add(spar);

  // Orange quick release hinge
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), orangeMat);
  hinge.rotation.z = Math.PI / 2;
  g.add(hinge);

  // Delicate bionic vein lines
  const pts = [
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(dir * 0.9, 0, 0.42),
    new THREE.Vector3(dir * 1.8, 0, 0.85), new THREE.Vector3(dir * 0.6, 0, 0.2)
  ];
  const veinLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 }));
  g.add(veinLine);

  return g;
}

const forewingL = createVeinedWingMesh(true);
wingLRoot.add(forewingL);

const forewingR = createVeinedWingMesh(false);
wingRRoot.add(forewingR);

// Motion Blur Fan Geometry (as seen in Image 1 Hover Mode!)
function createMotionBlurFan(isLeft) {
  const dir = isLeft ? -1 : 1;
  const fanGeo = new THREE.RingGeometry(0.2, 1.85, 24, 1, isLeft ? Math.PI * 0.8 : -Math.PI * 0.3, Math.PI * 0.5);
  const fan = new THREE.Mesh(fanGeo, motionBlurMat);
  fan.rotation.x = Math.PI / 2;
  fan.position.set(dir * 0.2, 0, 0.2);
  return fan;
}
const blurFanL = createMotionBlurFan(true);
const blurFanR = createMotionBlurFan(false);
wingLRoot.add(blurFanL);
wingRRoot.add(blurFanR);

// --- 6. SIX ARTICULATED TRIPOD LANDING LEGS ---
legsGroup.position.set(0, -0.15, 0);

const legs = [];
for (let side = -1; side <= 1; side += 2) {
  const isLeft = side < 0;
  for (let idx = 0; idx < 3; idx++) {
    const legRoot = new THREE.Group();
    const legZ = 0.25 - idx * 0.25;
    legRoot.position.set(side * 0.38, 0, legZ);
    legsGroup.add(legRoot);

    // Orange hip servo ball
    const hip = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), orangeMat);
    legRoot.add(hip);

    // White upper femur tube
    const femurGroup = new THREE.Group();
    legRoot.add(femurGroup);

    const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.65, 12), whiteMat);
    femur.position.set(side * 0.16, -0.3, 0);
    femur.rotation.z = side * 0.55;
    femur.castShadow = true;
    femurGroup.add(femur);

    // Knee servo joint with orange ring
    const knee = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), darkMechMat);
    knee.position.set(side * 0.32, -0.58, 0);
    femurGroup.add(knee);

    const kneeRing = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.012, 8, 16), orangeMat);
    kneeRing.position.copy(knee.position);
    femurGroup.add(kneeRing);

    // Slender lower tibia rod
    const tibiaGroup = new THREE.Group();
    tibiaGroup.position.copy(knee.position);
    femurGroup.add(tibiaGroup);

    const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.015, 0.72, 10), whiteMat);
    tibia.position.set(side * 0.15, -0.35, 0.08);
    tibia.rotation.z = -side * 0.38;
    tibia.castShadow = true;
    tibiaGroup.add(tibia);

    // Rubber contact foot tip
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), darkMechMat);
    foot.position.set(side * 0.28, -0.68, 0.15);
    tibiaGroup.add(foot);

    legs.push({
      id: `${isLeft ? 'L' : 'R'}${idx + 1}`,
      root: legRoot,
      femur: femurGroup,
      tibia: tibiaGroup,
      foot,
      side,
      idx
    });
  }
}

// Scattered Small Teardown Hardware (screws, pins, washers floating in Image 2)
for (let h = 0; h < 24; h++) {
  const hMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8),
    Math.random() > 0.5 ? orangeMat : darkMechMat
  );
  hMesh.position.set((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2.5);
  hMesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  hardwareGroup.add(hMesh);
}

// =========================================================================
// CALLOUT LABELS & LEADER LINES
// =========================================================================

const calloutDefs = [
  { id: 'optics', text: 'OPTIC HEAD', sub: '2 - LENS · AMBER IR', getPos: () => headGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.2, 0.3)) },
  { id: 'neck', text: 'NECK BEARING', sub: '10 SEGMENTS COLLAR', getPos: () => neckGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.2, 0.1, 0.1)) },
  { id: 'wing_l', text: 'WING HINGE', sub: 'QUICK RELEASE · 7.5 HZ', getPos: () => wingLRoot.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.4, 0.3, 0.2)) },
  { id: 'gears', text: 'DRIVE GEARS', sub: 'SPINNING FREE', getPos: () => gearCoreGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0.25, 0.1, -0.1)) },
  { id: 'abdomen', text: 'ABDOMEN CAPSULE', sub: 'GEAR TRAIN · RETURN SPRING', getPos: () => abdomenGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, -0.2, -0.4)) },
  { id: 'leg_l2', text: 'LEG SERVOS', sub: '6 LEGS · 3 JOINTS', getPos: () => legs[1].root.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.3, -0.4, 0)) }
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
// INTERACTIVE CONTROLS
// =========================================================================

let currentAssembly = 'hero';
let showLabels = true;
let isExploded = false;
let isTurntable = false;
let isPlaying = true;
let showMotionBlur = true;

let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);
let spherical = new THREE.Spherical(4.6, Math.PI / 2.7, 0.75);

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
  spherical.radius = Math.max(1.8, Math.min(8.5, spherical.radius));
}, { passive: false });

// Assembly switcher
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
    titleEl.textContent = 'HOVER';
    descEl.textContent = 'STATION KEEPING · 144 MM AGL';
    statusText.textContent = 'HOVER';
    statusBadge.className = 'status-badge';
    spherical.radius = 4.6;
    spherical.phi = Math.PI / 2.7;
    camLookAt.set(0, 0, 0);
  } else if (mode === 'optics') {
    titleEl.textContent = 'OPTIC HEAD';
    descEl.textContent = '2 - LENS · AMBER IR SENSOR';
    statusText.textContent = 'OPTICS';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.4;
    spherical.phi = Math.PI / 2.4;
    spherical.theta = 0.4;
    camLookAt.set(0, 0.15, 0.65);
  } else if (mode === 'wing') {
    titleEl.textContent = 'WING ROOTS';
    descEl.textContent = '4 HINGES · 7.5 HZ CRANK';
    statusText.textContent = 'WING ROOTS';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 3.0;
    spherical.theta = 1.0;
    camLookAt.set(-0.35, 0.36, 0.1);
  } else if (mode === 'leg-l2') {
    titleEl.textContent = 'LEG SERVOS';
    descEl.textContent = 'LOAD PER LEG · KNEE TORQUE';
    statusText.textContent = 'LEG L2';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.6;
    spherical.phi = Math.PI / 2.1;
    camLookAt.set(-0.38, -0.3, 0);
  } else if (mode === 'thorax') {
    titleEl.textContent = 'THORAX DRIVE';
    descEl.textContent = '3 GEARS · 11 ACTUATORS';
    statusText.textContent = 'THORAX';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 2.5;
    camLookAt.set(0, 0.1, 0);
  } else if (mode === 'abdomen') {
    titleEl.textContent = 'ABDOMEN CAPSULE';
    descEl.textContent = 'GEAR TRAIN · RETURN SPRING';
    statusText.textContent = 'ABDOMEN';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.2;
    spherical.phi = Math.PI / 2.5;
    spherical.theta = Math.PI * 0.8;
    camLookAt.set(0, 0.06, -0.65);
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

const btnMotion = document.getElementById('btn-motion');
btnMotion.addEventListener('click', () => {
  showMotionBlur = !showMotionBlur;
  btnMotion.classList.toggle('active', showMotionBlur);
  blurFanL.visible = showMotionBlur;
  blurFanR.visible = showMotionBlur;
});

const btnPlay = document.getElementById('btn-play');
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('play-icon').innerHTML = isPlaying ?
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' :
    '<path d="M8 5v14l11-7z"/>';
});

// Wing Wave Canvas
const wingCanvas = document.getElementById('wing-canvas');
const wingCtx = wingCanvas.getContext('2d');
let waveOffset = 0;

function drawWingWave(time) {
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
  const amp = isPlaying ? 14 : 2;

  for (let x = 0; x < w; x++) {
    const progress = x / w;
    const envelope = Math.sin(progress * Math.PI);
    const y = mid - Math.sin((x * 0.16) - waveOffset) * amp * envelope;
    if (x === 0) wingCtx.moveTo(x, y);
    else wingCtx.lineTo(x, y);
  }
  wingCtx.stroke();
}

// =========================================================================
// ANIMATION LOOP
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 21;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    waveOffset += delta * 7.5 * Math.PI * 2; // 7.5 Hz stroke
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

  // --- 1. EXPLODED TEARDOWN COMPONENT DISPLACEMENTS ---
  headGroup.position.set(0, 0.15 + explodedFactor * 0.35, 0.65 + explodedFactor * 0.65);
  neckGroup.position.set(0, 0.12 + explodedFactor * 0.2, 0.38 + explodedFactor * 0.35);
  thoraxGroup.position.set(0, 0.1, -explodedFactor * 0.1);
  gearCoreGroup.position.set(0, 0.1 + explodedFactor * 0.25, 0);
  gearCoreGroup.rotation.y += isPlaying ? delta * 2.5 : 0;
  abdomenGroup.position.set(0, 0.06 - explodedFactor * 0.25, -0.65 - explodedFactor * 0.75);

  wingsGroup.position.y = 0.36 + explodedFactor * 0.45;
  wingLRoot.position.x = -0.35 - explodedFactor * 0.55;
  wingRRoot.position.x = 0.35 + explodedFactor * 0.55;

  legs.forEach(leg => {
    leg.root.position.x = leg.side * (0.38 + explodedFactor * 0.45);
    leg.root.position.y = -explodedFactor * 0.25;
  });

  hardwareGroup.visible = (explodedFactor > 0.05);
  orbitRingsGroup.visible = (explodedFactor > 0.05);

  // --- 2. HOVERING & HIGH-SPEED WING FLAPPING ---
  if (!isExploded) {
    // Body hover bobbing
    const hoverY = Math.sin(time * 3.5) * 0.04;
    const hoverPitch = Math.cos(time * 2.0) * 0.02;
    const hoverRoll = Math.sin(time * 2.5) * 0.02;
    beeRoot.position.y = hoverY;
    beeRoot.rotation.set(hoverPitch, 0, hoverRoll);

    // 7.5 Hz wing stroke amplitude ±32°
    const strokeAngle = Math.sin(waveOffset) * (32 * Math.PI / 180);
    const featherAngle = Math.cos(waveOffset) * 0.22;

    wingLRoot.rotation.set(featherAngle, strokeAngle, 0);
    wingRRoot.rotation.set(featherAngle, -strokeAngle, 0);

    blurFanL.visible = showMotionBlur;
    blurFanR.visible = showMotionBlur;

    // Antenna subtle twitching
    antL.rotation.z = -0.35 + Math.sin(time * 6) * 0.05;
    antR.rotation.z = 0.35 + Math.cos(time * 6) * 0.05;
  } else {
    beeRoot.position.set(0, 0, 0);
    beeRoot.rotation.set(0, 0, 0);
    wingLRoot.rotation.set(0.35, 0.45, 0);
    wingRRoot.rotation.set(0.35, -0.45, 0);
    blurFanL.visible = false;
    blurFanR.visible = false;
  }

  // Screen Labels
  renderScreenLabels();
  drawWingWave(time);
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
  const mm = String(Math.floor(totalSecs / 60)).padStart(2, '0');
  const ss = String(totalSecs % 60).padStart(2, '0');
  document.getElementById('val-runtime').textContent = `00:${mm}:${ss}`;
  document.getElementById('timeline-time').textContent = `${mm}:${ss} / 00:24`;

  const pitchAngle = Math.sin(time * 0.8) * 0.05;
  const rollAngle = Math.cos(time * 0.6) * 0.6;
  const gimbalLine = document.getElementById('gimbal-line');
  gimbalLine.style.transform = `translateY(${pitchAngle * 10}px) rotate(${rollAngle}deg)`;
  document.getElementById('val-pitch').textContent = `${pitchAngle >= 0 ? '+' : ''}${pitchAngle.toFixed(2)}°`;
  document.getElementById('val-roll').textContent = `${rollAngle >= 0 ? '+' : ''}${rollAngle.toFixed(2)}°`;

  legData.forEach(item => {
    const valEl = document.getElementById(`servo-val-${item.id}`);
    const fillEl = document.getElementById(`servo-fill-${item.id}`);
    if (isExploded) {
      valEl.textContent = 'DETACHED';
      valEl.className = 'servo-val detached';
      fillEl.style.width = '0%';
    } else {
      const dynamicVal = Math.min(100, Math.max(20, Math.round(item.val + Math.sin(time * 3 + item.val) * 6)));
      valEl.textContent = `${dynamicVal}%`;
      valEl.className = 'servo-val';
      fillEl.style.width = `${dynamicVal}%`;
    }
  });
}

animate();
