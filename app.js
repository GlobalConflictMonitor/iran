import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { PulseDecoder } from './decoder.js';
import { Sonifier } from './sonification.js';
import { TacticalUI, TemporalScrubber } from './tactical_ui.js';
import { AuditPersistence } from './audit_persistence.js';

const resonanceEngine = new Sonifier();

const canvas = document.getElementById('world-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// CSS2D Spatial Topography Initialization
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('css2d-canvas').appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 35); 

const controls = new OrbitControls(camera, labelRenderer.domElement); // Bind to CSS canvas to allow clicking
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05; 
controls.minDistance = 10;
controls.maxDistance = 150;
controls.autoRotate = false; // Controlled by Boot Sequence initially

const gridHelper = new THREE.GridHelper(60, 60, 0x00ffaa, 0x003311);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0x002200);
scene.add(ambientLight);
const gridLight = new THREE.PointLight(0x00ffaa, 1.5, 100);
gridLight.position.set(0, 20, 10);
scene.add(gridLight);

const meshes = [];
const ghostTrails = []; 
const spacing = 1.5;
const offset = (16 * spacing) / 2 - (spacing / 2);

// Semantic Mapping for spatial labels
const domainLabels = { 0: "KINETIC", 4: "CYBER", 8: "PROXY", 12: "ENERGY" };

for (let i = 0; i < 16; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0.5, 0); 
    const mat = new THREE.MeshStandardMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((i * spacing) - offset, 0, 0);
    mesh.userData = { dimension: i };
    
    // Spatial Topology Anchors (Node Labeling)
    if (domainLabels[i]) {
        const div = document.createElement('div');
        div.className = 'node-label';
        div.textContent = `V${i}:${domainLabels[i]}`;
        const label = new CSS2DObject(div);
        label.position.set(0, 2, 0);
        mesh.add(label);
    }
    
    scene.add(mesh);
    meshes.push(mesh);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// DETERMINISTIC BOOT SEQUENCE STATE
const BootSys = {
    active: true,
    phase: 0,
    targets: [0, 4, 8, 12],
    messages: [
        "CALIBRATING V_0: KINETIC MANIFOLD...",
        "CALIBRATING V_4: DIGITAL SUPPRESSION...",
        "CALIBRATING V_8: PROXY ANCHORS...",
        "CALIBRATING V_12: MACRO ENERGY..."
    ],
    lastSwitch: Date.now()
};

const GCM_OS = {
    activeDim: null,
    isPlayback: false,
    targetHeights: new Array(16).fill(0.1),
    currentVector: null,
    currentMetadata: null,

    init: async function() {
        const intel = await PulseDecoder.extractMeta('./heartbeat.png');
        if (intel && !this.isPlayback) {
            const sigma = intel.sigmaVector.map(v => (v / 255).toFixed(2));
            if (window.AuditPersistence) AuditPersistence.push(intel.rawVector, intel.metadata, sigma);
            this.sync(intel.rawVector, intel.metadata, sigma);
            TemporalScrubber.updateTimeDisplay(null); // Live stream
        }
    },

    sync: function(vector, metadata, sigma) {
        if (this.activeDim !== null) resonanceEngine.playSolo(vector[this.activeDim], this.activeDim, sigma[this.activeDim]);
        
        // ASYNCHRONOUS EVENT LEDGER (dV/dt calculation)
        if (this.currentVector && !this.isPlayback && !BootSys.active) {
            const tags = metadata.split('|');
            for(let i=0; i<16; i++) {
                const deltaV = vector[i] - this.currentVector[i];
                if (deltaV > 40) TacticalUI.triggerAlert(i, deltaV, tags[i].split('_').slice(0,2).join('_'));
            }
        }

        this.currentVector = vector;
        this.currentMetadata = metadata;
        
        meshes.forEach((mesh) => {
            const ghostMat = new THREE.MeshBasicMaterial({ color: mesh.material.color.getHex(), transparent: true, opacity: 0.35, wireframe: true });
            const ghost = new THREE.Mesh(mesh.geometry, ghostMat);
            ghost.position.copy(mesh.position);
            ghost.scale.copy(mesh.scale);
            scene.add(ghost);
            ghostTrails.push(ghost);
        });

        this.targetHeights = vector.map(v => Math.max(0.1, (v / 255) * 15));
        const energyNorm = vector[12] / 255.0;
        ambientLight.color.copy(new THREE.Color(0x002200)).lerp(new THREE.Color(0xaa3300), energyNorm);

        this.updateHUD(vector, metadata, sigma);
    },

    updateHUD: function(vector, metadata, sigma) {
        if (this.activeDim !== null) {
            const tags = metadata.split('|');
            const hash = tags.find(t => t.startsWith('HASH_')) || "HASH_MISSING";
            TacticalUI.updateProvenance(this.activeDim, vector[this.activeDim], tags[this.activeDim] || "AWAITING_INTEL", sigma[this.activeDim], hash);
        }
    }
};

