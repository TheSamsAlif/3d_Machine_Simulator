import * as THREE from 'three';

// =========================================================================
// TELSON SC-8 · ROBOTIC SCORPION ARMOURED GROUND UNIT
// OCTOPOD WALKER / FIELD SIMULATOR & 3D STRIKE TEARDOWN
// Exact 1:1 recreation of reference engineering lab console (docs/scorpion.gif)
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
  #labels-canvas { position: absolute; inset: 0; pointer-events: none; width: 100%; height: 100%; z-index: 10; }

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

  /* Gait Stance Canvas */
  .wave-canvas { width: 100%; height: 42px; border-bottom: 1px solid var(--border-line); margin-bottom: 6px; display: block; }
  .wave-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); }

  /* Speedometer Semi-circle for Strike */
  .gauge-box { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .gauge-dial { width: 68px; height: 36px; border-top-left-radius: 40px; border-top-right-radius: 40px; border: 4px solid #e8e4dc; border-bottom: none; position: relative; overflow: hidden; }
  .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 28px; height: 2px; background: var(--accent-orange); transform-origin: left center; transform: rotate(45deg); transition: transform 0.2s ease; }

  /* Leg Servo Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-bottom: 3.5px; }
  .servo-name { width: 22px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 8px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--text-dark); transition: width 0.3s ease; }
  .servo-val { width: 40px; text-align: right; font-weight: 600; color: var(--text-dark); }

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

  /* Subsystems List */
  .subsys-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #f0ede6; }
  .subsys-item:last-child { border-bottom: none; }
  .subsys-left { display: flex; flex-direction: column; gap: 1px; }
  .subsys-name { font-size: 8.5px; font-weight: 700; color: var(--text-dark); font-family: 'JetBrains Mono', monospace; }
  .subsys-desc { font-size: 7.5px; color: var(--text-muted); }
  .subsys-tag { font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; padding: 1px 6px; border-radius: 2px; }
  .subsys-tag.green { background: var(--accent-green-bg); color: var(--accent-green); }
  .subsys-tag.orange { background: var(--accent-orange-bg); color: var(--accent-orange); }

  /* Center Bottom Status Overlay */
  .flight-mode-tag {
    position: absolute;
    left: 270px;
    bottom: 96px;
    display: flex;
    flex-direction: column;
    pointer-events: none;
  }
  .flight-mode-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
  .flight-mode-big { font-size: 26px; font-weight: 800; color: var(--accent-orange); letter-spacing: -0.5px; line-height: 1.1; }
  .flight-mode-spec { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; color: var(--text-muted); text-transform: uppercase; margin-top: 3px; letter-spacing: 0.5px; }

  /* Bottom Timeline Bar */
  .bottom-bar { background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 8px 18px; display: flex; align-items: center; gap: 18px; pointer-events: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .play-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--accent-orange); border: none; cursor: pointer; display: grid; place-items: center; color: #fff; flex-shrink: 0; box-shadow: 0 2px 6px rgba(255, 72, 0, 0.3); }
  .play-btn svg { width: 14px; height: 14px; fill: currentColor; }
  .timeline-track { flex: 1; height: 5px; background: #e5e1d7; border-radius: 2px; position: relative; cursor: pointer; }
  .timeline-progress { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent-orange); border-radius: 2px; width: 18%; }
  .timeline-thumb { position: absolute; left: 18%; top: 50%; width: 12px; height: 12px; background: #fff; border: 2.5px solid var(--accent-orange); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
  .timeline-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); }

  /* Screen Space Callout Labels */
  .dom-label {
    position: absolute;
    pointer-events: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: var(--text-dark);
    letter-spacing: 0.8px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.25s ease;
    transform: translate(12px, -50%);
    background: rgba(255, 255, 255, 0.85);
    padding: 2px 6px;
    border-radius: 3px;
    border-left: 2px solid var(--accent-orange);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .dom-label .sub { display: block; font-size: 7.5px; font-weight: 500; color: var(--text-muted); }
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
          <svg viewBox="0 0 24 24"><path d="M12 2l3 5h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z"/></svg>
          SC-8
        </div>
        <div class="title-block">
          <div class="title-tag">ROBOTIC SCORPION · ARMOURED GROUND UNIT</div>
          <div class="title-main">Telson SC-8<span>/</span></div>
          <div class="title-sub">OCTOPOD WALKER / FIELD SIMULATOR</div>
        </div>
      </div>

      <div class="top-center">
        <div class="spec-item">
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <span class="spec-label">DRIVE LOAD</span>
            <span class="spec-label" style="color:var(--text-dark); font-weight:700;">58%</span>
          </div>
          <div class="lift-load-bar" id="load-bar"></div>
          <div style="display:flex; justify-content:space-between; font-size:6.5px; color:var(--text-muted); margin-top:1px;">
            <span>IDLE</span>
            <span>CRUISE</span>
            <span>MAX</span>
          </div>
        </div>

        <div class="spec-item">
          <span class="spec-label">SIM ID</span>
          <span class="spec-val">SC8-0730</span>
        </div>

        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:00:03</span>
        </div>

        <div class="spec-item">
          <span class="status-badge" id="val-status">
            <span class="status-dot"></span>
            <span id="val-status-text">STANDING</span>
          </span>
        </div>

        <div class="spec-item">
          <span class="spec-label">OPERATOR</span>
          <span class="spec-val">BAY 2 - M.V.</span>
        </div>
      </div>
    </div>

    <!-- Center Floating Flight Status Tag -->
    <div class="flight-mode-tag">
      <span class="flight-mode-sub">OPERATION MODE</span>
      <span class="flight-mode-big" id="mode-title">STANDING</span>
      <span class="flight-mode-spec" id="mode-desc">CLAW L · 0% APART</span>
    </div>

    <!-- Left & Right Telemetry Panels -->
    <div class="panels-wrapper">
      <!-- Left Column -->
      <div class="panel-col-left">
        <!-- 01 GAIT -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">GAIT</span>
            <span class="card-idx">01</span>
          </div>
          <div class="metric-row">
            <div>
              <span class="metric-big" id="val-gait">0.0</span>
              <span class="metric-unit">HZ</span>
              <div style="font-size:7.5px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">STRIDE RATE</div>
            </div>
            <div style="text-align:right;">
              <span class="metric-sub" id="val-speed">0 MM/S</span>
            </div>
          </div>
          <canvas class="wave-canvas" id="gait-canvas" width="190" height="42"></canvas>
          <div class="wave-meta">
            <span>PATTERN <strong>STANCE · 8 FEET</strong></span>
            <span>DUTY <strong>100%</strong></span>
          </div>
        </div>

        <!-- 02 TAIL STRIKE -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">TAIL STRIKE</span>
            <span class="card-idx">02</span>
          </div>
          <div class="gauge-box">
            <div>
              <span class="metric-big" id="val-strike">140</span>
              <span class="metric-unit">°</span>
              <div style="font-size:7.5px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">STRIKE ANGLE</div>
            </div>
            <div class="gauge-dial">
              <div class="gauge-needle" id="strike-needle"></div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:6px; border-top:1px solid var(--border-line); font-family:'JetBrains Mono'; font-size:8px; color:var(--text-muted); text-transform:uppercase;">
            <div>VELOCITY <strong style="color:var(--text-dark);">0 °/S</strong></div>
            <div>TORQUE <strong style="color:var(--text-dark);">7.6 N·M</strong></div>
            <div>BLADE <strong style="color:var(--text-dark);" id="tag-blade">LOCKED</strong></div>
          </div>
        </div>

        <!-- 03 LEG SERVOS -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">LEG SERVOS</span>
            <span class="card-idx">03</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:7.5px; color:var(--text-muted); font-family:'JetBrains Mono'; margin-bottom:6px; text-transform:uppercase;">
            <span>LOAD PER LEG</span>
            <span>KNEE TORQUE</span>
            <span style="color:var(--accent-green); font-weight:700;">HOLDING</span>
          </div>
          <div id="arm-rows"></div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="panel-col-right">
        <!-- 04 CLAW GRIP -->
        <div class="tech-card">
          <div class="card-header">
            <span class="card-title">CLAW GRIP</span>
            <span class="card-idx">04</span>
          </div>
          <div class="metric-row">
            <div>
              <span class="metric-big" id="val-grip">52</span>
              <span class="metric-unit">N</span>
              <div style="font-size:7.5px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">GRIP FORCE</div>
            </div>
            <div style="width:80px; height:24px;">
              <canvas id="grip-canvas" width="80" height="24"></canvas>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px; font-family:'JetBrains Mono'; font-size:8.5px; margin-top:4px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">CLAW L</span>
              <span style="font-weight:700;" id="val-claw-l">15°</span>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">CLAW R</span>
              <span style="font-weight:700;" id="val-claw-r">12°</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:8px; padding-top:6px; border-top:1px solid var(--border-line); font-family:'JetBrains Mono'; font-size:8px; color:var(--text-muted); text-transform:uppercase;">
            <span>MODE <strong>HOLD</strong></span>
            <span>APERTURE <strong>12°</strong></span>
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
            <button class="pill-btn" data-assembly="claw">CLAW L</button>
            <button class="pill-btn" data-assembly="tail">TAIL</button>
            <button class="pill-btn" data-assembly="leg">LEG L2</button>
            <button class="pill-btn" data-assembly="carapace">CARAPACE</button>
            <button class="pill-btn" data-assembly="strike">STRIKE</button>
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
            <button class="pill-btn" id="btn-walk">WALK GAIT</button>
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
              <span class="subsys-name">01 SENSOR HEAD</span>
              <span class="subsys-desc">2 MEDIAN · 4 LATERAL OPTICS</span>
            </div>
            <span class="subsys-tag green" id="sub-01">TRACKING</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">02 CLAW DRIVES</span>
              <span class="subsys-desc">2 CHELAE · 4-GEAR TRAINS</span>
            </div>
            <span class="subsys-tag green" id="sub-02">LOCKED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">03 CARAPACE CORE</span>
              <span class="subsys-desc">5 PLATES · GLASS CANOPY</span>
            </div>
            <span class="subsys-tag green" id="sub-03">RIVETED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">04 TAIL ACTUATORS</span>
              <span class="subsys-desc">5 LINKS · 8 SERVOS</span>
            </div>
            <span class="subsys-tag green" id="sub-04">ARCHED</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">05 LEG SERVOS</span>
              <span class="subsys-desc">8 LEGS · 4 JOINTS</span>
            </div>
            <span class="subsys-tag green" id="sub-05">HOLDING</span>
          </div>
          <div class="subsys-item">
            <div class="subsys-left">
              <span class="subsys-name">06 STINGER</span>
              <span class="subsys-desc">BLADE LOCK · PUMP</span>
            </div>
            <span class="subsys-tag green" id="sub-06">PRIMED</span>
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
          <span>DEPLOY</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · ISOLATE CLAW L</span>
          <span>RECALL</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:4px;">
          <span id="timeline-time">00:03 / 00:26</span>
          <span>9 OPERATOR ACTIONS</span>
        </div>
      </div>
    </div>
  </div>
`;

// Populate load bar
const loadBar = document.getElementById('load-bar');
for (let i = 0; i < 20; i++) {
  const seg = document.createElement('div');
  seg.className = `lift-seg ${i < 12 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate 8 Leg Servos rows (L1..L4, R1..R4) matching docs/scorpion_f0.png
const armRowsContainer = document.getElementById('arm-rows');
const legData = [
  { id: 'L1', val: 48 },
  { id: 'L2', val: 47 },
  { id: 'L3', val: 44 },
  { id: 'L4', val: 39 },
  { id: 'R1', val: 43 },
  { id: 'R2', val: 42 },
  { id: 'R3', val: 46 },
  { id: 'R4', val: 38 }
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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4.6, 2.6, 4.4);

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

// Studio Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
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

const fillLight = new THREE.DirectionalLight(0xedf4ff, 0.9);
fillLight.position.set(-6, 3, -5);
scene.add(fillLight);

// Studio Floor Shadow Receiver
const floor = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), new THREE.ShadowMaterial({ opacity: 0.16 }));
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
[1.3, 2.2, 3.2].forEach(r => {
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
// PREMIUM STUDIO MATERIALS
// =========================================================================

const whiteShellMat = new THREE.MeshStandardMaterial({
  color: 0xfaf8f5,
  metalness: 0.08,
  roughness: 0.22
});

const orangeMat = new THREE.MeshStandardMaterial({
  color: 0xff4800,
  metalness: 0.42,
  roughness: 0.26
});

const darkMechMat = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  metalness: 0.88,
  roughness: 0.35
});

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xe6e4e0,
  metalness: 0.95,
  roughness: 0.12
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.92,
  opacity: 0.85,
  transparent: true,
  roughness: 0.08,
  thickness: 0.06,
  clearcoat: 1.0,
  side: THREE.DoubleSide
});

