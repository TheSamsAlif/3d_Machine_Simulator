import * as THREE from 'three';

// Soft-Robotics Octopus (Biomimetic Cephalopod Hydro-Jet & Continuum Arm Simulator)
// Features: 8 articulated continuum hydrostatic tentacles, pulsed siphon jet propulsion,
// bioluminescent chromatophore mantle, suction pad grid, hydrodynamic wake cavitation.

const app = document.getElementById('app');
app.innerHTML = `
  <div id="ui-container" style="position:absolute;inset:0;pointer-events:none;z-index:10;font-family:'JetBrains Mono',monospace;color:#f1f5f9;">
    <!-- Top Header Bar -->
    <div style="position:absolute;top:16px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center;">
      <div style="background:rgba(8,12,22,0.85);backdrop-filter:blur(10px);border:1px solid rgba(0,240,255,0.3);border-radius:10px;padding:8px 18px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.4rem;">🐙</span>
        <div>
          <div style="font-weight:700;font-size:1.05rem;letter-spacing:1px;color:#00f0ff;">OCTO-BOT · HYDRO-8</div>
          <div style="font-size:0.7rem;color:#94a3b8;letter-spacing:0.5px;">SOFT-ROBOTIC CONTINUUM MANIPULATOR & HYDRO-JET</div>
        </div>
      </div>

      <!-- Quick Stats Pill -->
      <div style="background:rgba(8,12,22,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 16px;display:flex;gap:20px;">
        <div><span style="color:#94a3b8;font-size:0.65rem;">HYDRO-THRUST:</span> <b id="ui-thrust-val" style="color:#00f0ff;">48.2 N</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">SIPHON JET:</span> <b id="ui-siphon-val" style="color:#10b981;">PULSING</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">ARMS:</span> <b style="color:#ffd700;">8 CONTINUUM</b></div>
      </div>
    </div>

    <!-- Left Controls Panel -->
    <div style="position:absolute;left:20px;top:90px;width:290px;background:rgba(8,12,22,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:14px;pointer-events:auto;">
      <div style="font-size:0.75rem;font-weight:700;color:#00f0ff;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
        PNEUMATIC / FLUID ENGINE
      </div>

      <!-- Propulsion Pulse Frequency -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>HYDRO-JET PULSE:</span>
          <span id="speed-label" style="color:#00f0ff;font-weight:700;">1.0× (1.2 Hz)</span>
        </div>
        <input type="range" id="speed-slider" min="0.2" max="2.5" step="0.1" value="1.0" style="width:100%;accent-color:#00f0ff;cursor:pointer;">
      </div>

      <!-- Tentacle Wave Amplitude -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>ARM WAVE CURL:</span>
          <span id="amp-label" style="color:#10b981;font-weight:700;">100%</span>
        </div>
        <input type="range" id="amp-slider" min="20" max="180" step="5" value="100" style="width:100%;accent-color:#10b981;cursor:pointer;">
      </div>

      <!-- Kinematic Gait Modes -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;">Locomotion Gait Mode:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="gait-btn active" data-gait="swim" style="background:rgba(0,240,255,0.18);border:1px solid #00f0ff;color:#00f0ff;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Jet Swim</button>
          <button class="gait-btn" data-gait="crawl" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Floor Crawl</button>
          <button id="btn-glow" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Biolum Grid</button>
          <button id="btn-pause" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Pause [Space]</button>
        </div>
      </div>

      <!-- Camera Presets -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;">Camera Presets:</div>
        <div style="display:flex;gap:4px;">
          <button class="cam-btn" data-cam="orbit" style="flex:1;background:rgba(0,240,255,0.15);border:1px solid rgba(0,240,255,0.3);color:#00f0ff;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Orbit</button>
          <button class="cam-btn" data-cam="top" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Top Plan</button>
          <button class="cam-btn" data-cam="siphon" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Siphon</button>
          <button class="cam-btn" data-cam="tentacle" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Arm Macro</button>
        </div>
      </div>
    </div>

    <!-- Bottom Right Telemetry Box -->
    <div style="position:absolute;right:20px;bottom:20px;width:320px;background:rgba(8,12,22,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div style="font-size:0.75rem;font-weight:700;color:#00f0ff;letter-spacing:1px;display:flex;justify-content:space-between;">
        <span>CONTINUUM TELEMETRY</span>
        <span style="color:#10b981;">ACTIVE</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.75rem;">
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">SIPHON PRESSURE:</div>
          <div id="stat-pres" style="font-size:0.95rem;font-weight:700;color:#00f0ff;">185.0 kPa</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">MANTLE VOLUME:</div>
          <div id="stat-vol" style="font-size:0.95rem;font-weight:700;color:#ffd700;">4.85 L</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">BENDING CURVATURE:</div>
          <div id="stat-curve" style="font-size:0.95rem;font-weight:700;color:#10b981;">1.42 rad/m</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">WATER DRAG:</div>
          <div id="stat-drag" style="font-size:0.95rem;font-weight:700;color:#e2e8f0;">12.4 N</div>
        </div>
      </div>
      <div style="font-size:0.65rem;color:#64748b;line-height:1.4;">
        *Left Click + Drag: Orbit | Right Click / Two-Finger: Pan | Scroll: Zoom
      </div>
    </div>
  </div>
`;