window.addEventListener('click', (event) => {
    if (BootSys.active) return; // Lock clicks during boot sequence
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
        GCM_OS.activeDim = intersects[0].object.userData.dimension;
        if (GCM_OS.currentVector) GCM_OS.sync(GCM_OS.currentVector, GCM_OS.currentMetadata, new Array(16).fill(1.0)); // Temp sigma for cache sync
    } else {
        GCM_OS.activeDim = null; 
    }
});

function animate() {
    requestAnimationFrame(animate);
    
    const now = Date.now();

    // DETERMINISTIC BOOT SEQUENCE LOGIC
    if (BootSys.active) {
        if (now - BootSys.lastSwitch > 3000) {
            BootSys.phase++;
            BootSys.lastSwitch = now;
        }

        if (BootSys.phase < 4) {
            document.getElementById('boot-text').innerText = BootSys.messages[BootSys.phase];
            const targetMesh = meshes[BootSys.targets[BootSys.phase]];
            const idealPos = new THREE.Vector3(targetMesh.position.x + 5, 8, targetMesh.position.z + 15);
            camera.position.lerp(idealPos, 0.05);
            controls.target.lerp(targetMesh.position, 0.05);
        } else {
            BootSys.active = false;
            document.getElementById('boot-screen').style.display = 'none';
            controls.autoRotate = true;
        }
    } else {
        // HYBRID CAMERA LOGIC
        if (GCM_OS.activeDim !== null) {
            controls.autoRotate = false;
            controls.target.lerp(meshes[GCM_OS.activeDim].position, 0.05); 
        } else {
            controls.autoRotate = true; 
            controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05); 
        }
    }

    controls.update(); 

    meshes.forEach((mesh, i) => {
        mesh.scale.y += (GCM_OS.targetHeights[i] - mesh.scale.y) * 0.1;
        // Float labels dynamically based on geometry height
        mesh.children.forEach(c => { if(c.isCSS2DObject) c.position.y = 1.1; });
        
        if (GCM_OS.activeDim === i) {
            mesh.material.color.setHex(0xffffff); mesh.material.wireframe = false;
        } else {
            mesh.material.color.setHex(0x00ffaa); mesh.material.wireframe = GCM_OS.activeDim !== null;
        }
    });

    for (let i = ghostTrails.length - 1; i >= 0; i--) {
        const ghost = ghostTrails[i];
        ghost.material.opacity -= 0.002; ghost.scale.x += 0.005; ghost.scale.z += 0.005;
        if (ghost.material.opacity <= 0) {
            scene.remove(ghost); ghost.material.dispose(); ghostTrails.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

window.onload = () => {
    animate();
    GCM_OS.init();
    setInterval(() => GCM_OS.init(), 5000);
    
    if (window.TemporalScrubber) {
        TemporalScrubber.init((index) => {
            if (BootSys.active) return; // Prevent scrubbing during boot
            
            const snap = AuditPersistence.getSnapshot(index);
            const prevSnap = AuditPersistence.getSnapshot(index - 1);
            
            if (snap) {
                GCM_OS.isPlayback = true;
                if (prevSnap) {
                    meshes.forEach((mesh, i) => {
                        mesh.scale.y = Math.max(0.1, (prevSnap.vector[i] / 255) * 15);
                    });
                }
                TemporalScrubber.updateTimeDisplay(snap.timestamp);
                GCM_OS.sync(snap.vector, snap.metadata, snap.sigma);
            } else {
                GCM_OS.isPlayback = false; // Reset if scrubber fails
                TemporalScrubber.updateTimeDisplay(null);
            }
        });
    }
};