const lensMat = new THREE.MeshPhysicalMaterial({
  color: 0x050b16,
  metalness: 0.92,
  roughness: 0.04,
  transmission: 0.65,
  reflectivity: 0.95,
  clearcoat: 1.0
});

// =========================================================================
// 3D MODEL HIERARCHY: TELSON SC-8 (ROBOTIC SCORPION)
// =========================================================================

const scorpRoot = new THREE.Group();
scene.add(scorpRoot);

const chassisGroup = new THREE.Group();
const headGroup = new THREE.Group();
const carapaceGroup = new THREE.Group();
const clawsGroup = new THREE.Group();
const legsGroup = new THREE.Group();
const tailGroup = new THREE.Group();
const hardwareGroup = new THREE.Group();

scorpRoot.add(chassisGroup);
scorpRoot.add(headGroup);
scorpRoot.add(carapaceGroup);
scorpRoot.add(clawsGroup);
scorpRoot.add(legsGroup);
scorpRoot.add(tailGroup);
scorpRoot.add(hardwareGroup);

// --- 1. SENSOR HEAD (PROSOMA & CHELICERAE) ---
headGroup.position.set(0, 0.08, 0.62);

const headVisor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.22, 0.42), whiteShellMat);
headVisor.position.y = 0.04;
headVisor.castShadow = true;
headGroup.add(headVisor);

