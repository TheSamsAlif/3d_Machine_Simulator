import * as THREE from 'three';

// =========================================================================
// TELSON SC-8 · ROBOTIC SCORPION ARMOURED GROUND UNIT
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

  /* Gait Stance Canvas */
  .wave-canvas { width: 100%; height: 38px; border-bottom: 1px solid var(--border-line); margin-bottom: 4px; display: block; }
  .wave-meta { display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 7.5px; color: var(--text-muted); }

  /* Speedometer Gauge */
  .gauge-box { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .gauge-dial { width: 62px; height: 32px; border-top-left-radius: 36px; border-top-right-radius: 36px; border: 3px solid #e8e4dc; border-bottom: none; position: relative; overflow: hidden; }
  .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 24px; height: 2px; background: var(--accent-orange); transform-origin: left center; transform: rotate(45deg); transition: transform 0.2s ease; }

  /* Leg Servo Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; margin-bottom: 3.5px; }
  .servo-name { width: 20px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 6px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--text-dark); transition: width 0.3s ease; }
  .servo-val { width: 40px; text-align: right; font-weight: 600; color: var(--text-dark); }

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
  .gait-mode-tag { position: absolute; left: 280px; bottom: 84px; display: flex; flex-direction: column; pointer-events: none; }
  .gait-mode-sub { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
  .gait-mode-big { font-size: 26px; font-weight: 800; color: var(--accent-orange); letter-spacing: -0.5px; line-height: 1.1; }
  .gait-mode-spec { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); text-transform: uppercase; margin-top: 2px; letter-spacing: 0.5px; }

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
  .timeline-progress { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent-orange); border-radius: 2px; width: 34%; }
  .timeline-thumb { position: absolute; left: 34%; top: 50%; width: 11px; height: 11px; background: #fff; border: 2.5px solid var(--accent-orange); border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
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
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          SC-8
        </div>
        <div class="title-block">
          <div class="title-tag">OCTOPOD GROUND UNIT · FIELD WALKER</div>
          <div class="title-main">Telson SC-8<span>/</span></div>
          <div class="title-sub">BIONIC SCORPION · 8-LEGGED GAIT</div>
        </div>
      </div>

      <!-- Top Center Specs -->
      <div class="top-center">
        <div class="spec-item">
          <span class="spec-label">RUNTIME</span>
          <span class="spec-val" id="val-runtime">00:03:26</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">GROUND SPEED</span>
          <span class="spec-val">0.42 M/S</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">CHASSIS TORQUE</span>
          <div class="lift-load-bar" id="load-bar"></div>
        </div>
        <div class="spec-item">
          <span class="spec-label">STATUS</span>
          <span class="status-badge" id="val-status"><span class="status-dot"></span> <span id="val-status-text">STANDING</span></span>
        </div>
      </div>

      <!-- Assembly Selector -->
      <div style="display:flex; gap:4px; background:var(--panel-bg); border:1px solid var(--border-line); border-radius:6px; padding:4px;">
        <button class="pill-btn active" data-assembly="hero">HERO</button>
        <button class="pill-btn" data-assembly="strike">STRIKE</button>
        <button class="pill-btn" data-assembly="carapace">CARAPACE</button>
        <button class="pill-btn" data-assembly="clawl">CLAW L</button>
        <button class="pill-btn" data-assembly="legs">LEGS</button>
        <button class="pill-btn" data-assembly="stinger">STINGER</button>
      </div>
    </div>

    <!-- Operating Mode Overlay -->
    <div class="gait-mode-tag">
      <span class="gait-mode-sub">OPERATION MODE</span>
      <span class="gait-mode-big" id="mode-title">STANDING</span>
      <span class="gait-mode-spec" id="mode-desc">TRIPOD GAIT · HOLDING ZERO</span>
    </div>

    <!-- Left Column -->
    <div class="panel-col-left">
      <!-- 01 GAIT -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">GAIT WAVE</span>
          <span class="card-idx">01</span>
        </div>
        <div class="metric-row">
          <div>
            <span class="metric-big">1.4</span>
            <span class="metric-unit">HZ</span>
          </div>
          <span class="metric-sub">OCTOPOD</span>
        </div>
        <canvas class="wave-canvas" id="gait-canvas" width="200" height="38"></canvas>
        <div class="wave-meta">
          <span>DUTY CYCLE 65%</span>
          <span>CREEP GAIT</span>
          <span>SYNC</span>
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
            <span class="metric-big">82</span>
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
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg"></div>
          </div>
        </div>
        <div class="power-stats">
          <div>
            <div class="power-sub">DRAW</div>
            <div class="power-val">18.6 W</div>
          </div>
          <div>
            <div class="power-sub">CELL</div>
            <div class="power-val">3.82 V</div>
          </div>
          <div>
            <div class="power-sub">TEMP</div>
            <div class="power-val">28 °C</div>
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
          <span style="color:var(--accent-green); font-weight:700;">HOLDING</span>
        </div>
        <div id="arm-rows"></div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="panel-col-right">
      <!-- 04 STRIKE -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">STRIKE</span>
          <span class="card-idx">04</span>
        </div>
        <div class="gauge-box">
          <div>
            <span class="metric-big" id="val-strike-speed">0.0</span>
            <span class="metric-unit">M/S</span>
            <div style="font-size:7px; color:var(--text-muted); text-transform:uppercase; font-family:'JetBrains Mono';">VELOCITY</div>
          </div>
          <div class="gauge-dial">
            <div class="gauge-needle" id="gauge-needle"></div>
          </div>
        </div>
      </div>

      <!-- 05 HYDRAULICS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">HYDRAULICS</span>
          <span class="card-idx">05</span>
        </div>
        <div class="metric-row">
          <div>
            <span class="metric-big" id="val-hydr">24</span>
            <span class="metric-unit">BAR</span>
          </div>
          <span class="metric-sub" style="color:var(--accent-green);">NOMINAL</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-family:'JetBrains Mono'; color:var(--text-muted); margin-top:2px;">
          <span>CHELA CLAMP</span>
          <span style="font-weight:700; color:var(--text-dark);">320 N</span>
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
          <button class="pill-btn" id="btn-walk">WALK GAIT</button>
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
            <span class="subsys-name">01 SENSOR HEAD</span>
            <span class="subsys-desc">TWIN 52MM OPTICS · MANDIBLES</span>
          </div>
          <span class="subsys-tag green">TRACKING</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">02 DORSAL CARAPACE</span>
            <span class="subsys-desc">5-TIER ARMOR PLATES</span>
          </div>
          <span class="subsys-tag green">LOCKED</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">03 CHELAE CLAWS</span>
            <span class="subsys-desc">GLASS CANOPY · GEAR TRAIN</span>
          </div>
          <span class="subsys-tag green">READY</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">04 OCTOPOD LEGS</span>
            <span class="subsys-desc">8 LEGS · ORANGE KNEE HUBS</span>
          </div>
          <span class="subsys-tag green">STABLE</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">05 STINGER TAIL</span>
            <span class="subsys-desc">5 VERTEBRAE · HYDRAULIC VENOM</span>
          </div>
          <span class="subsys-tag green">PRIMED</span>
        </div>
        <div class="subsys-item">
          <div class="subsys-left">
            <span class="subsys-name">06 HYDRAULIC CORE</span>
            <span class="subsys-desc">TITANIUM CHASSIS FRAME</span>
          </div>
          <span class="subsys-tag green">ACTIVE</span>
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
          <span>DEPLOY</span>
          <span style="color:var(--accent-orange); font-weight:700;" id="timeline-operator-text">OPERATOR · ISOLATE CLAW L</span>
          <span>RECALL</span>
          <span class="card-idx">08</span>
        </div>
        <div class="timeline-track" id="timeline-track">
          <div class="timeline-progress" id="timeline-progress"></div>
          <div class="timeline-thumb" id="timeline-thumb"></div>
        </div>
        <div class="timeline-meta" style="margin-top:3px;">
          <span id="timeline-time">00:09 / 00:26</span>
          <span>9 OPERATOR ACTIONS</span>
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
  seg.className = `lift-seg ${i < 11 ? 'fill' : ''}`;
  loadBar.appendChild(seg);
}

// Populate Leg Servos rows (L1..L4, R1..R4)
const armRowsContainer = document.getElementById('arm-rows');
const legData = [
  { id: 'L1', val: 48 },
  { id: 'L2', val: 47 },
  { id: 'L3', val: 44 },
  { id: 'L4', val: 39 },
  { id: 'R1', val: 43 },
  { id: 'R2', val: 42 },
  { id: 'R3', val: 46 },
  { id: 'R4', val: 41 }
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
labelsCanvas.width = W;
labelsCanvas.height = H;
const labelsCtx = labelsCanvas.getContext('2d');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf6f4f0);

const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
camera.position.set(4.6, 2.5, 4.4);

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

const mainKeyLight = new THREE.DirectionalLight(0xfffbf5, 2.7);
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
  const toothH = radius * 0.14;
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

scorpRoot.add(chassisGroup);
scorpRoot.add(headGroup);
scorpRoot.add(carapaceGroup);
scorpRoot.add(clawsGroup);
scorpRoot.add(legsGroup);
scorpRoot.add(tailGroup);

// --- 1. SENSOR HEAD (PROSOMA & CHELICERAE) ---
headGroup.position.set(0, 0.08, 0.62);

// Sculpted visor with beveled front prow
const headVisorGroup = new THREE.Group();
headGroup.add(headVisorGroup);

const headMain = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.18, 6), whiteShellMat);
headMain.rotation.y = Math.PI / 6;
headMain.position.set(0, 0.04, 0.02);
headMain.castShadow = true;
headVisorGroup.add(headMain);

const headBevelNose = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.22, 4), whiteShellMat);
headBevelNose.rotation.x = -Math.PI / 2;
headBevelNose.position.set(0, 0.02, 0.22);
headBevelNose.castShadow = true;
headVisorGroup.add(headBevelNose);

// 2 Median Primary Optics with Knurled Orange Bezels
[-0.09, 0.09].forEach(x => {
  const eyeTurret = new THREE.Group();
  eyeTurret.position.set(x, 0.08, 0.18);
  headGroup.add(eyeTurret);

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 10, 24), orangeMat);
  eyeTurret.add(bezel);

  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.03, 18), darkMechMat);
  barrel.rotation.x = Math.PI / 2;
  eyeTurret.add(barrel);

  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.036, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), lensMat);
  glass.rotation.x = -Math.PI / 2;
  glass.position.z = 0.015;
  eyeTurret.add(glass);
});

// 4 Lateral Amber Micro-Sensors
[
  { x: -0.22, y: 0.05, z: 0.12 },
  { x: -0.24, y: -0.01, z: 0.06 },
  { x: 0.22, y: 0.05, z: 0.12 },
  { x: 0.24, y: -0.01, z: 0.06 }
].forEach(dot => {
  const amberDot = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), orangeMat);
  amberDot.position.set(dot.x, dot.y, dot.z);
  headGroup.add(amberDot);
});

// Chelicerae (Front Mouth Pincer Mandibles)
const cheliGroupL = new THREE.Group();
cheliGroupL.position.set(-0.08, -0.08, 0.22);
headGroup.add(cheliGroupL);

const cheliToothL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), darkMechMat);
cheliToothL.rotation.x = Math.PI * 0.65;
cheliToothL.rotation.y = -0.2;
cheliGroupL.add(cheliToothL);

const cheliGroupR = new THREE.Group();
cheliGroupR.position.set(0.08, -0.08, 0.22);
headGroup.add(cheliGroupR);

const cheliToothR = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), darkMechMat);
cheliToothR.rotation.x = Math.PI * 0.65;
cheliToothR.rotation.y = 0.2;
cheliGroupR.add(cheliToothR);

// --- 2. 5-TIER DORSAL CARAPACE PLATES ---
carapaceGroup.position.set(0, 0.16, 0);

const carapacePlates = [];
for (let p = 0; p < 5; p++) {
  const plateGroup = new THREE.Group();
  plateGroup.position.set(0, (4 - p) * 0.03, 0.38 - p * 0.24);

  const width = 0.74 - p * 0.06;
  const plateLen = 0.24;
  
  // Arched, beveled carapace segment
  const plateMesh = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.45, width * 0.52, plateLen, 16, 1, false, -Math.PI * 0.45, Math.PI * 0.9), whiteShellMat);
  plateMesh.rotation.z = Math.PI / 2;
  plateMesh.rotation.y = Math.PI / 2;
  plateMesh.castShadow = true;
  plateMesh.receiveShadow = true;
  plateGroup.add(plateMesh);

  // Central spine crest ridge
  const crest = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.22, 4), orangeMat);
  crest.rotation.x = Math.PI / 2;
  crest.position.set(0, 0.07, 0);
  plateGroup.add(crest);

  // Lateral rivet studs
  [-width * 0.42, width * 0.42].forEach(rx => {
    const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), darkMechMat);
    rivet.position.set(rx, 0.04, 0);
    plateGroup.add(rivet);
  });

  carapaceGroup.add(plateGroup);
  carapacePlates.push(plateGroup);
}

// Underneath Chassis Machinery (Dense Black Chassis & Manifolds)
const underChassis = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 1.25, 18), darkMechMat);
underChassis.rotation.x = Math.PI / 2;
underChassis.position.set(0, -0.04, -0.1);
underChassis.castShadow = true;
chassisGroup.add(underChassis);

// Hydraulic Manifolds & Orange Wiring
for (let m = 0; m < 16; m++) {
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
  chelaRoot.position.set(dir * 0.34, -0.02, 0.48);

  // Shoulder rotary joint
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.14, 20), orangeMat);
  shoulder.rotation.z = Math.PI / 2;
  chelaRoot.add(shoulder);

  // Humerus Arm Strut with hydraulic cylinder
  const humerusGroup = new THREE.Group();
  humerusGroup.rotation.y = dir * 0.45;
  chelaRoot.add(humerusGroup);

  const humerusStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.54, 18), whiteShellMat);
  humerusStrut.rotation.x = Math.PI / 2;
  humerusStrut.position.set(dir * 0.16, 0, 0.24);
  humerusStrut.castShadow = true;
  humerusGroup.add(humerusStrut);

  const humerusHydr = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.36, 12), chromeMat);
  humerusHydr.rotation.x = Math.PI / 2;
  humerusHydr.position.set(dir * 0.16, 0.06, 0.24);
  humerusGroup.add(humerusHydr);

  // Elbow Rotary Hub
  const elbowHub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.14, 24), orangeMat);
  elbowHub.position.set(dir * 0.32, 0, 0.5);
  elbowHub.rotation.x = Math.PI / 2;
  humerusGroup.add(elbowHub);

  // Claw Forearm & Hand Pincer Pod
  const clawForearm = new THREE.Group();
  clawForearm.position.set(dir * 0.32, 0, 0.5);
  clawForearm.rotation.y = -dir * 0.72;
  humerusGroup.add(clawForearm);

  // Heavy Armored White Hand Pod (Lofted bevel cylinder)
  const handPod = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.64, 20), whiteShellMat);
  handPod.rotation.x = Math.PI / 2;
  handPod.position.set(dir * 0.08, 0, 0.32);
  handPod.castShadow = true;
  clawForearm.add(handPod);

  // Transparent Curved Glass Inspection Canopy Window on Hand Pod
  const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.175, 0.28, 16, 1, false, -Math.PI * 0.35, Math.PI * 0.7), glassMat);
  canopy.rotation.x = Math.PI / 2;
  canopy.rotation.y = Math.PI / 2;
  canopy.position.set(dir * 0.08, 0.06, 0.28);
  clawForearm.add(canopy);

  // Internal Orange Gear Train inside the Claw!
  const clawGear1 = makeGearDisc(0.075, 0.03, 16, orangeMat, 0.02);
  clawGear1.position.set(dir * 0.08, 0.02, 0.22);
  clawForearm.add(clawGear1);

  const clawGear2 = makeGearDisc(0.055, 0.03, 12, darkMechMat, 0.015);
  clawGear2.position.set(dir * 0.08, 0.02, 0.32);
  clawForearm.add(clawGear2);

  // Fixed Pincer Finger (Outer jaw) with gripping teeth
  const fixedJaw = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.42, 6), darkMechMat);
  fixedJaw.rotation.x = -Math.PI / 2;
  fixedJaw.rotation.y = dir * 0.15;
  fixedJaw.position.set(dir * 0.14, 0, 0.8);
  clawForearm.add(fixedJaw);

  // Movable Thumb Pincer Jaw (Inner jaw - animates open/close!)
  const movableJaw = new THREE.Group();
  movableJaw.position.set(0, 0, 0.62);
  clawForearm.add(movableJaw);

  const movableTooth = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.4, 6), darkMechMat);
  movableTooth.rotation.x = -Math.PI / 2;
  movableTooth.rotation.y = -dir * 0.32;
  movableTooth.position.set(0, 0, 0.2);
  movableJaw.add(movableTooth);

  return { root: chelaRoot, humerus: humerusGroup, forearm: clawForearm, jaw: movableJaw, dir };
}

const clawL = createChela(true);
clawsGroup.add(clawL.root);

const clawR = createChela(false);
clawsGroup.add(clawR.root);

// --- 4. 8 ARTICULATED WALKING LEGS (OCTOPOD WALKING GAIT) ---
// Each leg: Coxa, Trochanter, Prominent Orange Knee Hub, Femur, Tibia, and Stilt Foot
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
  const coxa = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.12, 18), darkMechMat);
  coxa.rotation.z = Math.PI / 2;
  legRoot.add(coxa);

  // Trochanter Arm (Angles upward and outward)
  const trochanter = new THREE.Group();
  trochanter.rotation.z = -cfg.side * 0.85;
  legRoot.add(trochanter);

  const trochanterStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, cfg.femurLen, 16), whiteShellMat);
  trochanterStrut.position.y = cfg.femurLen / 2;
  trochanterStrut.castShadow = true;
  trochanter.add(trochanterStrut);

  // Prominent Orange Knee Hub with Concentric Bolts (Matching docs/scorpion.gif!)
  const kneeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.1, 24), orangeMat);
  kneeHub.position.y = cfg.femurLen;
  kneeHub.rotation.x = Math.PI / 2;
  trochanter.add(kneeHub);

  const kneeCenterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.11, 16), darkMechMat);
  kneeCenterCap.position.copy(kneeHub.position);
  kneeCenterCap.rotation.copy(kneeHub.rotation);
  trochanter.add(kneeCenterCap);

  // Femur/Tibia Lower Leg (Angles sharply down to floor)
  const tibia = new THREE.Group();
  tibia.position.set(0, cfg.femurLen, 0);
  tibia.rotation.z = cfg.side * 1.62;
  trochanter.add(tibia);

  const tibiaStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.04, cfg.tibLen, 16), whiteShellMat);
  tibiaStrut.position.y = cfg.tibLen / 2;
  tibiaStrut.castShadow = true;
  tibia.add(tibiaStrut);

  // Ankle Rotary Joint
  const ankleJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.06, 14), orangeMat);
  ankleJoint.position.y = cfg.tibLen;
  ankleJoint.rotation.x = Math.PI / 2;
  tibia.add(ankleJoint);

  // Sharp Needle Stilt Foot Point with Rubber Damper
  const stiltFoot = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.22, 14), darkMechMat);
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

  const radius = 0.14 * Math.pow(0.92, t);

  // Curved segmented white body shell with bevel
  const segMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius, linkLen, 18), whiteShellMat);
  segMesh.rotation.x = Math.PI / 2;
  segMesh.position.z = -linkLen / 2;
  segMesh.castShadow = true;
  linkGroup.add(segMesh);

  // Lateral Dual Orange Rotary Actuator Discs
  [-radius * 1.05, radius * 1.05].forEach(x => {
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, 0.04, 18), orangeMat);
    disc.position.set(x, 0, 0);
    disc.rotation.z = Math.PI / 2;
    linkGroup.add(disc);

    const pin = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, 0.05, 12), chromeMat);
    pin.position.copy(disc.position);
    pin.rotation.copy(disc.rotation);
    linkGroup.add(pin);
  });

  prevTailParent.add(linkGroup);
  tailSegments.push({ group: linkGroup, len: linkLen });
  prevTailParent = linkGroup;
}

// Stinger Terminal Head Unit
const stingerHead = new THREE.Group();
stingerHead.position.z = -0.38;
prevTailParent.add(stingerHead);

// Teardrop Venom Bulb with Glass Inspection Reservoir Window
const bulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 20), whiteShellMat);
bulbMesh.scale.set(0.9, 1.3, 0.9);
bulbMesh.castShadow = true;
stingerHead.add(bulbMesh);

const venomGlass = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), glassMat);
venomGlass.scale.set(0.92, 1.25, 0.92);
stingerHead.add(venomGlass);

const venomLiquid = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), orangeMat);
stingerHead.add(venomLiquid);

// Chrome Stinger Curved Needle Blade
const stingerBlade = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.38, 16), chromeMat);
stingerBlade.rotation.x = Math.PI * 0.8;
stingerBlade.position.set(0, 0.16, -0.18);
stingerBlade.castShadow = true;
stingerHead.add(stingerBlade);

// =========================================================================
// CALLOUT LABELS & LEADER LINES
// =========================================================================

const calloutDefs = [
  { id: 'optics', text: 'SENSOR HEAD', sub: 'TWIN 52MM OPTICS · MANDIBLES', getPos: () => headGroup.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.12, 0.1)) },
  { id: 'carapace', text: 'CARAPACE PLATES', sub: '5-TIER DORSAL SHIELD', getPos: () => carapacePlates[2].getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.1, 0)) },
  { id: 'claw_glass', text: 'GLASS CANOPY', sub: 'GEAR TRAIN · CLAMP 320N', getPos: () => clawL.forearm.getWorldPosition(new THREE.Vector3()) },
  { id: 'knee_hub', text: 'ROTARY KNEE HUB', sub: 'HIGH-TORQUE SERVO DISC', getPos: () => legs[1].trochanter.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(-0.1, 0.4, 0)) },
  { id: 'chassis', text: 'TITANIUM CHASSIS', sub: 'HYDRAULIC MANIFOLD', getPos: () => underChassis.getWorldPosition(new THREE.Vector3()) },
  { id: 'tail', text: 'STINGER TAIL', sub: '5-LINK ARCHED VERTEBRAE', getPos: () => tailSegments[2].group.getWorldPosition(new THREE.Vector3()) },
  { id: 'stinger', text: 'STINGER NEEDLE', sub: 'HYDRAULIC VENOM BULB', getPos: () => stingerHead.getWorldPosition(new THREE.Vector3()) }
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

let strikeFactor = 0;
let clawDeployFactor = 0;
let carapaceOpenFactor = 0;
let explodedFactor = 0;

let camLookAt = new THREE.Vector3(0, 0.05, 0);
let currentLookAt = new THREE.Vector3(0, 0.05, 0);
let spherical = new THREE.Spherical(5.4, Math.PI / 2.7, 0.78);

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
    titleEl.textContent = 'STANDING';
    descEl.textContent = 'OCTOPOD GAIT · HOLDING ZERO';
    statusText.textContent = 'STANDING';
    statusBadge.className = 'status-badge';
    spherical.radius = 5.4;
    spherical.phi = Math.PI / 2.7;
    camLookAt.set(0, 0.05, 0);
  } else if (mode === 'strike') {
    titleEl.textContent = 'STRIKE PRIMED';
    descEl.textContent = 'TAIL SNAP · 140° FORWARD ARC';
    statusText.textContent = 'STRIKE';
    statusBadge.className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · STRIKE ENGAGED';
    spherical.radius = 4.2;
    spherical.phi = Math.PI / 2.8;
    camLookAt.set(0, 0.4, 0.2);
  } else if (mode === 'carapace') {
    titleEl.textContent = 'CARAPACE LIFT';
    descEl.textContent = '5 TIERS · 54% ELEVATION';
    statusText.textContent = 'CARAPACE';
    statusBadge.className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · ISOLATE CARAPACE';
    spherical.radius = 3.8;
    spherical.phi = Math.PI / 3.0;
    camLookAt.set(0, 0.3, 0);
  } else if (mode === 'clawl') {
    titleEl.textContent = 'ISOLATE CLAW L';
    descEl.textContent = 'CHELA L · 62% DEPLOYED';
    statusText.textContent = 'CLAW L';
    statusBadge.className = 'status-badge orange';
    document.getElementById('timeline-operator-text').textContent = 'OPERATOR · ISOLATE CLAW L';
    spherical.radius = 3.4;
    spherical.phi = Math.PI / 2.5;
    spherical.theta = 1.25;
    camLookAt.set(-0.4, 0.0, 0.4);
  } else if (mode === 'legs') {
    titleEl.textContent = 'LEGS INSPECTION';
    descEl.textContent = '8 LEGS · 16 JOINTS · 8 KNEE HUBS';
    statusText.textContent = 'LEGS';
    statusBadge.className = 'status-badge';
    spherical.radius = 4.6;
    spherical.phi = Math.PI / 2.3;
    camLookAt.set(0, -0.2, 0);
  } else if (mode === 'stinger') {
    titleEl.textContent = 'STINGER UNIT';
    descEl.textContent = 'HYDRAULIC NEEDLE · VENOM TUBE';
    statusText.textContent = 'STINGER';
    statusBadge.className = 'status-badge';
    spherical.radius = 2.4;
    spherical.phi = Math.PI / 2.6;
    camLookAt.set(0, 0.65, -0.4);
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

const btnWalk = document.getElementById('btn-walk');
btnWalk.addEventListener('click', () => {
  isWalking = !isWalking;
  btnWalk.classList.toggle('active', isWalking);
  document.getElementById('mode-title').textContent = isWalking ? 'WALKING GAIT' : 'STANDING';
  document.getElementById('mode-desc').textContent = isWalking ? 'OCTOPOD FORWARD CREEP · 0.42 M/S' : 'TRIPOD GAIT · HOLDING ZERO';
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
let gaitWaveOffset = 0;

function drawGaitWave(time) {
  gaitCtx.clearRect(0, 0, gaitCanvas.width, gaitCanvas.height);
  gaitCtx.strokeStyle = '#e8e5de';
  gaitCtx.lineWidth = 1;
  gaitCtx.beginPath();
  gaitCtx.moveTo(0, gaitCanvas.height / 2);
  gaitCtx.lineTo(gaitCanvas.width, gaitCanvas.height / 2);
  gaitCtx.stroke();

  gaitCtx.strokeStyle = '#ff4800';
  gaitCtx.lineWidth = 1.8;
  gaitCtx.beginPath();

  const w = gaitCanvas.width;
  const h = gaitCanvas.height;
  const mid = h / 2;
  const amp = (isPlaying && isWalking) ? 9 : 2.5;

  for (let x = 0; x < w; x++) {
    const y = mid - Math.sin((x * 0.08) - gaitWaveOffset) * amp;
    if (x === 0) gaitCtx.moveTo(x, y);
    else gaitCtx.lineTo(x, y);
  }
  gaitCtx.stroke();
}

// =========================================================================
// MAIN ANIMATION LOOP & KINEMATICS
// =========================================================================

let clock = new THREE.Clock();
let elapsedSimTime = 9;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  if (isPlaying) {
    gaitWaveOffset += delta * 3.5;
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
  const targetStrike = (currentAssembly === 'strike') ? 1.0 : 0.0;
  strikeFactor += (targetStrike - strikeFactor) * 0.12;

  const targetCarapace = (currentAssembly === 'carapace' || isExploded) ? 1.0 : 0.0;
  carapaceOpenFactor += (targetCarapace - carapaceOpenFactor) * 0.08;

  const targetClawDeploy = (currentAssembly === 'clawl') ? 1.0 : 0.0;
  clawDeployFactor += (targetClawDeploy - clawDeployFactor) * 0.08;

  const targetExploded = isExploded ? 1.0 : 0.0;
  explodedFactor += (targetExploded - explodedFactor) * 0.08;

  // 1. CARAPACE EXPLODED ELEVATION
  carapacePlates.forEach((p, idx) => {
    p.position.y = (4 - idx) * 0.03 + carapaceOpenFactor * (0.15 + idx * 0.08);
  });

  // 2. CHELICERAE MANDIBLE TWITCH
  if (isPlaying) {
    const cheliTwitch = Math.sin(time * 8.0) * 0.08;
    cheliGroupL.rotation.y = cheliTwitch;
    cheliGroupR.rotation.y = -cheliTwitch;
  }

  // 3. CLAW DEPLOY & CLAMPING KINEMATICS
  // Left claw swings forward and articulates its pincer in CLAW L mode
  clawL.humerus.rotation.y = -0.45 - clawDeployFactor * 0.55;
  clawL.forearm.rotation.y = 0.72 + clawDeployFactor * 0.45;
  
  // Animate pincer jaws opening and closing
  const jawCycle = Math.sin(time * 3.5);
  clawL.jaw.rotation.y = 0.2 + jawCycle * 0.25;
  clawR.jaw.rotation.y = -0.2 - Math.sin(time * 2.8) * 0.2;

  // 4. TAIL STRIKE KINEMATICS (140° FORWARD SNAP)
  // Base arched pose when standing:
  // Segments arch gracefully upward and forward over back
  const baseCurveX = [0.42, 0.46, 0.48, 0.42, 0.38];
  tailSegments.forEach((seg, idx) => {
    const strikeBonusX = (strikeFactor > 0.01) ? (0.28 * strikeFactor) : 0;
    seg.group.rotation.x = baseCurveX[idx] + strikeBonusX;
  });

  // Gauge Needle & Strike Velocity readout
  const gaugeNeedle = document.getElementById('gauge-needle');
  const strikeVelEl = document.getElementById('val-strike-speed');
  if (gaugeNeedle && strikeVelEl) {
    const vel = (strikeFactor * 3.8).toFixed(1);
    strikeVelEl.textContent = vel;
    const deg = 45 + strikeFactor * 90;
    gaugeNeedle.style.transform = `rotate(${deg}deg)`;
  }

  // 5. 8-LEGGED OCTOPOD WALKING GAIT
  if (isWalking && isPlaying) {
    legs.forEach(leg => {
      const step = Math.sin(time * 5.0 + leg.gaitPhase);
      leg.trochanter.rotation.x = step * 0.18;
      leg.tibia.rotation.x = -step * 0.14;
    });

    // Slight chassis walking sway
    scorpRoot.position.y = Math.abs(Math.sin(time * 5.0)) * 0.02;
    scorpRoot.rotation.z = Math.sin(time * 2.5) * 0.015;
  } else {
    // Normal standing stance
    legs.forEach(leg => {
      leg.trochanter.rotation.x = 0;
      leg.tibia.rotation.x = 0;
    });
    scorpRoot.position.y = 0;
    scorpRoot.rotation.z = 0;
  }

  // UI & HUD UPDATES
  renderScreenLabels();
  drawGaitWave(time);
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
  document.getElementById('timeline-time').textContent = `00:${s} / 00:26`;

  const hydrVal = (24.0 + Math.sin(time * 2.0) * 1.5).toFixed(0);
  const hydrEl = document.getElementById('val-hydr');
  if (hydrEl) hydrEl.textContent = hydrVal;
}

requestAnimationFrame(animate);
