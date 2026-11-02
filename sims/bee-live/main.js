import * as THREE from 'three';

// Bionic Robotic Bee (RoboBee Biomimetic MAV Simulator)
// Features: Dual piezoelectric spatial 4-bar linkage, figure-8 wing trajectories,
// leading-edge vortex particles, articulated breathing abdomen, compound eye sensors.

const W = 1600;
const H = 900;

// Setup App & UI DOM
const app = document.getElementById('app');
app.innerHTML = `
  <div id="ui-container" style="position:absolute;inset:0;pointer-events:none;z-index:10;font-family:'JetBrains Mono',monospace;color:#f1f5f9;">
    <!-- Top Header Bar -->
    <div style="position:absolute;top:16px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center;">
      <div style="background:rgba(8,12,20,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,215,0,0.3);border-radius:10px;padding:8px 18px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.4rem;">🐝</span>
        <div>
          <div style="font-weight:700;font-size:1.05rem;letter-spacing:1px;color:#ffd700;">ROBO-BEE · MAV-X4</div>
          <div style="font-size:0.7rem;color:#94a3b8;letter-spacing:0.5px;">BIOMIMETIC FLAPPING-WING MICRO AERIAL VEHICLE</div>
        </div>
      </div>

      <!-- Quick Stats Pill -->
      <div style="background:rgba(8,12,20,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 16px;display:flex;gap:20px;">
        <div><span style="color:#94a3b8;font-size:0.65rem;">LIFT/WEIGHT:</span> <b id="ui-lift-ratio" style="color:#10b981;">1.84×</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">PEAK FREQ:</span> <b id="ui-freq-val" style="color:#ffd700;">120 Hz</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">VORTEX LEV:</span> <b style="color:#00f0ff;">ACTIVE</b></div>
      </div>
    </div>

    <!-- Left Controls Panel -->
    <div style="position:absolute;left:20px;top:90px;width:280px;background:rgba(8,12,20,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:14px;pointer-events:auto;">
      <div style="font-size:0.75rem;font-weight:700;color:#ffd700;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
        FLIGHT TRANSMISSION
      </div>

      <!-- Frequency / Speed Slider -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>WING FLAP SPEED:</span>
          <span id="speed-label" style="color:#ffd700;font-weight:700;">1.0× (120 Hz)</span>
        </div>
        <input type="range" id="speed-slider" min="0.05" max="2.0" step="0.05" value="1.0" style="width:100%;accent-color:#ffd700;cursor:pointer;">
      </div>

      <!-- Stroke Amplitude Slider -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>STROKE AMPLITUDE:</span>
          <span id="amp-label" style="color:#00f0ff;font-weight:700;">115°</span>
        </div>
        <input type="range" id="amp-slider" min="45" max="135" step="1" value="115" style="width:100%;accent-color:#00f0ff;cursor:pointer;">
      </div>

      <!-- Dissect / Cutaway Modes -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;">Dissection & View:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button id="btn-xray" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">X-Ray Shell</button>
          <button id="btn-vortex" style="background:rgba(0,240,255,0.15);border:1px solid rgba(0,240,255,0.4);color:#00f0ff;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Air Vortex</button>
          <button id="btn-pause" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Pause [Space]</button>
          <button id="btn-reset" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Reset View</button>
        </div>
      </div>

      <!-- Camera Presets -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;">Camera Presets:</div>
        <div style="display:flex;gap:4px;">
          <button class="cam-btn" data-cam="orbit" style="flex:1;background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.3);color:#ffd700;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Orbit</button>
          <button class="cam-btn" data-cam="top" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Top Plan</button>
          <button class="cam-btn" data-cam="front" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Front View</button>
          <button class="cam-btn" data-cam="wing" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Wing Macro</button>
        </div>
      </div>
    </div>

    <!-- Bottom Right Telemetry Box -->
    <div style="position:absolute;right:20px;bottom:20px;width:320px;background:rgba(8,12,20,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div style="font-size:0.75rem;font-weight:700;color:#00f0ff;letter-spacing:1px;display:flex;justify-content:space-between;">
        <span>KINEMATIC TELEMETRY</span>
        <span style="color:#10b981;">SYNC 60 FPS</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.75rem;">
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">LIFT FORCE:</div>
          <div id="stat-lift" style="font-size:0.95rem;font-weight:700;color:#10b981;">142.5 mN</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">PIEZO POWER:</div>
          <div id="stat-power" style="font-size:0.95rem;font-weight:700;color:#ffd700;">385 mW</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">PITCH (AOA):</div>
          <div id="stat-aoa" style="font-size:0.95rem;font-weight:700;color:#00f0ff;">±42.0°</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">THORAX TEMP:</div>
          <div id="stat-temp" style="font-size:0.95rem;font-weight:700;color:#e2e8f0;">38.4 °C</div>
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
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#06080d');
scene.fog = new THREE.FogExp2('#06080d', 0.012);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(22, 14, 28);

// Lights
const ambLight = new THREE.AmbientLight('#ffffff', 0.8);
scene.add(ambLight);

const keyLight = new THREE.DirectionalLight('#ffd700', 3.0);
keyLight.position.set(15, 30, 20);
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight('#00f0ff', 2.0);
rimLight.position.set(-20, -10, -20);
scene.add(rimLight);

const fillLight = new THREE.PointLight('#3b82f6', 1.5, 50);
fillLight.position.set(0, -10, 15);
scene.add(fillLight);

// Ground Grid
const grid = new THREE.GridHelper(80, 40, '#00f0ff', 'rgba(255,255,255,0.05)');
grid.position.y = -12;
scene.add(grid);

// -------------------------------------------------------------------------
// BUILD BIONIC BEE 3D MODEL
// -------------------------------------------------------------------------
const beeGroup = new THREE.Group();
scene.add(beeGroup);

// Materials
const matCarbon = new THREE.MeshStandardMaterial({
  color: 0x181a20,
  roughness: 0.35,
  metalness: 0.85
});

const matGold = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.25,
  metalness: 0.95
});

const matYellowStripe = new THREE.MeshStandardMaterial({
  color: 0xffcc00,
  roughness: 0.3,
  metalness: 0.5,
  emissive: 0x332200
});

const matEye = new THREE.MeshStandardMaterial({
  color: 0x00f0ff,
  roughness: 0.1,
  metalness: 0.9,
  emissive: 0x006688,
  emissiveIntensity: 0.8
});

const matWing = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.92,
  opacity: 1,
  transparent: true,
  roughness: 0.15,
  ior: 1.52,
  metalness: 0.1,
  thickness: 0.05,
  side: THREE.DoubleSide
});

const matWingVein = new THREE.LineBasicMaterial({
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.8
});

const matInternal = new THREE.MeshStandardMaterial({
  color: 0x10b981,
  roughness: 0.3,
  metalness: 0.9,
  emissive: 0x044020
});

// 1. Thorax (Center Actuator Housing)
const thoraxGeo = new THREE.CylinderGeometry(2.4, 2.7, 5.5, 24);
thoraxGeo.rotateX(Math.PI / 2);
const thoraxMesh = new THREE.Mesh(thoraxGeo, matCarbon);
thoraxMesh.castShadow = true;
beeGroup.add(thoraxMesh);

// Thorax Gold Reinforcement Rings
const ringGeo = new THREE.TorusGeometry(2.8, 0.18, 16, 32);
const ring1 = new THREE.Mesh(ringGeo, matGold);
ring1.position.z = -1.2;
beeGroup.add(ring1);
const ring2 = ring1.clone();
ring2.position.z = 1.2;
beeGroup.add(ring2);

// Internal Piezo Electric Motor Plates (visible in X-Ray)
const motorGroup = new THREE.Group();
for (let i = 0; i < 4; i++) {
  const plateGeo = new THREE.BoxGeometry(0.2, 3.2, 1.8);
  const plate = new THREE.Mesh(plateGeo, matInternal);
  plate.position.x = (i - 1.5) * 0.7;
  motorGroup.add(plate);
}
beeGroup.add(motorGroup);

// 2. Head with Compound Eyes & Antennae
const headGroup = new THREE.Group();
headGroup.position.set(0, 0.4, 3.8);

const headGeo = new THREE.SphereGeometry(1.8, 24, 24);
headGeo.scale(1, 0.9, 1.1);
const headMesh = new THREE.Mesh(headGeo, matCarbon);
headGroup.add(headMesh);

// Eyes (Left & Right)
const eyeGeo = new THREE.SphereGeometry(1.0, 20, 20);
eyeGeo.scale(0.8, 1.4, 1.2);
const eyeL = new THREE.Mesh(eyeGeo, matEye);
eyeL.position.set(-1.2, 0.5, 0.4);
eyeL.rotation.set(0.3, -0.4, 0.3);
headGroup.add(eyeL);

const eyeR = eyeL.clone();
eyeR.position.x = 1.2;
eyeR.rotation.set(0.3, 0.4, -0.3);
headGroup.add(eyeR);

// Antennae
function createAntenna(sign) {
  const g = new THREE.Group();
  const c1 = new THREE.CylinderGeometry(0.08, 0.08, 1.8);
  const m1 = new THREE.Mesh(c1, matGold);
  m1.position.y = 0.9;
  g.add(m1);
  const c2 = new THREE.CylinderGeometry(0.06, 0.08, 2.0);
  const m2 = new THREE.Mesh(c2, matGold);
  m2.position.set(0, 1.8 + 0.9, 0.4);
  m2.rotation.x = -0.5;
  g.add(m2);
  g.position.set(sign * 0.7, 1.4, 1.2);
  g.rotation.set(0.4, sign * 0.3, sign * 0.2);
  return g;
}
const antL = createAntenna(-1);
const antR = createAntenna(1);
headGroup.add(antL, antR);
beeGroup.add(headGroup);

// 3. Segmented Abdomen (Bionic Stripes & Stinger)
const abdomenGroup = new THREE.Group();
abdomenGroup.position.set(0, -0.2, -3.2);

const segCount = 6;
const segMeshes = [];
for (let i = 0; i < segCount; i++) {
  const t = i / (segCount - 1);
  const radius = Math.sin(t * Math.PI) * 2.2 + 0.9;
  const length = 1.5;
  const segGeo = new THREE.CylinderGeometry(radius * 0.9, radius, length, 24);
  segGeo.rotateX(Math.PI / 2);
  const mat = (i % 2 === 0) ? matYellowStripe : matCarbon;
  const segMesh = new THREE.Mesh(segGeo, mat);
  segMesh.position.z = -i * 1.35;
  segMeshes.push(segMesh);
  abdomenGroup.add(segMesh);
}

// Micro Stinger Needle
const stingerGeo = new THREE.ConeGeometry(0.35, 2.2, 16);
stingerGeo.rotateX(-Math.PI / 2);
const stingerMesh = new THREE.Mesh(stingerGeo, matGold);
stingerMesh.position.z = -segCount * 1.35 - 0.5;
abdomenGroup.add(stingerMesh);
beeGroup.add(abdomenGroup);

// 4. Six Robotic Multi-Jointed Legs
function createLeg(side, index) {
  const leg = new THREE.Group();
  const c1 = new THREE.CylinderGeometry(0.14, 0.12, 2.5);
  const femur = new THREE.Mesh(c1, matCarbon);
  femur.position.y = -1.25;
  leg.add(femur);

  const tibiaGroup = new THREE.Group();
  tibiaGroup.position.y = -2.5;
  const c2 = new THREE.CylinderGeometry(0.1, 0.07, 3.2);
  const tibia = new THREE.Mesh(c2, matGold);
  tibia.position.y = -1.6;
  tibiaGroup.add(tibia);
  tibiaGroup.rotation.z = side * 0.8;
  leg.add(tibiaGroup);

  const zPos = 1.2 - index * 1.4;
  leg.position.set(side * 2.2, -1.2, zPos);
  leg.rotation.set(-0.2 + index * 0.2, 0, -side * 0.6);
  return leg;
}

for (let i = 0; i < 3; i++) {
  beeGroup.add(createLeg(-1, i));
  beeGroup.add(createLeg(1, i));
}

// 5. High-Frequency Flapping Wings (Forewings & Hindwings)
function createWingMesh(scaleX, scaleZ) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(scaleX * 0.4, scaleZ * 0.3, scaleX * 0.8, scaleZ * 0.8, scaleX * 1.0, scaleZ * 0.95);
  shape.bezierCurveTo(scaleX * 1.1, scaleZ * 0.7, scaleX * 0.9, scaleZ * 0.2, scaleX * 0.3, 0);
  shape.bezierCurveTo(scaleX * 0.1, -scaleZ * 0.1, 0, 0, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 24);
  const mesh = new THREE.Mesh(geo, matWing);
  mesh.rotateX(-Math.PI / 2);

  // Structural Wing Veins
  const pts = [];
  pts.push(new THREE.Vector3(0, 0, 0));
  pts.push(new THREE.Vector3(scaleX * 0.6, 0, scaleZ * 0.6));
  pts.push(new THREE.Vector3(scaleX * 0.95, 0, scaleZ * 0.9));
  const veinGeo = new THREE.BufferGeometry().setFromPoints(pts);
  const veinLine = new THREE.Line(veinGeo, matWingVein);
  mesh.add(veinLine);

  return mesh;
}

// Left Wings Hinge
const wingHingeL = new THREE.Group();
wingHingeL.position.set(-1.8, 1.8, 0.4);
const forewingL = createWingMesh(9.5, -4.5);
const hindwingL = createWingMesh(6.0, -3.2);
hindwingL.position.set(0, -0.15, -1.2);
wingHingeL.add(forewingL, hindwingL);
beeGroup.add(wingHingeL);

// Right Wings Hinge
const wingHingeR = new THREE.Group();
wingHingeR.position.set(1.8, 1.8, 0.4);
const forewingR = createWingMesh(-9.5, -4.5);
const hindwingR = createWingMesh(-6.0, -3.2);
hindwingR.position.set(0, -0.15, -1.2);
wingHingeR.add(forewingR, hindwingR);
beeGroup.add(wingHingeR);

// 6. Airflow Leading-Edge Vortex Particles (LEV)
const vortexCount = 350;
const vortexGeo = new THREE.BufferGeometry();
const vortexPositions = new Float32Array(vortexCount * 3);
const vortexVelocities = [];

for (let i = 0; i < vortexCount; i++) {
  vortexPositions[i * 3 + 0] = (Math.random() - 0.5) * 16;
  vortexPositions[i * 3 + 1] = Math.random() * 4;
  vortexPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  vortexVelocities.push({
    x: (Math.random() - 0.5) * 0.1,
    y: -0.2 - Math.random() * 0.3,
    z: -0.15 - Math.random() * 0.2
  });
}
vortexGeo.setAttribute('position', new THREE.BufferAttribute(vortexPositions, 3));
const matVortex = new THREE.PointsMaterial({
  color: 0x00f0ff,
  size: 0.35,
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending
});
const vortexParticles = new THREE.Points(vortexGeo, matVortex);
beeGroup.add(vortexParticles);

// -------------------------------------------------------------------------
// INTERACTIVE CAMERA CONTROLS
// -------------------------------------------------------------------------
let isDragging = false;
let prevPointer = {x: 0, y: 0};
let camSpherical = {radius: 36, theta: 0.8, phi: 1.1};
let camTarget = new THREE.Vector3(0, 0, 0);

function updateCam() {
  camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi));
  camSpherical.radius = Math.max(10, Math.min(80, camSpherical.radius));
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
    // Pan
    const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
    camTarget.addScaledVector(right, dx * 0.05);
    camTarget.y += dy * 0.05;
  } else {
    // Orbit
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
let flapSpeed = 1.0;
let strokeAmplitude = 115;
let isPaused = false;
let isXray = false;
let showVortex = true;

const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
speedSlider.addEventListener('input', (e) => {
  flapSpeed = parseFloat(e.target.value);
  speedLabel.innerText = `${flapSpeed.toFixed(1)}× (${Math.round(120 * flapSpeed)} Hz)`;
  document.getElementById('ui-freq-val').innerText = `${Math.round(120 * flapSpeed)} Hz`;
});

const ampSlider = document.getElementById('amp-slider');
const ampLabel = document.getElementById('amp-label');
ampSlider.addEventListener('input', (e) => {
  strokeAmplitude = parseInt(e.target.value);
  ampLabel.innerText = `${strokeAmplitude}°`;
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

const btnXray = document.getElementById('btn-xray');
btnXray.addEventListener('click', () => {
  isXray = !isXray;
  matCarbon.transparent = isXray;
  matCarbon.opacity = isXray ? 0.35 : 1.0;
  matCarbon.wireframe = isXray;
  btnXray.style.background = isXray ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)';
  btnXray.style.borderColor = isXray ? '#00f0ff' : 'rgba(255,255,255,0.12)';
});

const btnVortex = document.getElementById('btn-vortex');
btnVortex.addEventListener('click', () => {
  showVortex = !showVortex;
  vortexParticles.visible = showVortex;
  btnVortex.style.opacity = showVortex ? '1' : '0.4';
});

const btnReset = document.getElementById('btn-reset');
btnReset.addEventListener('click', () => {
  camSpherical = {radius: 36, theta: 0.8, phi: 1.1};
  camTarget.set(0, 0, 0);
  updateCam();
});

document.querySelectorAll('.cam-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cam-btn').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.color = '#e2e8f0';
    });
    btn.style.background = 'rgba(255,215,0,0.15)';
    btn.style.color = '#ffd700';

    const camType = btn.dataset.cam;
    if (camType === 'orbit') {
      camSpherical = {radius: 36, theta: 0.8, phi: 1.1};
      camTarget.set(0, 0, 0);
    } else if (camType === 'top') {
      camSpherical = {radius: 32, theta: 0.0, phi: 0.05};
      camTarget.set(0, 0, 0);
    } else if (camType === 'front') {
      camSpherical = {radius: 28, theta: 0.0, phi: Math.PI / 2};
      camTarget.set(0, 0, 0);
    } else if (camType === 'wing') {
      camSpherical = {radius: 14, theta: 1.2, phi: 1.3};
      camTarget.set(-2, 1.5, 0);
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
// ANIMATION & KINEMATICS LOOP
// -------------------------------------------------------------------------
let clock = 0;
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!isPaused) {
    clock += dt * flapSpeed * 30.0; // Scaled for visible 60fps rendering
  }

  // Kinematic Flapping Equations
  const radAmp = (strokeAmplitude * Math.PI) / 180;
  const strokePhase = clock;
  
  // Stroke angle (horizontal sweep): phi(t) = phi_max * cos(wt)
  const strokeAngle = Math.cos(strokePhase) * radAmp * 0.5;
  // Pitch / feathering angle: psi(t) = psi_max * sin(wt)
  const pitchAngle = Math.sin(strokePhase) * 0.65;
  // Deviation (figure-8 path): theta(t) = theta_max * sin(2wt)
  const devAngle = Math.sin(strokePhase * 2.0) * 0.22;

  // Apply to Left Wing
  wingHingeL.rotation.y = strokeAngle;
  wingHingeL.rotation.x = pitchAngle;
  wingHingeL.rotation.z = devAngle;

  // Apply to Right Wing (symmetric reflection)
  wingHingeR.rotation.y = -strokeAngle;
  wingHingeR.rotation.x = pitchAngle;
  wingHingeR.rotation.z = -devAngle;

  // Body Hovering Dynamics & Abdomen Breathing
  beeGroup.position.y = Math.sin(clock * 0.4) * 0.6;
  beeGroup.rotation.x = Math.sin(clock * 0.2) * 0.05 + 0.1;

  // Abdomen contraction
  const breath = Math.sin(clock * 0.15) * 0.12;
  abdomenGroup.rotation.x = -0.2 + breath;
  for (let i = 0; i < segMeshes.length; i++) {
    const s = 1.0 + Math.sin(clock * 0.25 + i * 0.4) * 0.04;
    segMeshes[i].scale.set(s, s, 1.0);
  }

  // Antennae vibration
  antL.rotation.z = -0.2 + Math.sin(clock * 0.8) * 0.08;
  antR.rotation.z = 0.2 - Math.sin(clock * 0.8) * 0.08;

  // Airflow Vortex Particles Circulation
  if (showVortex) {
    const pos = vortexGeo.attributes.position.array;
    for (let i = 0; i < vortexCount; i++) {
      const idx = i * 3;
      pos[idx + 0] += vortexVelocities[i].x;
      pos[idx + 1] += vortexVelocities[i].y * flapSpeed;
      pos[idx + 2] += vortexVelocities[i].z;

      // Recycle particles behind wings
      if (pos[idx + 1] < -10) {
        pos[idx + 0] = (Math.random() - 0.5) * 14;
        pos[idx + 1] = 2.0 + Math.random() * 2.0;
        pos[idx + 2] = -1.0 + (Math.random() - 0.5) * 4.0;
      }
    }
    vortexGeo.attributes.position.needsUpdate = true;
  }

  // Update Dynamic HUD Readouts
  const instantLift = Math.abs(Math.sin(strokePhase)) * 180 * flapSpeed;
  const instantAoa = Math.sin(strokePhase) * 42.0;
  document.getElementById('stat-lift').innerText = `${instantLift.toFixed(1)} mN`;
  document.getElementById('stat-aoa').innerText = `${instantAoa > 0 ? '+' : ''}${instantAoa.toFixed(1)}°`;
  document.getElementById('stat-power').innerText = `${Math.round(260 + instantLift * 1.2)} mW`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