// 2 Median Primary Optics
[-0.08, 0.08].forEach(x => {
  const eyeRim = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.012, 10, 20), orangeMat);
  eyeRim.position.set(x, 0.08, 0.21);
  headGroup.add(eyeRim);

  const eyeGlass = new THREE.Mesh(new THREE.SphereGeometry(0.038, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  eyeGlass.rotation.x = -Math.PI / 2;
  eyeGlass.position.copy(eyeRim.position);
  headGroup.add(eyeGlass);
});

// 4 Lateral Amber Optic Sensors
[
  { x: -0.22, y: 0.05, z: 0.16 },
  { x: -0.24, y: -0.02, z: 0.1 },
  { x: 0.22, y: 0.05, z: 0.16 },
  { x: 0.24, y: -0.02, z: 0.1 }
].forEach(dot => {
  const amberDot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), orangeMat);
  amberDot.position.set(dot.x, dot.y, dot.z);
  headGroup.add(amberDot);
});

// Chelicerae (Front Mouth Pincers)
const cheliL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.1), darkMechMat);
cheliL.position.set(-0.08, -0.12, 0.24);
cheliL.rotation.set(0.4, 0, -0.15);
headGroup.add(cheliL);

const cheliR = cheliL.clone();
cheliR.position.x = 0.08;
cheliR.rotation.z = 0.15;
headGroup.add(cheliR);