// Three.js Scene Setup
const canvas = document.createElement('canvas');
canvas.id = 'gl';
canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;cursor:grab;';
app.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#030712');
scene.fog = new THREE.FogExp2('#030712', 0.015);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(24, 18, 30);

// Undersea / Sci-Fi Lighting
const ambLight = new THREE.AmbientLight('#002244', 1.2);
scene.add(ambLight);

const keyLight = new THREE.DirectionalLight('#00f0ff', 2.8);
keyLight.position.set(20, 30, 20);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight('#a855f7', 2.2);
rimLight.position.set(-20, -10, -20);
scene.add(rimLight);

const bottomLight = new THREE.PointLight('#10b981', 1.5, 40);
bottomLight.position.set(0, -12, 0);
scene.add(bottomLight);

// Caustic Grid Floor
const grid = new THREE.GridHelper(90, 45, '#00f0ff', 'rgba(0,240,255,0.06)');
grid.position.y = -14;
scene.add(grid);

// -------------------------------------------------------------------------
// BUILD OCTOPUS 3D MODEL
// -------------------------------------------------------------------------
const octoGroup = new THREE.Group();
scene.add(octoGroup);

// Materials
const matMantle = new THREE.MeshPhysicalMaterial({
  color: 0x0ea5e9,
  roughness: 0.25,
  metalness: 0.1,
  transmission: 0.75,
  opacity: 0.95,
  transparent: true,
  ior: 1.45,
  thickness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const matArm = new THREE.MeshStandardMaterial({
  color: 0x0284c7,
  roughness: 0.35,
  metalness: 0.2
});

const matSucker = new THREE.MeshStandardMaterial({
  color: 0x38bdf8,
  roughness: 0.2,
  metalness: 0.5,
  emissive: 0x004466,
  emissiveIntensity: 0.6
});

const matEye = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.1,
  metalness: 0.9
});

const matPupil = new THREE.MeshBasicMaterial({color: 0x00f0ff});

// 1. Dome-shaped Mantle
const mantleGeo = new THREE.SphereGeometry(3.6, 32, 32);
mantleGeo.scale(1.0, 1.45, 1.1);
const mantleMesh = new THREE.Mesh(mantleGeo, matMantle);
mantleMesh.position.set(0, 3.2, -0.6);
mantleMesh.rotation.x = -0.3;
octoGroup.add(mantleMesh);

// Internal Organ / Fluid Core (visible through transparent mantle)
const coreGeo = new THREE.SphereGeometry(2.0, 24, 24);
const matCore = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  emissive: 0x0088cc,
  emissiveIntensity: 0.9,
  roughness: 0.2
});
const coreMesh = new THREE.Mesh(coreGeo, matCore);
mantleMesh.add(coreMesh);

