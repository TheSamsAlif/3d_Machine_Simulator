import * as THREE from 'three';

// =========================================================================
// MELLIS HB-7 · ROBOTIC POLLINATOR MICRO AIR VEHICLE (FIELD SIMULATOR)
// Exact match to the high-fidelity lab console & 3D teardown visualization
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

  /* Leg Servos Progress Rows */
  .servo-row { display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 9px; margin-bottom: 5px; }
  .servo-name { width: 22px; font-weight: 700; color: var(--text-dark); }
  .servo-track { flex: 1; height: 4px; background: #e8e4dc; border-radius: 2px; margin: 0 8px; overflow: hidden; }
  .servo-fill { height: 100%; background: var(--accent-orange); }
  .servo-val { width: 28px; text-align: right; font-weight: 600; color: var(--text-dark); }

  /* Right Side Buttons Grid */
  .btn-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-top: 4px; }
  .btn-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; margin-top: 4px; }
  .tech-btn { background: #fff; border: 1px solid var(--border-line); color: var(--text-dark); font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; padding: 6px 4px; border-radius: 4px; text-align: center; cursor: pointer; transition: all 0.15s ease; text-transform: uppercase; letter-spacing: 0.5px; }
  .tech-btn:hover { border-color: var(--text-muted); background: #faf9f6; }
  .tech-btn.active { background: var(--accent-orange); color: #fff; border-color: var(--accent-orange); }

  /* Subsystems List */
  .subsystem-row { display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; padding: 4px 0; border-bottom: 1px solid rgba(0,0,0,0.04); }
  .subsystem-row:last-child { border-bottom: none; }
  .subsystem-info { display: flex; flex-direction: column; }
  .subsystem-name { font-size: 8.5px; font-weight: 700; color: var(--text-dark); }
  .subsystem-detail { font-size: 7px; color: var(--text-muted); text-transform: uppercase; }
  .subsystem-badge { font-size: 7.5px; font-weight: 700; padding: 2px 5px; border-radius: 2px; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge-green { background: var(--accent-green-bg); color: var(--accent-green); }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-blue { background: #e0f2fe; color: #0284c7; }

  /* Bottom Flight Log / Scrubber */
  .bottom-bar { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 820px; margin: 0 auto; }
  .mode-announce { text-align: center; }
  .mode-announce-tag { font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; letter-spacing: 1.5px; color: var(--text-muted); text-transform: uppercase; }
  .mode-announce-title { font-size: 24px; font-weight: 900; letter-spacing: 1px; color: var(--accent-orange); text-transform: uppercase; line-height: 1; margin: 2px 0; }
  .mode-announce-sub { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); letter-spacing: 1px; }

  .flight-log-box { width: 100%; background: var(--panel-bg); border: 1px solid var(--border-line); border-radius: 6px; padding: 8px 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
  .play-btn { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-orange); color: #fff; border: none; display: grid; place-items: center; cursor: pointer; flex-shrink: 0; }
  .play-btn svg { width: 12px; height: 12px; fill: currentColor; }
  .timeline-track { flex: 1; height: 2px; background: #e3dfd7; position: relative; cursor: pointer; }
  .timeline-progress { position: absolute; left: 0; top: 0; height: 100%; background: var(--accent-orange); width: 65%; }
  .timeline-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; border-radius: 50%; background: #fff; border: 2px solid var(--accent-orange); }
  .timeline-markers { position: absolute; width: 100%; top: -14px; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 7.5px; font-weight: 600; color: var(--text-muted); }
  .timeline-actions { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--text-muted); white-space: nowrap; }

  /* 3D Callout Overlays */
  .callout-label { position: absolute; pointer-events: none; z-index: 15; font-family: 'JetBrains Mono', monospace; font-size: 8.5px; font-weight: 700; color: var(--accent-orange); background: rgba(255,255,255,0.95); border: 1px solid var(--accent-orange); padding: 3px 6px; border-radius: 2px; white-space: nowrap; transform: translate(-50%, -50%); box-shadow: 0 1px 4px rgba(255,72,0,0.15); display: none; }
  .callout-label span { display: block; font-size: 7px; color: var(--text-muted); font-weight: 500; }
`;
document.head.appendChild(style);

// Build HUD Layer DOM
const hudContainer = document.createElement('div');
hudContainer.id = 'hud-layer';
hudContainer.innerHTML = `
  <!-- TOP BAR -->
  <div class="top-bar">
    <div class="brand-group">
      <div class="logo-box">
        <svg viewBox="0 0 24 24"><path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/></svg>
        <span>HB-7</span>
      </div>
      <div class="title-block">
        <span class="title-tag">ROBOTIC POLLINATOR · MICRO AIR VEHICLE</span>
        <div class="title-main">Mellis HB-7<span>/</span></div>
        <span class="title-sub">FLAPPING-WING DRONE / FIELD SIMULATOR</span>
      </div>
    </div>

    <!-- Center Status Badges -->
    <div class="top-center">
      <div class="spec-item">
        <div class="spec-label">LIFT LOAD</div>
        <div class="lift-load-bar" id="lift-bar">
          <div class="lift-seg fill"></div><div class="lift-seg fill"></div><div class="lift-seg fill"></div>
          <div class="lift-seg fill"></div><div class="lift-seg fill"></div><div class="lift-seg fill"></div>
          <div class="lift-seg"></div><div class="lift-seg"></div><div class="lift-seg"></div><div class="lift-seg"></div>
        </div>
      </div>
      <div class="spec-item">
        <span class="spec-label">SIM ID</span>
        <span class="spec-val">H87-0412</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">RUNTIME</span>
        <span class="spec-val" id="hud-runtime">00:00:21</span>
      </div>
      <div class="spec-item">
        <span class="spec-label">STATUS</span>
        <span class="status-badge" id="hud-status-badge"><span class="status-dot"></span><span id="hud-status-text">HOVER</span></span>
      </div>
      <div class="spec-item">
        <span class="spec-label">OPERATOR</span>
        <span class="spec-val">LAB 3 - R.K.</span>
      </div>
    </div>
  </div>

  <!-- PANELS COLUMN (LEFT & RIGHT) -->
  <div class="panels-wrapper">
    <!-- LEFT COLUMN -->
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
            <div style="font-size:7px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">STROKE FREQUENCY</div>
          </div>
          <div style="text-align:right;">
            <span class="metric-sub" id="val-amp">±32°</span>
            <div style="font-size:7px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">AMPLITUDE</div>
          </div>
        </div>
        <canvas class="wave-canvas" id="wing-wave"></canvas>
        <div class="wave-meta">
          <span>PLAYBACK <b style="color:var(--text-dark)" id="val-playback">1.0×</b></span>
          <span>SHUTTER 1/60</span>
        </div>
      </div>

      <!-- 02 POWER -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">POWER</span>
          <span class="card-idx">02</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <span class="metric-big" id="val-battery">80</span><span class="metric-unit">%</span>
            <div style="font-size:7px;color:var(--text-muted);font-family:'JetBrains Mono',monospace;">BATTERY</div>
          </div>
          <div class="battery-bars" style="width:100px;">
            <div class="battery-seg fill-red"></div>
            <div class="battery-seg fill-red"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg fill-green"></div>
            <div class="battery-seg"></div>
          </div>
        </div>
        <div class="power-stats">
          <div><div class="power-sub">DRAW</div><div class="power-val" id="val-draw">34.0 W</div></div>
          <div><div class="power-sub">CELL</div><div class="power-val">3.70 V</div></div>
          <div><div class="power-sub">MOTOR</div><div class="power-val" id="val-temp">41 °C</div></div>
        </div>
      </div>

      <!-- 03 LEG SERVOS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">LEG SERVOS</span>
          <span class="card-idx">03</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:7.5px;color:var(--text-muted);margin-bottom:8px;font-family:'JetBrains Mono',monospace;">
          <span>LOAD PER LEG</span>
          <span class="subsystem-badge badge-green" id="leg-badge">ACTIVE</span>
        </div>
        <div id="servo-list">
          <div class="servo-row">
            <span class="servo-name">L1</span>
            <div class="servo-track"><div class="servo-fill" style="width:57%;"></div></div>
            <span class="servo-val" id="servo-l1">57%</span>
          </div>
          <div class="servo-row">
            <span class="servo-name">L2</span>
            <div class="servo-track"><div class="servo-fill" style="width:74%;"></div></div>
            <span class="servo-val" id="servo-l2">74%</span>
          </div>
          <div class="servo-row">
            <span class="servo-name">L3</span>
            <div class="servo-track"><div class="servo-fill" style="width:63%;"></div></div>
            <span class="servo-val" id="servo-l3">63%</span>
          </div>
          <div class="servo-row">
            <span class="servo-name">R1</span>
            <div class="servo-track"><div class="servo-fill" style="width:54%;"></div></div>
            <span class="servo-val" id="servo-r1">54%</span>
          </div>
          <div class="servo-row">
            <span class="servo-name">R2</span>
            <div class="servo-track"><div class="servo-fill" style="width:73%;"></div></div>
            <span class="servo-val" id="servo-r2">73%</span>
          </div>
          <div class="servo-row">
            <span class="servo-name">R3</span>
            <div class="servo-track"><div class="servo-fill" style="width:63%;"></div></div>
            <span class="servo-val" id="servo-r3">63%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT COLUMN -->
    <div class="panel-col-right">
      <!-- 04 FLIGHT / ATTITUDE -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">FLIGHT</span>
          <span class="card-idx">04</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
          <!-- Gimbal horizon dial -->
          <div style="width:48px;height:48px;border-radius:50%;border:1px solid var(--border-line);background:#faf8f5;position:relative;display:grid;place-items:center;overflow:hidden;">
            <div id="horizon-line" style="position:absolute;width:120%;height:2px;background:var(--accent-orange);transform:rotate(2deg);"></div>
            <div style="width:4px;height:4px;border-radius:50%;background:var(--text-dark);"></div>
          </div>
          <div style="flex:1;font-family:'JetBrains Mono',monospace;font-size:8px;">
            <div style="display:flex;justify-content:space-between;"><span>ALT AGL</span><b id="val-alt">144.0 MM</b></div>
            <div style="display:flex;justify-content:space-between;"><span>V/S</span><b id="val-vs">+0.6 MM/S</b></div>
            <div style="display:flex;justify-content:space-between;"><span>PITCH</span><b>+0.03°</b></div>
            <div style="display:flex;justify-content:space-between;"><span>ROLL</span><b>-0.57°</b></div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:4px;border-top:1px solid var(--border-line);font-family:'JetBrains Mono',monospace;font-size:7.5px;color:var(--text-muted);">
          <span>HOLD: <b style="color:var(--text-dark)">POSITION</b></span>
          <span>AIRSPEED: <b style="color:var(--text-dark)">0.00 M/S</b></span>
        </div>
      </div>

      <!-- 05 ASSEMBLIES -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">ASSEMBLIES</span>
          <span class="card-idx">05</span>
        </div>
        <div class="btn-grid-3">
          <button class="tech-btn active" data-assembly="hero">HERO</button>
          <button class="tech-btn" data-assembly="optics">OPTICS</button>
          <button class="tech-btn" data-assembly="wing">WING</button>
          <button class="tech-btn" data-assembly="leg">LEG L2</button>
          <button class="tech-btn" data-assembly="thorax">THORAX</button>
          <button class="tech-btn" data-assembly="abdomen">ABDOMEN</button>
        </div>
      </div>

      <!-- 06 DISPLAY CONTROLS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">DISPLAY</span>
          <span class="card-idx">06</span>
        </div>
        <div class="btn-grid-2">
          <button class="tech-btn" id="btn-labels">LABELS</button>
          <button class="tech-btn" id="btn-exploded">EXPLODED</button>
          <button class="tech-btn" id="btn-motion">MOTION BLUR</button>
          <button class="tech-btn" id="btn-turntable">TURNTABLE</button>
        </div>
      </div>

      <!-- 07 SUBSYSTEMS -->
      <div class="tech-card">
        <div class="card-header">
          <span class="card-title">SUBSYSTEMS</span>
          <span class="card-idx">07</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">01 OPTIC HEAD</span>
            <span class="subsystem-detail">2 x 18 MM LENS · AMBER IR</span>
          </div>
          <span class="subsystem-badge badge-green" id="sub-01">TRACKING</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">02 NECK BEARING</span>
            <span class="subsystem-detail">10-SEGMENT COLLAR</span>
          </div>
          <span class="subsystem-badge badge-green" id="sub-02">LOCKED</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">03 THORAX DRIVE</span>
            <span class="subsystem-detail">3 GEARS · 11 ACTUATORS</span>
          </div>
          <span class="subsystem-badge badge-blue" id="sub-03">ENGAGED</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">04 WING ROOTS</span>
            <span class="subsystem-detail">4 HINGES · 7.5 HZ CRANK</span>
          </div>
          <span class="subsystem-badge badge-green" id="sub-04">7.5 HZ</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">05 LEG SERVOS</span>
            <span class="subsystem-detail">6 LEGS · 3 JOINTS</span>
          </div>
          <span class="subsystem-badge badge-green" id="sub-05">ACTIVE</span>
        </div>
        <div class="subsystem-row">
          <div class="subsystem-info">
            <span class="subsystem-name">06 ABDOMEN CAPSULE</span>
            <span class="subsystem-detail">GEAR TRAIN · RETURN SPRING</span>
          </div>
          <span class="subsystem-badge badge-green" id="sub-06">SEALED</span>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTTOM BAR: FLIGHT LOG & SCRUBBER -->
  <div class="bottom-bar">
    <div class="mode-announce">
      <div class="mode-announce-tag">FLIGHT MODE</div>
      <div class="mode-announce-title" id="hud-flight-mode">HOVER</div>
      <div class="mode-announce-sub" id="hud-flight-desc">STATION KEEPING · 144 MM AGL</div>
    </div>

    <div class="flight-log-box interactive">
      <button class="play-btn" id="hud-play-btn">
        <svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
      </button>
      <div class="timeline-track" id="timeline-track">
        <div class="timeline-markers">
          <span>TAKE-OFF</span>
          <span id="timeline-state">OPERATOR · HERO · RELEASE</span>
          <span>LAND</span>
        </div>
        <div class="timeline-progress" id="timeline-progress"></div>
        <div class="timeline-handle" id="timeline-handle"></div>
      </div>
      <div class="timeline-actions">
        <span id="time-current">00:21</span> / 00:24 &nbsp;·&nbsp; 8 OPERATOR ACTIONS
      </div>
    </div>
  </div>
`;
app.appendChild(hudContainer);

// 3D Canvas
const canvasContainer = document.createElement('div');
canvasContainer.id = 'canvas-container';
const canvas = document.createElement('canvas');
canvas.id = 'gl';
canvasContainer.appendChild(canvas);
app.appendChild(canvasContainer);

// -------------------------------------------------------------------------
// THREE.JS SETUP & STUDIO LIGHTING
// -------------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f6f4f0');
scene.fog = new THREE.FogExp2('#f6f4f0', 0.008);

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(20, 12, 26);

// Clean warm studio lighting matching the render
const ambLight = new THREE.AmbientLight('#ffffff', 1.4);
scene.add(ambLight);

const keyLight = new THREE.DirectionalLight('#ffffff', 2.8);
keyLight.position.set(25, 35, 20);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 100;
keyLight.shadow.bias = -0.0001;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight('#fcefe8', 1.2);
fillLight.position.set(-20, 10, -15);
scene.add(fillLight);

const topSoftLight = new THREE.DirectionalLight('#ffffff', 1.0);
topSoftLight.position.set(0, 40, 0);
scene.add(topSoftLight);

// Subtle Ground Shadow Floor
const groundGeo = new THREE.PlaneGeometry(120, 120);
const groundMat = new THREE.ShadowMaterial({opacity: 0.08});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -6.2;
ground.receiveShadow = true;
scene.add(ground);

// -------------------------------------------------------------------------
// MATERIALS PALETTE (Mellis White Ceramic, Orange Accent & Black Mechanics)
// -------------------------------------------------------------------------
const matWhiteShell = new THREE.MeshStandardMaterial({
  color: 0xfaf8f5,
  roughness: 0.28,
  metalness: 0.1,
  envMapIntensity: 1.0
});

const matOrangeRing = new THREE.MeshStandardMaterial({
  color: 0xff4800,
  roughness: 0.25,
  metalness: 0.4
});

const matDarkMetal = new THREE.MeshStandardMaterial({
  color: 0x1a1918,
  roughness: 0.4,
  metalness: 0.85
});

const matChrome = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.15,
  metalness: 0.95
});

const matLens = new THREE.MeshStandardMaterial({
  color: 0x0a0908,
  roughness: 0.05,
  metalness: 0.9,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const matWingMesh = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.88,
  opacity: 0.9,
  transparent: true,
  roughness: 0.15,
  ior: 1.5,
  thickness: 0.08,
  side: THREE.DoubleSide
});

const matWingVein = new THREE.LineBasicMaterial({
  color: 0x2a2825,
  transparent: true,
  opacity: 0.65
});

// -------------------------------------------------------------------------
// ASSEMBLE MELLIS HB-7 ROBOTIC BEE MODEL (WITH EXPLODED TEARDOWN CAPABILITY)
// -------------------------------------------------------------------------
const beeRoot = new THREE.Group();
beeRoot.position.set(0, 0, 0);
scene.add(beeRoot);

// Exploded offsets registry
const explodedParts = [];
function registerExploded(mesh, vector, label = '', detail = '') {
  explodedParts.push({mesh, basePos: mesh.position.clone(), explodeVec: vector, label, detail});
}

// 1. HEAD & OPTIC ASSEMBLY
const headAssembly = new THREE.Group();
headAssembly.position.set(0, 0.4, 4.2);

// White Dome Shell
const headShell = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 32), matWhiteShell);
headShell.scale.set(1.0, 0.95, 1.1);
headShell.castShadow = true;
headAssembly.add(headShell);

// Large Optic Lens Eyepiece with Orange Bezel Ring
const eyeBezel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.25, 20, 36), matOrangeRing);
eyeBezel.position.set(0, 0.2, 2.3);
headAssembly.add(eyeBezel);

const eyeLens = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.4, 32), matLens);
eyeLens.rotateX(Math.PI / 2);
eyeLens.position.set(0, 0.2, 2.3);
headAssembly.add(eyeLens);

// Dual Antenna Probes
function createAntenna(side) {
  const g = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 12), matDarkMetal);
  stem.position.y = 1.6;
  g.add(stem);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.8, 16), matOrangeRing);
  tip.position.y = 3.2;
  g.add(tip);
  g.position.set(side * 0.9, 1.8, 1.2);
  g.rotation.set(-0.2, side * 0.2, side * 0.35);
  return g;
}
const antL = createAntenna(-1);
const antR = createAntenna(1);
headAssembly.add(antL, antR);
beeRoot.add(headAssembly);
registerExploded(headAssembly, new THREE.Vector3(0, 0.8, 6.0), 'OPTIC HEAD', '2x LENS · AMBER IR');

// 2. NECK BEARING COLLAR
const neckGroup = new THREE.Group();
neckGroup.position.set(0, 0.2, 2.5);
const neckRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.3, 16, 32), matOrangeRing);
neckGroup.add(neckRing);
for (let i = 0; i < 10; i++) {
  const angle = (i / 10) * Math.PI * 2;
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), matChrome);
  bead.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
  neckGroup.add(bead);
}
beeRoot.add(neckGroup);
registerExploded(neckGroup, new THREE.Vector3(0, 0.5, 3.2), 'NECK BEARING', '10-SEGMENT COLLAR');

// 3. CENTRAL THORAX & DRIVE GEAR CORE
const thoraxGroup = new THREE.Group();
thoraxGroup.position.set(0, 0, 0);

// Outer White Pod Shell
const thoraxShell = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.9, 4.2, 32), matWhiteShell);
thoraxShell.rotateX(Math.PI / 2);
thoraxShell.castShadow = true;
thoraxGroup.add(thoraxShell);

// Orange Circumference Stripe Rings
const tRing1 = new THREE.Mesh(new THREE.TorusGeometry(2.95, 0.14, 16, 40), matOrangeRing);
tRing1.position.z = -1.2;
thoraxGroup.add(tRing1);
const tRing2 = tRing1.clone();
tRing2.position.z = 1.2;
thoraxGroup.add(tRing2);

// Dense Inner Mechanical Core (Visible in exploded view)
const gearCore = new THREE.Group();
for (let i = 0; i < 5; i++) {
  const gMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6 - i * 0.2, 1.6 - i * 0.2, 0.35, 24), matDarkMetal);
  gMesh.rotateX(Math.PI / 2);
  gMesh.position.z = (i - 2) * 0.65;
  gearCore.add(gMesh);
}
thoraxGroup.add(gearCore);
beeRoot.add(thoraxGroup);
registerExploded(thoraxGroup, new THREE.Vector3(0, 0, 0), 'THORAX DRIVE', '3 GEARS · 11 ACTUATORS');

// 4. ABDOMEN CAPSULE
const abdomenGroup = new THREE.Group();
abdomenGroup.position.set(0, -0.2, -4.0);

const abdShell = new THREE.Mesh(new THREE.SphereGeometry(2.8, 32, 32), matWhiteShell);
abdShell.scale.set(0.95, 0.95, 1.8);
abdShell.castShadow = true;
abdomenGroup.add(abdShell);

const abdRing = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.18, 16, 32), matOrangeRing);
abdRing.position.z = 1.2;
abdomenGroup.add(abdRing);

const stinger = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.4, 16), matDarkMetal);
stinger.rotateX(-Math.PI / 2);
stinger.position.z = -5.0;
abdomenGroup.add(stinger);

beeRoot.add(abdomenGroup);
registerExploded(abdomenGroup, new THREE.Vector3(0, -0.5, -6.5), 'ABDOMEN CAPSULE', 'GEAR TRAIN · RETURN SPRING');

// 5. FOUR DELICATE HIGH-FREQUENCY WINGS
function createVeinedWing(scaleX, scaleZ) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(scaleX * 0.3, scaleZ * 0.2, scaleX * 0.7, scaleZ * 0.7, scaleX * 1.0, scaleZ * 0.95);
  shape.bezierCurveTo(scaleX * 1.1, scaleZ * 0.75, scaleX * 0.9, scaleZ * 0.2, scaleX * 0.35, 0);
  shape.bezierCurveTo(scaleX * 0.1, -scaleZ * 0.1, 0, 0, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 24);
  const wing = new THREE.Mesh(geo, matWingMesh);
  wing.rotateX(-Math.PI / 2);

  // Geometric grid veins
  const pts = [];
  pts.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(scaleX * 0.6, 0, scaleZ * 0.6));
  pts.push(new THREE.Vector3(scaleX * 0.95, 0, scaleZ * 0.9), new THREE.Vector3(scaleX * 0.4, 0, scaleZ * 0.3));
  pts.push(new THREE.Vector3(scaleX * 0.8, 0, scaleZ * 0.5));
  const vLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matWingVein);
  wing.add(vLine);
  return wing;
}

const wingLRoot = new THREE.Group();
wingLRoot.position.set(-2.2, 1.8, 0.2);
const forewingL = createVeinedWing(12.0, -4.5);
wingLRoot.add(forewingL);
beeRoot.add(wingLRoot);
registerExploded(wingLRoot, new THREE.Vector3(-6.0, 3.5, 0), 'WING HINGE L', 'QUICK RELEASE');

const wingRRoot = new THREE.Group();
wingRRoot.position.set(2.2, 1.8, 0.2);
const forewingR = createVeinedWing(-12.0, -4.5);
wingRRoot.add(forewingR);
beeRoot.add(wingRRoot);
registerExploded(wingRRoot, new THREE.Vector3(6.0, 3.5, 0), 'WING HINGE R', 'QUICK RELEASE');

// 6. SIX ARTICULATED LEGS WITH ORANGE JOINTS
function createBeeLeg(side, index) {
  const leg = new THREE.Group();
  const z = 1.4 - index * 1.5;
  leg.position.set(side * 2.4, -1.2, z);

  // Orange Hip Ball
  const hip = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 14), matOrangeRing);
  leg.add(hip);

  // White Thigh Femur
  const femurLen = 3.6;
  const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, femurLen, 12), matWhiteShell);
  femur.position.set(side * 0.8, -femurLen / 2, 0);
  femur.rotation.z = side * 0.45;
  femur.castShadow = true;
  leg.add(femur);

  // Knee Joint
  const knee = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 14), matOrangeRing);
  knee.position.set(side * 1.6, -femurLen, 0);
  leg.add(knee);

  // Lower Tibia
  const tibiaLen = 4.4;
  const tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, tibiaLen, 12), matDarkMetal);
  tibia.position.set(side * 2.2, -femurLen - tibiaLen / 2, 0.2);
  tibia.rotation.z = -side * 0.25;
  tibia.castShadow = true;
  leg.add(tibia);

  // Suction Rubber Foot
  const foot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), matDarkMetal);
  foot.position.set(side * 2.8, -femurLen - tibiaLen, 0.4);
  leg.add(foot);

  return {group: leg, side, index};
}

for (let i = 0; i < 3; i++) {
  const legL = createBeeLeg(-1, i);
  const legR = createBeeLeg(1, i);
  beeRoot.add(legL.group, legR.group);
  registerExploded(legL.group, new THREE.Vector3(-3.5, -2.5, (1 - i) * 2.5), `LEG L${i+1}`, 'SERVO 3-AXIS');
  registerExploded(legR.group, new THREE.Vector3(3.5, -2.5, (1 - i) * 2.5), `LEG R${i+1}`, 'SERVO 3-AXIS');
}

// -------------------------------------------------------------------------
// 3D CALLOUT LABELS ON DOM
// -------------------------------------------------------------------------
const calloutDivs = [];
explodedParts.forEach(part => {
  if (!part.label) return;
  const div = document.createElement('div');
  div.className = 'callout-label';
  div.innerHTML = `${part.label}<span>${part.detail}</span>`;
  document.body.appendChild(div);
  calloutDivs.push({div, part});
});

// -------------------------------------------------------------------------
// STATE MANAGEMENT & UI INTERACTIVITY
// -------------------------------------------------------------------------
let isExploded = false;
let explodeAmount = 0; // 0 = assembled, 1 = teardown
let showLabels = false;
let isTurntable = false;
let isPlaying = true;
let flightMode = 'HOVER'; // HOVER, TEARDOWN, CRUISE

const btnExploded = document.getElementById('btn-exploded');
btnExploded.addEventListener('click', () => {
  isExploded = !isExploded;
  btnExploded.classList.toggle('active', isExploded);
  
  if (isExploded) {
    showLabels = true;
    btnLabels.classList.add('active');
    document.getElementById('hud-flight-mode').innerText = 'TEARDOWN';
    document.getElementById('hud-flight-mode').style.color = '#ff4800';
    document.getElementById('hud-flight-desc').innerText = 'TURNTABLE 104° · 100% APART';
    document.getElementById('hud-status-text').innerText = 'TEARDOWN';
    document.getElementById('hud-status-badge').className = 'status-badge badge-red';
    
    // Set all subsystems to DETACHED
    document.querySelectorAll('.subsystem-badge').forEach(b => {
      b.className = 'subsystem-badge badge-red';
      b.innerText = 'DETACHED';
    });
  } else {
    document.getElementById('hud-flight-mode').innerText = 'HOVER';
    document.getElementById('hud-flight-mode').style.color = '#ff4800';
    document.getElementById('hud-flight-desc').innerText = 'STATION KEEPING · 144 MM AGL';
    document.getElementById('hud-status-text').innerText = 'HOVER';
    document.getElementById('hud-status-badge').className = 'status-badge badge-green';

    document.getElementById('sub-01').className = 'subsystem-badge badge-green'; document.getElementById('sub-01').innerText = 'TRACKING';
    document.getElementById('sub-02').className = 'subsystem-badge badge-green'; document.getElementById('sub-02').innerText = 'LOCKED';
    document.getElementById('sub-03').className = 'subsystem-badge badge-blue'; document.getElementById('sub-03').innerText = 'ENGAGED';
    document.getElementById('sub-04').className = 'subsystem-badge badge-green'; document.getElementById('sub-04').innerText = '7.5 HZ';
    document.getElementById('sub-05').className = 'subsystem-badge badge-green'; document.getElementById('sub-05').innerText = 'ACTIVE';
    document.getElementById('sub-06').className = 'subsystem-badge badge-green'; document.getElementById('sub-06').innerText = 'SEALED';
  }
});

const btnLabels = document.getElementById('btn-labels');
btnLabels.addEventListener('click', () => {
  showLabels = !showLabels;
  btnLabels.classList.toggle('active', showLabels);
});

const btnTurntable = document.getElementById('btn-turntable');
btnTurntable.addEventListener('click', () => {
  isTurntable = !isTurntable;
  btnTurntable.classList.toggle('active', isTurntable);
});

const btnMotion = document.getElementById('btn-motion');
btnMotion.addEventListener('click', () => {
  btnMotion.classList.toggle('active');
});

// Assembly Focus Buttons
document.querySelectorAll('.tech-btn[data-assembly]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tech-btn[data-assembly]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.assembly;
    
    if (type === 'hero') {
      camTarget.set(0, 0, 0);
      camSpherical = {radius: 36, theta: 0.8, phi: 1.1};
    } else if (type === 'optics') {
      camTarget.set(0, 0.4, 4.2);
      camSpherical = {radius: 12, theta: 0.3, phi: 1.3};
    } else if (type === 'wing') {
      camTarget.set(-2.2, 1.8, 0.2);
      camSpherical = {radius: 16, theta: 1.2, phi: 1.2};
    } else if (type === 'leg') {
      camTarget.set(-2.4, -3.0, 0);
      camSpherical = {radius: 14, theta: 1.4, phi: 1.6};
    } else if (type === 'thorax') {
      camTarget.set(0, 0, 0);
      camSpherical = {radius: 18, theta: 0.6, phi: 1.2};
    } else if (type === 'abdomen') {
      camTarget.set(0, -0.2, -4.0);
      camSpherical = {radius: 18, theta: 2.8, phi: 1.3};
    }
    updateCam();
  });
});

const playBtn = document.getElementById('hud-play-btn');
playBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playBtn.innerHTML = isPlaying 
    ? `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
    : `<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>`;
});

// -------------------------------------------------------------------------
// REAL-TIME SINE WAVE CHART (7.5 HZ WING BEAT)
// -------------------------------------------------------------------------
const waveCanvas = document.getElementById('wing-wave');
const waveCtx = waveCanvas.getContext('2d');
let wavePhase = 0;

function drawWave() {
  const w = waveCanvas.width = waveCanvas.offsetWidth;
  const h = waveCanvas.height = waveCanvas.offsetHeight;
  waveCtx.clearRect(0, 0, w, h);

  // Center baseline
  waveCtx.strokeStyle = '#e5e1d8';
  waveCtx.lineWidth = 1;
  waveCtx.beginPath();
  waveCtx.moveTo(0, h / 2);
  waveCtx.lineTo(w, h / 2);
  waveCtx.stroke();

  // Flapping Sine Wave
  waveCtx.strokeStyle = '#ff4800';
  waveCtx.lineWidth = 1.8;
  waveCtx.beginPath();
  
  const points = 120;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * w;
    // Amplitude dampens towards the left edge
    const damp = (i / points);
    const y = h / 2 + Math.sin(wavePhase - (points - i) * 0.22) * (h * 0.38) * damp;
    if (i === 0) waveCtx.moveTo(x, y);
    else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();

  // Current dot
  const dotY = h / 2 + Math.sin(wavePhase) * (h * 0.38);
  waveCtx.fillStyle = '#ff4800';
  waveCtx.beginPath();
  waveCtx.arc(w - 2, dotY, 3, 0, Math.PI * 2);
  waveCtx.fill();
}

// -------------------------------------------------------------------------
// CAMERA ORBIT CONTROLS
// -------------------------------------------------------------------------
let isDragging = false;
let prevPointer = {x: 0, y: 0};
let camSpherical = {radius: 36, theta: 0.8, phi: 1.1};
let camTarget = new THREE.Vector3(0, 0, 0);

function updateCam() {
  camSpherical.phi = Math.max(0.08, Math.min(Math.PI - 0.08, camSpherical.phi));
  camSpherical.radius = Math.max(8, Math.min(90, camSpherical.radius));
  camera.position.x = camTarget.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
  camera.position.y = camTarget.y + camSpherical.radius * Math.cos(camSpherical.phi);
  camera.position.z = camTarget.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
  camera.lookAt(camTarget);
}
updateCam();

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  prevPointer = {x: e.clientX, y: e.clientY};
  canvas.classList.add('grabbing');
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - prevPointer.x;
  const dy = e.clientY - prevPointer.y;
  prevPointer = {x: e.clientX, y: e.clientY};

  if (e.buttons === 2 || e.shiftKey) {
    const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
    camTarget.addScaledVector(right, dx * 0.05);
    camTarget.y += dy * 0.05;
  } else {
    camSpherical.theta -= dx * 0.006;
    camSpherical.phi -= dy * 0.006;
  }
  updateCam();
});

window.addEventListener('pointerup', () => {
  isDragging = false;
  canvas.classList.remove('grabbing');
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  camSpherical.radius *= Math.exp(e.deltaY * 0.001);
  updateCam();
}, {passive: false});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// -------------------------------------------------------------------------
// MAIN ANIMATION LOOP
// -------------------------------------------------------------------------
let clock = 0;
let lastTime = performance.now();
const tempVec = new THREE.Vector3();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (isPlaying) {
    clock += dt;
    wavePhase += dt * 7.5 * Math.PI * 2; // 7.5 Hz
  }

  // Turntable slow rotation
  if (isTurntable) {
    camSpherical.theta += dt * 0.25;
    updateCam();
  }

  // Smooth Explode Animation Interpolation
  const targetExplode = isExploded ? 1.0 : 0.0;
  explodeAmount += (targetExplode - explodeAmount) * Math.min(1.0, dt * 6.0);

  // Position parts based on explode amount
  for (let i = 0; i < explodedParts.length; i++) {
    const p = explodedParts[i];
    p.mesh.position.copy(p.basePos).addScaledVector(p.explodeVec, explodeAmount);
  }

  // Wing Flapping Dynamics (When not exploded)
  if (!isExploded) {
    const flapAngle = Math.sin(wavePhase) * (32 * Math.PI / 180);
    const pitchAngle = Math.cos(wavePhase) * 0.25;
    wingLRoot.rotation.set(pitchAngle, flapAngle, 0);
    wingRRoot.rotation.set(pitchAngle, -flapAngle, 0);

    // Body Hovering Micromotion
    beeRoot.position.y = Math.sin(clock * 3.0) * 0.15;
  } else {
    wingLRoot.rotation.set(0, 0, 0);
    wingRRoot.rotation.set(0, 0, 0);
  }

  // Update Callout Labels Projection in 2D Screen Space
  for (let i = 0; i < calloutDivs.length; i++) {
    const {div, part} = calloutDivs[i];
    if (showLabels && explodeAmount > 0.1) {
      part.mesh.getWorldPosition(tempVec);
      tempVec.project(camera);
      // Only show if in front of camera
      if (tempVec.z < 1.0) {
        const sx = (tempVec.x * 0.5 + 0.5) * innerWidth;
        const sy = (-(tempVec.y * 0.5) + 0.5) * innerHeight;
        div.style.left = `${sx}px`;
        div.style.top = `${sy}px`;
        div.style.display = 'block';
        div.style.opacity = `${explodeAmount}`;
      } else {
        div.style.display = 'none';
      }
    } else {
      div.style.display = 'none';
    }
  }

  // Draw Wave
  drawWave();

  // Dynamic Telemetry updates
  const seconds = Math.floor(clock);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  document.getElementById('hud-runtime').innerText = `00:${mm}:${ss}`;
  document.getElementById('time-current').innerText = `${mm}:${ss}`;

  // Update Gimbal horizon
  const horizonRoll = Math.sin(clock * 1.5) * 4.0;
  document.getElementById('horizon-line').style.transform = `rotate(${horizonRoll}deg)`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