// --- 2. 5-TIER DORSAL CARAPACE PLATES ---
carapaceGroup.position.set(0, 0.16, 0);

const carapacePlates = [];
for (let p = 0; p < 5; p++) {
  const plateGroup = new THREE.Group();
  plateGroup.position.set(0, (4 - p) * 0.03, 0.38 - p * 0.24);

  const width = 0.72 - p * 0.05;
  const plate = new THREE.Mesh(new THREE.BoxGeometry(width, 0.09, 0.22), whiteShellMat);
  plate.castShadow = true;
  plate.receiveShadow = true;
  plateGroup.add(plate);

  // Central spine crest ridge
  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 4), orangeMat);
  crest.rotation.x = Math.PI / 2;
  crest.position.set(0, 0.06, 0);
  plateGroup.add(crest);

  // Lateral rivet studs
  [-width * 0.42, width * 0.42].forEach(rx => {
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), darkMechMat);
    rivet.position.set(rx, 0.05, 0);
    plateGroup.add(rivet);
  });

  carapaceGroup.add(plateGroup);
  carapacePlates.push(plateGroup);
}

// Underneath Chassis Machinery (Dense Black Chassis & Manifolds)
const underChassis = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.24, 1.2), darkMechMat);
underChassis.position.set(0, -0.04, -0.1);
underChassis.castShadow = true;
chassisGroup.add(underChassis);

// Hydraulic Manifolds & Orange Wiring
for (let m = 0; m < 12; m++) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3((Math.random() - 0.5) * 0.4, -0.05, 0.4 - m * 0.08),
    new THREE.Vector3((Math.random() - 0.5) * 0.6, -0.15, 0.3 - m * 0.08),
    new THREE.Vector3((Math.random() - 0.5) * 0.4, -0.08, 0.2 - m * 0.08)
  ]);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 10, 0.012, 6, false), m % 2 === 0 ? orangeMat : darkMechMat);
  chassisGroup.add(tube);
}

// --- 3. DUAL MASSIVE HYDRAULIC CHELAE (CLAWS / PINCERS) ---
// Detailed with transparent glass canopy window showing internal orange gear trains!
function createChela(isLeft) {
  const chelaRoot = new THREE.Group();
  const dir = isLeft ? -1 : 1;
  chelaRoot.position.set(dir * 0.32, -0.02, 0.48);

  // Shoulder rotary joint
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 20), orangeMat);
  shoulder.rotation.z = Math.PI / 2;
  chelaRoot.add(shoulder);

  // Humerus Arm Strut
  const humerusGroup = new THREE.Group();
  humerusGroup.rotation.y = dir * 0.45;
  chelaRoot.add(humerusGroup);

  const humerusStrut = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.52), whiteShellMat);
  humerusStrut.position.set(dir * 0.18, 0, 0.24);
  humerusStrut.castShadow = true;
  humerusGroup.add(humerusStrut);

  // Elbow Rotary Hub
  const elbowHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 20), orangeMat);
  elbowHub.position.set(dir * 0.36, 0, 0.5);
  elbowHub.rotation.x = Math.PI / 2;
  humerusGroup.add(elbowHub);

  // Claw Forearm & Hand Pincer Pod
  const clawForearm = new THREE.Group();
  clawForearm.position.set(dir * 0.36, 0, 0.5);
  clawForearm.rotation.y = -dir * 0.7;
  humerusGroup.add(clawForearm);

  // Heavy Armored White Hand Pod
  const handPod = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.62), whiteShellMat);
  handPod.position.set(dir * 0.08, 0, 0.32);
  handPod.castShadow = true;
  clawForearm.add(handPod);

  // Transparent Glass Inspection Canopy Window on Hand Pod
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.26), glassMat);
  canopy.position.set(dir * 0.08, 0.1, 0.28);
  clawForearm.add(canopy);

  // Internal Orange Gear Train inside the Claw!
  const clawGear1 = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 16), orangeMat);
  clawGear1.position.set(dir * 0.08, 0.03, 0.22);
  clawForearm.add(clawGear1);

  const clawGear2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), darkMechMat);
  clawGear2.position.set(dir * 0.08, 0.03, 0.32);
  clawForearm.add(clawGear2);

  // Fixed Pincer Finger (Outer jaw)
  const fixedJaw = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.38, 4), darkMechMat);
  fixedJaw.rotation.x = -Math.PI / 2;
  fixedJaw.rotation.y = dir * 0.2;
  fixedJaw.position.set(dir * 0.14, 0, 0.78);
  clawForearm.add(fixedJaw);

  // Movable Thumb Pincer Jaw (Inner jaw - animates open/close!)
  const movableJaw = new THREE.Group();
  movableJaw.position.set(0, 0, 0.62);
  clawForearm.add(movableJaw);

  const movableTooth = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.36, 4), darkMechMat);
  movableTooth.rotation.x = -Math.PI / 2;
  movableTooth.rotation.y = -dir * 0.3;
  movableTooth.position.set(0, 0, 0.18);
  movableJaw.add(movableTooth);

  return { root: chelaRoot, humerus: humerusGroup, forearm: clawForearm, jaw: movableJaw, dir };
}