// 2. Lateral Eyes
function createEye(side) {
  const g = new THREE.Group();
  const eM = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 20), matEye);
  g.add(eM);

  // W-shaped slit pupil
  const pM = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.14, 0.2), matPupil);
  pM.position.z = 0.8;
  g.add(pM);

  g.position.set(side * 2.5, 1.2, 0.8);
  g.rotation.set(0, side * 0.4, 0);
  return g;
}
octoGroup.add(createEye(-1));
octoGroup.add(createEye(1));

// 3. Siphon Nozzle (Hydro-Jet Thrust Exchanger)
const siphonGeo = new THREE.CylinderGeometry(0.5, 0.85, 2.2, 20);
siphonGeo.rotateX(Math.PI / 2.2);
const matSiphon = new THREE.MeshStandardMaterial({color: 0x0369a1, roughness: 0.3, metalness: 0.4});
const siphonMesh = new THREE.Mesh(siphonGeo, matSiphon);
siphonMesh.position.set(0, 0.2, 2.6);
octoGroup.add(siphonMesh);

// Siphon Jet Particles
const jetCount = 200;
const jetGeo = new THREE.BufferGeometry();
const jetPos = new Float32Array(jetCount * 3);
const jetVel = [];
for (let i = 0; i < jetCount; i++) {
  jetPos[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
  jetPos[i * 3 + 1] = 0.2 + (Math.random() - 0.5) * 0.4;
  jetPos[i * 3 + 2] = 3.2 + Math.random() * 2.0;
  jetVel.push({
    x: (Math.random() - 0.5) * 0.15,
    y: -0.1 + (Math.random() - 0.5) * 0.1,
    z: 0.8 + Math.random() * 0.9
  });
}
jetGeo.setAttribute('position', new THREE.BufferAttribute(jetPos, 3));
const matJet = new THREE.PointsMaterial({
  color: 0x00f0ff,
  size: 0.4,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});
const jetParticles = new THREE.Points(jetGeo, matJet);
octoGroup.add(jetParticles);

// 4. Eight Articulated Continuum Tentacles
const armCount = 8;
const segPerArm = 14;
const arms = [];

for (let i = 0; i < armCount; i++) {
  const radAngle = (i / armCount) * Math.PI * 2;
  const armRoot = new THREE.Group();
  armRoot.position.set(Math.cos(radAngle) * 2.0, -0.2, Math.sin(radAngle) * 2.0);
  armRoot.rotation.y = radAngle;

  const segs = [];
  let parent = armRoot;

  for (let j = 0; j < segPerArm; j++) {
    const t = j / segPerArm;
    const rTop = (1.0 - t) * 0.6 + 0.12;
    const rBot = (1.0 - (t + 1 / segPerArm)) * 0.6 + 0.12;
    const len = 1.1;

    const segGeo = new THREE.CylinderGeometry(rBot, rTop, len, 16);
    segGeo.translate(0, -len / 2, 0);

    const segMesh = new THREE.Mesh(segGeo, matArm);
    segMesh.castShadow = true;

    // Underside Suction Pad
    const suckerGeo = new THREE.CylinderGeometry(rTop * 0.5, rTop * 0.6, 0.12, 12);
    suckerGeo.rotateX(Math.PI / 2);
    const suckerMesh = new THREE.Mesh(suckerGeo, matSucker);
    suckerMesh.position.set(0, -len / 2, -rTop);
    segMesh.add(suckerMesh);

    parent.add(segMesh);

    const nextJoint = new THREE.Group();
    nextJoint.position.set(0, -len, 0);
    segMesh.add(nextJoint);

    segs.push(segMesh);
    parent = nextJoint;
  }

  octoGroup.add(armRoot);
  arms.push({root: armRoot, segs, angle: radAngle});
}

// -------------------------------------------------------------------------
// INTERACTIVE CAMERA CONTROLS
// -------------------------------------------------------------------------
let isDragging = false;
let prevPointer = {x: 0, y: 0};
let camSpherical = {radius: 42, theta: 0.6, phi: 1.1};
let camTarget = new THREE.Vector3(0, 0, 0);

function updateCam() {
  camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi));
  camSpherical.radius = Math.max(12, Math.min(90, camSpherical.radius));
  camera.position.x = camTarget.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta);
  camera.position.y = camTarget.y + camSpherical.radius * Math.cos(camSpherical.phi);
  camera.position.z = camTarget.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta);
  camera.lookAt(camTarget);
}
updateCam();

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  prevPointer = {x: e.clientX, y: e.clientY};
  canvas.style.cursor = 'grabbing';
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
    camSpherical.theta -= dx * 0.007;
    camSpherical.phi -= dy * 0.007;
  }
  updateCam();
});

