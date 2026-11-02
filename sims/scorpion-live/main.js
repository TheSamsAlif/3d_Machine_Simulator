import * as THREE from 'three';

// Bionic Robotic Scorpion (Bio-Mechanical Hexapod / Octopod Rover Simulator)
// Features: 8 articulated legs with wave tripod gait kinematics, 6-segment hydraulic
// arched sting tail with strike dynamics, dual 3-axis hydraulic pincer chelae, armor shell.

const app = document.getElementById('app');
app.innerHTML = `
  <div id="ui-container" style="position:absolute;inset:0;pointer-events:none;z-index:10;font-family:'JetBrains Mono',monospace;color:#f1f5f9;">
    <!-- Top Header Bar -->
    <div style="position:absolute;top:16px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center;">
      <div style="background:rgba(12,10,16,0.85);backdrop-filter:blur(10px);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:8px 18px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.4rem;">🦂</span>
        <div>
          <div style="font-weight:700;font-size:1.05rem;letter-spacing:1px;color:#ef4444;">SCORPIO-ROVER · MK-VIII</div>
          <div style="font-size:0.7rem;color:#94a3b8;letter-spacing:0.5px;">BIONIC OCTOPOD EXOSKELETON & HYDRAULIC STINGER</div>
        </div>
      </div>

      <!-- Quick Stats Pill -->
      <div style="background:rgba(12,10,16,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 16px;display:flex;gap:20px;">
        <div><span style="color:#94a3b8;font-size:0.65rem;">STRIKE READY:</span> <b id="ui-strike-status" style="color:#10b981;">ARMED</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">CLAMP FORCE:</span> <b id="ui-clamp-val" style="color:#ef4444;">320 N</b></div>
        <div><span style="color:#94a3b8;font-size:0.65rem;">GAIT:</span> <b style="color:#ffd700;">8-LEG TRIPOD</b></div>
      </div>
    </div>

    <!-- Left Controls Panel -->
    <div style="position:absolute;left:20px;top:90px;width:290px;background:rgba(12,10,16,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:14px;pointer-events:auto;">
      <div style="font-size:0.75rem;font-weight:700;color:#ef4444;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:6px;">
        LOCOMOTION & ACTUATORS
      </div>

      <!-- Walking Speed Slider -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>WALK SPEED / GAIT:</span>
          <span id="speed-label" style="color:#ef4444;font-weight:700;">1.0× (0.8 m/s)</span>
        </div>
        <input type="range" id="speed-slider" min="0" max="2.5" step="0.1" value="1.0" style="width:100%;accent-color:#ef4444;cursor:pointer;">
      </div>

      <!-- Stinger Arc Slider -->
      <div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px;">
          <span>TAIL ARCH ELEVATION:</span>
          <span id="tail-label" style="color:#ffd700;font-weight:700;">100%</span>
        </div>
        <input type="range" id="tail-slider" min="40" max="160" step="5" value="100" style="width:100%;accent-color:#ffd700;cursor:pointer;">
      </div>

      <!-- Trigger Action Buttons -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:8px;text-transform:uppercase;">Combat & Strike Actions:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button id="btn-strike" style="background:rgba(239,68,68,0.25);border:1px solid #ef4444;color:#ef4444;font-weight:700;padding:7px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">⚡ Sting Strike</button>
          <button id="btn-clamp" style="background:rgba(255,215,0,0.15);border:1px solid #ffd700;color:#ffd700;font-weight:700;padding:7px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">🦀 Pincer Snap</button>
          <button id="btn-armor" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Wireframe</button>
          <button id="btn-pause" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e2e8f0;padding:6px;font-family:inherit;font-size:0.7rem;border-radius:6px;cursor:pointer;">Pause [Space]</button>
        </div>
      </div>

      <!-- Camera Presets -->
      <div>
        <div style="font-size:0.7rem;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;">Camera Presets:</div>
        <div style="display:flex;gap:4px;">
          <button class="cam-btn" data-cam="orbit" style="flex:1;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Orbit</button>
          <button class="cam-btn" data-cam="top" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Top Plan</button>
          <button class="cam-btn" data-cam="stinger" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Stinger</button>
          <button class="cam-btn" data-cam="claws" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;padding:5px;font-size:0.65rem;border-radius:4px;cursor:pointer;">Claws</button>
        </div>
      </div>
    </div>

    <!-- Bottom Right Telemetry Box -->
    <div style="position:absolute;right:20px;bottom:20px;width:320px;background:rgba(12,10,16,0.85);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;">
      <div style="font-size:0.75rem;font-weight:700;color:#ef4444;letter-spacing:1px;display:flex;justify-content:space-between;">
        <span>EXOSKELETON TELEMETRY</span>
        <span style="color:#10b981;">ONLINE</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.75rem;">
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">HYDRAULIC PRESSURE:</div>
          <div id="stat-hydro" style="font-size:0.95rem;font-weight:700;color:#ef4444;">240 bar</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">STRIKE VELOCITY:</div>
          <div id="stat-vel" style="font-size:0.95rem;font-weight:700;color:#ffd700;">8.4 m/s</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">GROUND CLEARANCE:</div>
          <div id="stat-clear" style="font-size:0.95rem;font-weight:700;color:#10b981;">18.5 cm</div>
        </div>
        <div style="background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.05);">
          <div style="color:#94a3b8;font-size:0.65rem;">SERVO LOAD:</div>
          <div id="stat-load" style="font-size:0.95rem;font-weight:700;color:#e2e8f0;">42%</div>
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

const scene = new THREE.Scene();
scene.background = new THREE.Color('#070508');
scene.fog = new THREE.FogExp2('#070508', 0.012);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(28, 20, 32);

// Industrial Mars / Sci-Fi Lighting
const ambLight = new THREE.AmbientLight('#261820', 1.4);
scene.add(ambLight);

const keyLight = new THREE.DirectionalLight('#ff5533', 3.0);
keyLight.position.set(20, 35, 20);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight('#00f0ff', 2.0);
rimLight.position.set(-25, -10, -20);
scene.add(rimLight);

const stingerLight = new THREE.PointLight('#ef4444', 3.0, 20);
scene.add(stingerLight);

// Desert Grid Floor
const grid = new THREE.GridHelper(90, 45, '#ef4444', 'rgba(239,68,68,0.06)');
grid.position.y = -6;
scene.add(grid);

// -------------------------------------------------------------------------
// BUILD SCORPION ROVER 3D MODEL
// -------------------------------------------------------------------------
const scorpGroup = new THREE.Group();
scorpGroup.position.y = -2;
scene.add(scorpGroup);

// Materials
const matArmor = new THREE.MeshStandardMaterial({
  color: 0x1f1a24,
  roughness: 0.35,
  metalness: 0.85
});

const matGoldJoint = new THREE.MeshStandardMaterial({
  color: 0xd97706,
  roughness: 0.25,
  metalness: 0.95
});

const matRedLight = new THREE.MeshStandardMaterial({
  color: 0xef4444,
  emissive: 0xff0022,
  emissiveIntensity: 1.2,
  roughness: 0.2
});

const matPiston = new THREE.MeshStandardMaterial({
  color: 0xe2e8f0,
  roughness: 0.15,
  metalness: 0.95
});

// 1. Carapace Body (Prosoma & Mesosoma Exoskeleton)
const bodyGroup = new THREE.Group();
const carapaceGeo = new THREE.CylinderGeometry(2.6, 3.2, 7.5, 8);
carapaceGeo.rotateX(Math.PI / 2);
carapaceGeo.scale(1.2, 0.65, 1.0);
const carapaceMesh = new THREE.Mesh(carapaceGeo, matArmor);
bodyGroup.add(carapaceMesh);

// Armor Segment Plates
for (let i = 0; i < 5; i++) {
  const plateGeo = new THREE.BoxGeometry(4.2 - i * 0.4, 0.4, 1.2);
  const plate = new THREE.Mesh(plateGeo, matArmor);
  plate.position.set(0, 1.1, -0.6 - i * 0.9);
  bodyGroup.add(plate);
}

// Optical Sensor Array (Red Glowing Eyes)
for (let i = -1; i <= 1; i += 2) {
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.5), matRedLight);
  eye.position.set(i * 0.9, 0.8, 3.6);
  bodyGroup.add(eye);
}

scorpGroup.add(bodyGroup);

// 2. Eight Multi-Jointed Walking Legs
const legCount = 8;
const legs = [];

function createScorpionLeg(side, index) {
  const legRoot = new THREE.Group();
  const zPos = 2.0 - index * 1.3;
  legRoot.position.set(side * 2.8, -0.2, zPos);

  // Coxa Joint
  const coxaGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const coxa = new THREE.Mesh(coxaGeo, matGoldJoint);
  legRoot.add(coxa);

  // Femur Thigh
  const femurLen = 3.6;
  const femurGeo = new THREE.CylinderGeometry(0.24, 0.18, femurLen, 12);
  femurGeo.translate(0, femurLen / 2, 0);
  const femur = new THREE.Mesh(femurGeo, matArmor);
  femur.position.set(0, 0, 0);
  femur.rotation.z = side * 1.0;
  legRoot.add(femur);

  // Tibia Lower Leg
  const tibiaLen = 4.2;
  const tibiaGeo = new THREE.CylinderGeometry(0.18, 0.12, tibiaLen, 12);
  tibiaGeo.translate(0, -tibiaLen / 2, 0);
  const tibia = new THREE.Mesh(tibiaGeo, matArmor);
  tibia.position.set(side * (Math.sin(1.0) * femurLen), Math.cos(1.0) * femurLen, 0);
  tibia.rotation.z = -side * 0.6;
  legRoot.add(tibia);

  // Foot Spike
  const foot = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.0, 8), matGoldJoint);
  foot.position.set(0, -tibiaLen, 0);
  tibia.add(foot);

  return {root: legRoot, femur, tibia, side, index};
}

for (let i = 0; i < 4; i++) {
  const legL = createScorpionLeg(-1, i);
  const legR = createScorpionLeg(1, i);
  scorpGroup.add(legL.root, legR.root);
  legs.push(legL, legR);
}

// 3. Dual Heavy Hydraulic Claws (Chelae / Pedipalps)
function createClaw(side) {
  const arm = new THREE.Group();
  arm.position.set(side * 2.2, 0.2, 3.4);

  // Upper arm
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 3.8, 12), matArmor);
  arm1.position.set(side * 1.5, 0.2, 1.4);
  arm1.rotation.set(-0.3, side * 0.6, side * 0.8);
  arm.add(arm1);

  // Forearm & Pincer Bulb
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), matArmor);
  bulb.scale.set(1.4, 0.8, 1.8);
  bulb.position.set(side * 2.6, 0.4, 3.4);
  arm.add(bulb);

  // Fixed Pincer Blade
  const bladeFGeo = new THREE.ConeGeometry(0.35, 3.0, 12);
  bladeFGeo.translate(0, 1.5, 0);
  bladeFGeo.rotateX(Math.PI / 2);
  const bladeFixed = new THREE.Mesh(bladeFGeo, matGoldJoint);
  bladeFixed.position.set(0, 0, 1.2);
  bladeFixed.rotation.y = -side * 0.3;
  bulb.add(bladeFixed);

  // Moving Pincer Blade (Pivoting)
  const bladeMovePivot = new THREE.Group();
  bladeMovePivot.position.set(0, 0, 0.8);
  const bladeMove = new THREE.Mesh(bladeFGeo.clone(), matGoldJoint);
  bladeMovePivot.add(bladeMove);
  bulb.add(bladeMovePivot);

  return {root: arm, bladeMovePivot, side};
}

const clawL = createClaw(-1);
const clawR = createClaw(1);
scorpGroup.add(clawL.root, clawR.root);

// 4. Six-Segment Arched Sting Tail (Metasoma)
const tailSegments = [];
let tailParent = scorpGroup;

const tailSegCount = 6;
for (let i = 0; i < tailSegCount; i++) {
  const segJoint = new THREE.Group();
  if (i === 0) {
    segJoint.position.set(0, 0.4, -3.8);
  } else {
    segJoint.position.set(0, 0, -1.8);
  }

  const r = 0.9 - i * 0.08;
  const segGeo = new THREE.CylinderGeometry(r * 0.9, r, 1.9, 14);
  segGeo.rotateX(Math.PI / 2);
  const segMesh = new THREE.Mesh(segGeo, matArmor);
  segMesh.position.set(0, 0, -0.95);
  segJoint.add(segMesh);

  // Hydraulic Piston Cylinder on joint
  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 8), matPiston);
  piston.position.set(0, 0.8, -0.9);
  piston.rotation.x = Math.PI / 2;
  segJoint.add(piston);

  tailParent.add(segJoint);
  tailSegments.push(segJoint);
  tailParent = segJoint;
}

// Telson Venom Bulb & Stinger Needle
const telsonBulb = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), matArmor);
telsonBulb.scale.set(0.9, 1.4, 1.1);
telsonBulb.position.set(0, 0, -1.6);
tailParent.add(telsonBulb);

const stingerGeo = new THREE.ConeGeometry(0.28, 2.4, 16);
stingerGeo.rotateX(Math.PI / 1.7);
const stingerMesh = new THREE.Mesh(stingerGeo, matRedLight);
stingerMesh.position.set(0, 0.8, -1.8);
telsonBulb.add(stingerMesh);

// -------------------------------------------------------------------------
// INTERACTIVE CAMERA CONTROLS
// -------------------------------------------------------------------------
let isDragging = false;
let prevPointer = {x: 0, y: 0};
let camSpherical = {radius: 46, theta: 0.7, phi: 1.1};
let camTarget = new THREE.Vector3(0, 0, 0);

function updateCam() {
  camSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, camSpherical.phi));
  camSpherical.radius = Math.max(12, Math.min(100, camSpherical.radius));
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
let walkSpeed = 1.0;
let tailElevation = 100;
let isPaused = false;
let isWireframe = false;
let strikeProgress = 0; // 0 = rest, 1 = max strike
let clampProgress = 0;  // 0 = open, 1 = clamped

const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
speedSlider.addEventListener('input', (e) => {
  walkSpeed = parseFloat(e.target.value);
  speedLabel.innerText = `${walkSpeed.toFixed(1)}× (${(0.8 * walkSpeed).toFixed(1)} m/s)`;
});

const tailSlider = document.getElementById('tail-slider');
const tailLabel = document.getElementById('tail-label');
tailSlider.addEventListener('input', (e) => {
  tailElevation = parseInt(e.target.value);
  tailLabel.innerText = `${tailElevation}%`;
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

const btnStrike = document.getElementById('btn-strike');
btnStrike.addEventListener('click', () => {
  if (strikeProgress <= 0.01) {
    strikeProgress = 1.0;
    document.getElementById('ui-strike-status').innerText = 'STRIKING!';
    document.getElementById('ui-strike-status').style.color = '#ef4444';
  }
});

const btnClamp = document.getElementById('btn-clamp');
btnClamp.addEventListener('click', () => {
  clampProgress = 1.0;
  document.getElementById('ui-clamp-val').innerText = '680 N (LOCK)';
  setTimeout(() => {
    document.getElementById('ui-clamp-val').innerText = '320 N';
  }, 1000);
});

const btnArmor = document.getElementById('btn-armor');
btnArmor.addEventListener('click', () => {
  isWireframe = !isWireframe;
  matArmor.wireframe = isWireframe;
  btnArmor.style.background = isWireframe ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)';
  btnArmor.style.borderColor = isWireframe ? '#ef4444' : 'rgba(255,255,255,0.12)';
});

document.querySelectorAll('.cam-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cam-btn').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.06)';
      b.style.color = '#e2e8f0';
    });
    btn.style.background = 'rgba(239,68,68,0.15)';
    btn.style.color = '#ef4444';

    const camType = btn.dataset.cam;
    if (camType === 'orbit') {
      camSpherical = {radius: 46, theta: 0.7, phi: 1.1};
      camTarget.set(0, 0, 0);
    } else if (camType === 'top') {
      camSpherical = {radius: 40, theta: 0.0, phi: 0.05};
      camTarget.set(0, 0, 0);
    } else if (camType === 'stinger') {
      camSpherical = {radius: 18, theta: 3.14, phi: 1.2};
      camTarget.set(0, 5, -2);
    } else if (camType === 'claws') {
      camSpherical = {radius: 18, theta: 0.0, phi: 1.4};
      camTarget.set(0, 0, 4);
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
// KINEMATICS & TRIPOD GAIT WALKING LOOP
// -------------------------------------------------------------------------
let clock = 0;
let lastTime = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  if (!isPaused) {
    clock += dt * walkSpeed * 4.0;
  }

  // 1. Alternating 8-Leg Tripod / Wave Walking Gait
  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    // Wave phase offset between adjacent legs
    const phaseOffset = (leg.index % 2 === 0 ? 0 : Math.PI) + (leg.side === 1 ? Math.PI : 0);
    const legPhase = clock + phaseOffset;

    if (walkSpeed > 0.01) {
      // Forward swing & step elevation
      const stepLift = Math.max(0, Math.sin(legPhase)) * 0.35;
      const stepSwing = Math.cos(legPhase) * 0.45;

      leg.root.rotation.y = stepSwing;
      leg.femur.rotation.x = -stepLift;
      leg.tibia.rotation.x = stepLift * 0.5;
    } else {
      leg.root.rotation.y = 0;
      leg.femur.rotation.x = 0;
    }
  }

  // Body roll & pitch dynamics during stride
  if (walkSpeed > 0.01) {
    scorpGroup.position.y = -2 + Math.abs(Math.sin(clock * 2)) * 0.3;
    scorpGroup.rotation.z = Math.sin(clock) * 0.03;
  }

  // 2. Six-Segment Arched Sting Tail Kinematics
  const archFactor = (tailElevation / 100) * 0.52;
  
  // Strike Attack Dynamics
  if (strikeProgress > 0) {
    strikeProgress = Math.max(0, strikeProgress - dt * 2.2);
    if (strikeProgress <= 0) {
      document.getElementById('ui-strike-status').innerText = 'ARMED';
      document.getElementById('ui-strike-status').style.color = '#10b981';
    }
  }
  const strikeBoost = Math.sin(strikeProgress * Math.PI) * 0.35;

  for (let i = 0; i < tailSegments.length; i++) {
    // Dynamic curvature curve from base to stinger tip
    const baseCurv = archFactor + strikeBoost;
    tailSegments[i].rotation.x = -baseCurv + Math.sin(clock * 0.5 + i * 0.3) * 0.03;
  }

  // 3. Hydraulic Pincer Claws Clamping & Breathing
  if (clampProgress > 0) {
    clampProgress = Math.max(0, clampProgress - dt * 2.5);
  }
  const clawClose = Math.sin(clampProgress * Math.PI) * 0.6;
  clawL.bladeMovePivot.rotation.y = -clawClose - 0.2 + Math.sin(clock * 0.4) * 0.05;
  clawR.bladeMovePivot.rotation.y = clawClose + 0.2 - Math.sin(clock * 0.4) * 0.05;

  // Stinger Tip Light Tracking
  const stingerWorldPos = new THREE.Vector3();
  stingerMesh.getWorldPosition(stingerWorldPos);
  stingerLight.position.copy(stingerWorldPos);

  // 4. Update Real-Time Telemetry HUD
  const hydroPressure = 220 + Math.sin(clock) * 25 + (strikeProgress * 80);
  const strikeVel = (8.4 + strikeProgress * 14.2);
  document.getElementById('stat-hydro').innerText = `${Math.round(hydroPressure)} bar`;
  document.getElementById('stat-vel').innerText = `${strikeVel.toFixed(1)} m/s`;
  document.getElementById('stat-load').innerText = `${Math.round(35 + walkSpeed * 22 + strikeProgress * 40)}%`;

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