const clawL = createChela(true);
clawsGroup.add(clawL.root);

const clawR = createChela(false);
clawsGroup.add(clawR.root);

// --- 4. 8 ARTICULATED WALKING LEGS (OCTOPOD WALKING GAIT) ---
// Each leg: Coxa, Trochanter, Orange Knee Hub, Femur, Ankle, and Needle Stilt Foot
const legs = [];
const legConfigs = [
  { id: 'L1', side: -1, z: 0.38, spreadY: 0.55,  femurLen: 0.68, tibLen: 0.88 },
  { id: 'L2', side: -1, z: 0.12, spreadY: 0.18,  femurLen: 0.76, tibLen: 0.94 },
  { id: 'L3', side: -1, z: -0.14, spreadY: -0.18, femurLen: 0.76, tibLen: 0.94 },
  { id: 'L4', side: -1, z: -0.4,  spreadY: -0.55, femurLen: 0.68, tibLen: 0.88 },
  { id: 'R1', side: 1,  z: 0.38, spreadY: -0.55, femurLen: 0.68, tibLen: 0.88 },
  { id: 'R2', side: 1,  z: 0.12, spreadY: -0.18, femurLen: 0.76, tibLen: 0.94 },
  { id: 'R3', side: 1,  z: -0.14, spreadY: 0.18,  femurLen: 0.76, tibLen: 0.94 },
  { id: 'R4', side: 1,  z: -0.4,  spreadY: 0.55,  femurLen: 0.68, tibLen: 0.88 }
];

legConfigs.forEach((cfg, idx) => {
  const legRoot = new THREE.Group();
  legRoot.position.set(cfg.side * 0.36, -0.06, cfg.z);
  legRoot.rotation.y = cfg.spreadY;
  legsGroup.add(legRoot);

  // Coxa Socket
  const coxa = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), darkMechMat);
  coxa.rotation.z = Math.PI / 2;
  legRoot.add(coxa);

  // Trochanter Arm (Angles upward and outward)
  const trochanter = new THREE.Group();
  trochanter.rotation.z = -cfg.side * 0.85;
  legRoot.add(trochanter);

  const trochanterStrut = new THREE.Mesh(new THREE.BoxGeometry(0.09, cfg.femurLen, 0.08), whiteShellMat);
  trochanterStrut.position.y = cfg.femurLen / 2;
  trochanterStrut.castShadow = true;
  trochanter.add(trochanterStrut);

  // Prominent Orange Knee Hub with Concentric Bolts (Matching docs/scorpion.gif!)
  const kneeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.1, 24), orangeMat);
  kneeHub.position.y = cfg.femurLen;
  kneeHub.rotation.x = Math.PI / 2;
  trochanter.add(kneeHub);

  const kneeCenterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.11, 16), darkMechMat);
  kneeCenterCap.position.copy(kneeHub.position);
  kneeCenterCap.rotation.copy(kneeHub.rotation);
  trochanter.add(kneeCenterCap);

  // Femur/Tibia Lower Leg (Angles sharply down to floor)
  const tibia = new THREE.Group();
  tibia.position.set(0, cfg.femurLen, 0);
  tibia.rotation.z = cfg.side * 1.62;
  trochanter.add(tibia);

  const tibiaStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.038, cfg.tibLen, 14), whiteShellMat);
  tibiaStrut.position.y = cfg.tibLen / 2;
  tibiaStrut.castShadow = true;
  tibia.add(tibiaStrut);

  // Ankle Rotary Joint
  const ankleJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 14), orangeMat);
  ankleJoint.position.y = cfg.tibLen;
  ankleJoint.rotation.x = Math.PI / 2;
  tibia.add(ankleJoint);

  // Sharp Needle Stilt Foot Point with Rubber Damper
  const stiltFoot = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.22, 12), darkMechMat);
  stiltFoot.position.y = cfg.tibLen + 0.11;
  tibia.add(stiltFoot);

  legs.push({
    id: cfg.id,
    root: legRoot,
    trochanter,
    tibia,
    side: cfg.side,
    gaitPhase: (idx % 2 === 0 ? 0 : Math.PI) + (idx >= 4 ? 0.6 : 0)
  });
});