window.addEventListener('pointerup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  camSpherical.radius *= Math.exp(e.deltaY * 0.001);
  updateCam();
}, {passive: false});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// -------------------------------------------------------------------------
// UI & EVENT HANDLERS
// -------------------------------------------------------------------------
let pulseSpeed = 1.0;
let waveAmp = 100;
let gaitMode = 'swim';
let isPaused = false;
let isGlow = false;

const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
speedSlider.addEventListener('input', (e) => {
  pulseSpeed = parseFloat(e.target.value);
  speedLabel.innerText = `${pulseSpeed.toFixed(1)}× (${(1.2 * pulseSpeed).toFixed(1)} Hz)`;
});

const ampSlider = document.getElementById('amp-slider');
const ampLabel = document.getElementById('amp-label');
ampSlider.addEventListener('input', (e) => {
  waveAmp = parseInt(e.target.value);
  ampLabel.innerText = `${waveAmp}%`;
});

const btnPause = document.getElementById('btn-pause');
btnPause.addEventListener('click', () => {
  isPaused = !isPaused;
  btnPause.innerText = isPaused ? 'Play [Space]' : 'Pause [Space]';
  btnPause.style.borderColor = isPaused ? '#ffd700' : 'rgba(255,255,255,0.12)';
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    btnPause.click();
  }
});

const btnGlow = document.getElementById('btn-glow');
btnGlow.addEventListener('click', () => {
  isGlow = !isGlow;
  matArm.emissive = new THREE.Color(isGlow ? 0x00f0ff : 0x000000);
  matArm.emissiveIntensity = isGlow ? 0.6 : 0;
  btnGlow.style.background = isGlow ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)';
  btnGlow.style.borderColor = isGlow ? '#00f0ff' : 'rgba(255,255,255,0.12)';
});

document.querySelectorAll('.gait-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gait-btn').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.borderColor = 'rgba(255,255,255,0.12)';
      b.style.color = '#e2e8f0';
    });
    btn.style.background = 'rgba(0,240,255,0.18)';
    btn.style.borderColor = '#00f0ff';
    btn.style.color = '#00f0ff';
    gaitMode = btn.dataset.gait;
  });
});