// --- 5. 5-LINK ARCHED HYDRAULIC STINGER TAIL (STRIKE KINEMATICS!) ---
tailGroup.position.set(0, 0.14, -0.62);

const tailSegments = [];
const numTailLinks = 5;
let prevTailParent = tailGroup;

for (let t = 0; t < numTailLinks; t++) {
  const linkGroup = new THREE.Group();
  const linkLen = 0.42 * Math.pow(0.94, t);
  linkGroup.position.z = t === 0 ? 0 : -linkLen;

  // Initial resting arch: curves upward and forward over the body!
  linkGroup.rotation.x = 0.42;

  // White Box Armor Link
  const linkMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34 * Math.pow(0.92, t), 0.26 * Math.pow(0.92, t), linkLen), whiteShellMat);
  linkMesh.position.z = -linkLen / 2;
  linkMesh.castShadow = true;
  linkGroup.add(linkMesh);

  // Lateral Double Orange Rotary Discs on both sides of each link!
  [-1, 1].forEach(side => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20), orangeMat);
    disc.position.set(side * 0.18 * Math.pow(0.92, t), 0, -linkLen / 2);
    disc.rotation.z = Math.PI / 2;
    linkGroup.add(disc);

    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 14), darkMechMat);
    axle.position.copy(disc.position);
    axle.rotation.copy(disc.rotation);
    linkGroup.add(axle);
  });

  prevTailParent.add(linkGroup);
  tailSegments.push(linkGroup);
  prevTailParent = linkGroup;
}

// Terminal Telson Venom Bulb & Curved Stinger Blade
const telsonBulb = new THREE.Group();
telsonBulb.position.set(0, 0, -0.38);
prevTailParent.add(telsonBulb);

const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 20), whiteShellMat);
bulbMesh.scale.set(0.9, 0.9, 1.4);
bulbMesh.castShadow = true;
telsonBulb.add(bulbMesh);

const bulbOrangeBand = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.02, 12, 28), orangeMat);
telsonBulb.add(bulbOrangeBand);

// Sharp Curved Stinger Blade (Black titanium with orange heated cutting spur)
const stingerCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, -0.2),
  new THREE.Vector3(0, 0.12, -0.42),
  new THREE.Vector3(0, 0.38, -0.58)
]);
const stingerBlade = new THREE.Mesh(new THREE.TubeGeometry(stingerCurve, 20, 0.025, 8, false), darkMechMat);
telsonBulb.add(stingerBlade);

const stingerSpur = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.16, 12), orangeMat);
stingerSpur.position.set(0, 0.38, -0.58);
stingerSpur.rotation.x = 0.6;
telsonBulb.add(stingerSpur);

// =========================================================================
// CALLOUT LABELS & LEADER LINES
// =========================================================================

const calloutDefs = [
  { id: 'sensor_head', text: 'SENSOR HEAD', sub: '2 MEDIAN · 4 LATERAL OPTICS', getPos: () => headGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0.2)) },
  { id: 'claw_drives', text: 'CLAW DRIVES', sub: '2 CHELAE · 4-GEAR TRAINS', getPos: () => clawL.forearm.getWorldPosition(new THREE.Vector3()) },
  { id: 'carapace', text: 'CARAPACE CORE', sub: '5 PLATES · GLASS CANOPY', getPos: () => carapacePlates[2].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)) },
  { id: 'tail_act', text: 'TAIL ACTUATORS', sub: '5 LINKS · 8 SERVOS', getPos: () => tailSegments[2].getWorldPosition(new THREE.Vector3()) },
  { id: 'stinger', text: 'STINGER BLADE', sub: 'HIGH-VELOCITY HYDRAULIC SPUR', getPos: () => telsonBulb.getWorldPosition(new THREE.Vector3()) },
  { id: 'leg_servos', text: 'OCTOPOD GAIT', sub: '8 LEGS · 4 JOINTS', getPos: () => legs[1].root.getWorldPosition(new THREE.Vector3()) }
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
let isWalking = false;
let isStriking = false;
let strikeProgress = 0;

let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, 0, 0);
let currentLookAt = new THREE.Vector3(0, 0, 0);
let spherical = new THREE.Spherical(5.6, Math.PI / 2.7, 0.85);

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
  spherical.radius = Math.max(2.2, Math.min(9.5, spherical.radius + e.deltaY * 0.004));
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
    titleEl.textContent = 'STANDING';
    descEl.textContent = 'CLAW L · 0% APART';
    statusText.textContent = 'STANDING';
    statusBadge.className = 'status-badge';
    spherical.radius = 5.6;
    spherical.phi = Math.PI / 2.7;
    camLookAt.set(0, 0, 0);
    isStriking = false;
  } else if (mode === 'claw') {
    titleEl.textContent = 'CLAW DRIVES';
    descEl.textContent = 'CHELAE · 4-GEAR TRAINS';
    statusText.textContent = 'CLAW L';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 2.6;
    camLookAt.set(-0.65, 0, 0.65);
    isStriking = false;
  } else if (mode === 'tail') {
    titleEl.textContent = 'TAIL ACTUATORS';
    descEl.textContent = '5 LINKS · 8 SERVOS';
    statusText.textContent = 'TAIL';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.6;
    spherical.phi = Math.PI / 3.0;
    camLookAt.set(0, 0.6, -0.4);
    isStriking = false;
  } else if (mode === 'leg') {
    titleEl.textContent = 'LEG SERVOS';
    descEl.textContent = 'OCTOPOD WAVE GAIT';
    statusText.textContent = 'LEG L2';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.8;
    spherical.phi = Math.PI / 2.2;
    camLookAt.set(-0.45, -0.2, 0.1);
    isStriking = false;
  } else if (mode === 'carapace') {
    titleEl.textContent = 'CARAPACE CORE';
    descEl.textContent = '5 PLATES · RIVETED';
    statusText.textContent = 'CARAPACE';
    statusBadge.className = 'status-badge';
    spherical.radius = 3.2;
    spherical.phi = Math.PI / 3.2;
    camLookAt.set(0, 0.2, 0);
    isStriking = false;
  } else if (mode === 'strike') {
    titleEl.textContent = 'TAIL STRIKE';
    descEl.textContent = 'HIGH-SPEED SNAP · 140°';
    statusText.textContent = 'STRIKE';
    statusBadge.className = 'status-badge orange';
    document.getElementById('tag-blade').textContent = 'ACTIVE';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · TAIL STRIKE';
    spherical.radius = 4.8;
    spherical.phi = Math.PI / 2.8;
    camLookAt.set(0, 0.3, 0.2);
    isStriking = true;
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
    document.getElementById('mode-title').textContent = 'TEARDOWN';
    document.getElementById('mode-desc').textContent = 'TURNTABLE · 100% APART';
    document.getElementById('val-status-text').textContent = 'TEARDOWN';
    document.getElementById('val-status').className = 'status-badge orange';
  } else {
    setAssemblyMode(currentAssembly);
  }
});

const btnWalk = document.getElementById('btn-walk');
btnWalk.addEventListener('click', () => {
  isWalking = !isWalking;
  btnWalk.classList.toggle('active', isWalking);
  document.getElementById('val-gait').textContent = isWalking ? '1.2' : '0.0';
  document.getElementById('val-speed').textContent = isWalking ? '48 MM/S' : '0 MM/S';
});

const btnTurntable = document.getElementById('btn-turntable');
btnTurntable.addEventListener('click', () => {
  isTurntable = !isTurntable;
  btnTurntable.classList.toggle('active', isTurntable);
});

const btnPlay = document.getElementById('btn-play');
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  document.getElementById('play-icon').innerHTML = isPlaying ?
    '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' :
    '<path d="M8 5v14l11-7z"/>';
});

// Gait Wave Canvas
const gaitCanvas = document.getElementById('gait-canvas');
const gaitCtx = gaitCanvas.getContext('2d');
let gaitOffset = 0;

function drawGaitWave(time) {
  gaitCtx.clearRect(0, 0, gaitCanvas.width, gaitCanvas.height);

  // Draw 8-leg step stance bars matching docs/scorpion_f0.png!
  const w = gaitCanvas.width;
  const h = gaitCanvas.height;
  const barH = 3;

  for (let l = 0; l < 8; l++) {
    const y = 3 + l * 4.8;
    gaitCtx.fillStyle = '#e8e4dc';
    gaitCtx.fillRect(0, y, w, barH);

    // Stride bars
    for (let b = 0; b < 6; b++) {
      const bx = ((b * 32 + (isWalking ? gaitOffset * 18 : 0) + (l % 2 === 0 ? 0 : 16)) % w);
      gaitCtx.fillStyle = '#ff4800';
      gaitCtx.fillRect(bx, y, 14, barH);
    }
  }
}