document.querySelectorAll('.cam-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cam-btn').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.color = '#e2e8f0';
    });
    btn.style.background = 'rgba(0,240,255,0.15)';
    btn.style.color = '#00f0ff';

    const camType = btn.dataset.cam;
    if (camType === 'orbit') {
      camSpherical = {radius: 42, theta: 0.6, phi: 1.1};
      camTarget.set(0, 0, 0);
    } else if (camType === 'top') {
      camSpherical = {radius: 38, theta: 0.0, phi: 0.05};
      camTarget.set(0, 0, 0);
    } else if (camType === 'siphon') {
      camSpherical = {radius: 18, theta: 0.0, phi: 1.5};
      camTarget.set(0, 0.5, 2.5);
    } else if (camType === 'tentacle') {
      camSpherical = {radius: 16, theta: 1.8, phi: 1.8};
      camTarget.set(3, -4, 0);
    }
    updateCam();
  });
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// -------------------------------------------------------------------------
// CONTINUUM HYDRODYNAMICS & KINEMATICS LOOP
// -------------------------------------------------------------------------
let clock = 0;
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!isPaused) {
    clock += dt * pulseSpeed * 3.5;
  }

  // 1. Mantle Pulsation (Siphon jet pressure intake & contraction)
  const pulsePhase = clock % (Math.PI * 2);
  const isExpelling = Math.sin(pulsePhase) > 0.3;
  const mantleScaleX = 1.0 + Math.sin(pulsePhase) * 0.14;
  const mantleScaleY = 1.45 - Math.sin(pulsePhase) * 0.18;
  mantleMesh.scale.set(mantleScaleX, mantleScaleY, mantleScaleX);

  // Overall Octopus Translation / Surge
  if (gaitMode === 'swim') {
    octoGroup.position.y = Math.sin(clock * 0.8) * 1.5;
    octoGroup.position.z = Math.cos(clock * 0.8) * 1.2;
    octoGroup.rotation.x = -0.3 + Math.sin(clock * 0.8) * 0.15;
  } else {
    // Floor crawl posture
    octoGroup.position.y = -6.0 + Math.sin(clock * 0.4) * 0.3;
    octoGroup.position.z = 0;
    octoGroup.rotation.x = 0.2;
  }

  // 2. Eight Continuum Arms Kinematics
  const ampNorm = waveAmp / 100;
  for (let i = 0; i < armCount; i++) {
    const arm = arms[i];
    const armPhase = clock + i * (Math.PI / 4);

    for (let j = 0; j < segPerArm; j++) {
      const seg = arm.segs[j];
      const jointDist = j / segPerArm;

      if (gaitMode === 'swim') {
        // Coordinated Jet Swim: Opening and closing bell stroke + traveling wave
        const swimContract = Math.sin(pulsePhase) * 0.4;
        const waveAngle = Math.sin(armPhase - jointDist * 3.5) * 0.25 * ampNorm;
        seg.rotation.x = (-0.15 - swimContract + waveAngle);
        seg.rotation.z = Math.sin(armPhase * 0.5 + jointDist * 2) * 0.08;
      } else {
        // Crawling gait: Alternating tactile ground search & pull
        const crawlAngle = Math.sin(clock * 1.2 + i * 1.1 - jointDist * 4) * 0.35 * ampNorm;
        seg.rotation.x = (0.2 + crawlAngle);
        seg.rotation.z = Math.cos(clock * 1.2 + i * 0.8) * 0.12;
      }
    }
  }

  // 3. Siphon Thrust Jet Particles
  const jetPositions = jetGeo.attributes.position.array;
  for (let i = 0; i < jetCount; i++) {
    const idx = i * 3;
    if (isExpelling) {
      jetPositions[idx + 0] += jetVel[i].x;
      jetPositions[idx + 1] += jetVel[i].y;
      jetPositions[idx + 2] += jetVel[i].z * pulseSpeed;
    }

    if (jetPositions[idx + 2] > 20 || !isExpelling) {
      jetPositions[idx + 0] = (Math.random() - 0.5) * 0.4;
      jetPositions[idx + 1] = 0.2 + (Math.random() - 0.5) * 0.4;
      jetPositions[idx + 2] = 3.0 + Math.random() * 0.8;
    }
  }
  jetGeo.attributes.position.needsUpdate = true;
  jetParticles.visible = isExpelling;

  // 4. Update Real-Time Telemetry HUD
  const thrust = isExpelling ? (40.0 + Math.sin(pulsePhase) * 35.0 * pulseSpeed) : 4.5;
  const pressure = isExpelling ? (160 + Math.sin(pulsePhase) * 60 * pulseSpeed) : 85.0;
  const volume = 4.2 + Math.sin(pulsePhase) * 1.2;
  document.getElementById('ui-thrust-val').innerText = `${thrust.toFixed(1)} N`;
  document.getElementById('stat-pres').innerText = `${pressure.toFixed(1)} kPa`;
  document.getElementById('stat-vol').innerText = `${volume.toFixed(2)} L`;
  document.getElementById('stat-curve').innerText = `${(1.1 + Math.sin(pulsePhase) * 0.6 * ampNorm).toFixed(2)} rad/m`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