// Claw Grip Canvas
const gripCanvas = document.getElementById('grip-canvas');
const gripCtx = gripCanvas.getContext('2d');

function drawGripGraph(time) {
  gripCtx.clearRect(0, 0, gripCanvas.width, gripCanvas.height);
  gripCtx.strokeStyle = '#ff4800';
  gripCtx.lineWidth = 1.5;
  gripCtx.beginPath();
  const w = gripCanvas.width;
  const h = gripCanvas.height;
  for (let x = 0; x < w; x++) {
    const y = h - 4 - Math.sin((x * 0.1) + time * 3) * 8;
    if (x === 0) gripCtx.moveTo(x, y);
    else gripCtx.lineTo(x, y);
  }
  gripCtx.stroke();
}

// =========================================================================
// MAIN ANIMATION LOOP & KINEMATICS
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 3;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    gaitOffset += delta * 2.5;
    elapsedSimTime += delta;
    if (isTurntable) {
      spherical.theta += delta * 0.32;
    }
  }

  // Camera lerp
  const targetCamPos = new THREE.Vector3().setFromSpherical(spherical).add(camLookAt);
  camera.position.lerp(targetCamPos, 0.08);
  currentLookAt.lerp(camLookAt, 0.08);
  camera.lookAt(currentLookAt);

  // Exploded interpolation
  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // 1. CARAPACE & CHASSIS EXPLODED DISPLACEMENTS
  carapacePlates.forEach((plate, idx) => {
    plate.position.y = (4 - idx) * 0.03 + explodedFactor * (0.35 + idx * 0.1);
  });
  headGroup.position.set(0, 0.08 + explodedFactor * 0.25, 0.62 + explodedFactor * 0.55);
  clawsGroup.position.set(0, -explodedFactor * 0.15, explodedFactor * 0.35);

  // 2. CLAW PINCERS GRIP ANIMATION
  const gripAngle = 0.12 + (isPlaying ? Math.sin(time * 3.5) * 0.1 : 0);
  clawL.jaw.rotation.y = clawL.dir * gripAngle;
  clawR.jaw.rotation.y = clawR.dir * gripAngle;

  // Update Claw Grip UI
  const gripN = (19 + Math.abs(Math.sin(time * 3.5)) * 33).toFixed(0);
  const gripEl = document.getElementById('val-grip');
  if (gripEl) gripEl.textContent = gripN;

  // 3. 8-LEGGED OCTOPOD WALKING GAIT
  legs.forEach(leg => {
    if (isWalking && isPlaying) {
      const phase = gaitOffset * Math.PI * 2 + leg.gaitPhase;
      const stepLift = Math.max(0, Math.sin(phase)) * 0.15;
      const stepSwing = Math.cos(phase) * 0.18;

      leg.root.position.y = -0.06 + stepLift;
      leg.root.rotation.y = leg.root.rotation.y + stepSwing * 0.05;
      leg.trochanter.rotation.z = -leg.side * (0.85 + stepLift * 0.6);
      leg.tibia.rotation.z = leg.side * (1.62 - stepLift * 0.8);
    } else {
      leg.root.position.y = -0.06 - explodedFactor * 0.25;
      leg.root.position.x = leg.side * (0.36 + explodedFactor * 0.45);
    }
  });

  // 4. TAIL ARCH & HIGH-SPEED STRIKE KINEMATICS
  if (isStriking && isPlaying) {
    strikeProgress += delta * 4.5;
    const snap = Math.sin(strikeProgress);
    const strikeArch = 0.42 + Math.max(0, snap) * 0.55;

    tailSegments.forEach(seg => {
      seg.rotation.x = strikeArch;
    });

    const strikeDeg = Math.floor(100 + Math.max(0, snap) * 40);
    document.getElementById('val-strike').textContent = String(strikeDeg);
    const needle = document.getElementById('strike-needle');
    if (needle) needle.style.transform = `rotate(${strikeDeg}deg)`;
  } else {
    tailSegments.forEach((seg, idx) => {
      seg.rotation.x = 0.42 + explodedFactor * (0.15 + idx * 0.08);
      seg.position.z = -0.42 * (1 + explodedFactor * 0.65);
    });
  }

  // UI & HUD Updates
  renderScreenLabels();
  drawGaitWave(time);
  drawGripGraph(time);
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

  domLabels.forEach(({ def, el }) => {
    const pos3D = def.getPos();
    const p = pos3D.clone().project(camera);

    if (p.z > 1.0) {
      el.style.opacity = '0';
      return;
    }

    const sx = (p.x * 0.5 + 0.5) * w;
    const sy = (-p.y * 0.5 + 0.5) * h;

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
  document.getElementById('timeline-time').textContent = `00:${s} / 00:26`;
}

requestAnimationFrame(animate);
