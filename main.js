import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup with improved rendering
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
document.body.appendChild(renderer.domElement);

// Enhanced lighting system
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// Sun light (main directional light)
const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.position.set(50, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
scene.add(sunLight);

// Rim light for enhanced depth
const rimLight = new THREE.DirectionalLight(0x335577, 0.25);
rimLight.position.set(-50, 0, 0);
scene.add(rimLight);

// Controls with improved settings
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.minDistance = 20;
controls.maxDistance = 100;
controls.update();

// Load textures with enhanced quality
const textureLoader = new THREE.TextureLoader();
const loadTexture = (url) => {
  const texture = textureLoader.load(url);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
};

// Earth with enhanced materials
const earthGeometry = new THREE.SphereGeometry(10, 128, 128);
const earthMaterial = new THREE.MeshPhongMaterial({
  map: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'),
  bumpMap: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'),
  bumpScale: 0.8,
  specularMap: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'),
  specular: new THREE.Color(0x444444),
  shininess: 25,
  normalMap: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'),
  normalScale: new THREE.Vector2(0.85, 0.85)
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true;
earth.receiveShadow = true;
scene.add(earth);

// Enhanced clouds with better transparency
const cloudGeometry = new THREE.SphereGeometry(10.2, 128, 128);
const cloudMaterial = new THREE.MeshPhongMaterial({
  map: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'),
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
earth.add(clouds);

// Moon with enhanced detail
const moonGeometry = new THREE.SphereGeometry(2.7, 64, 64);
const moonMaterial = new THREE.MeshPhongMaterial({
  map: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'),
  bumpMap: loadTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'),
  bumpScale: 0.4,
  shininess: 5
});

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;

// Moon orbit with realistic distance
const moonOrbit = new THREE.Object3D();
moonOrbit.add(moon);
scene.add(moonOrbit);
moon.position.x = 25;

// Enhanced star field
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xFFFFFF,
  size: 0.05,
  transparent: true,
  opacity: 0.8,
  vertexColors: true
});

const starVertices = [];
const starColors = [];
for (let i = 0; i < 20000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
  
  const intensity = Math.random() * 0.5 + 0.5;
  const color = new THREE.Color();
  color.setHSL(Math.random() * 0.2 + 0.8, 0.8, intensity);
  starColors.push(color.r, color.g, color.b);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Improved animation with realistic speeds
const EARTH_YEAR = 365.25;
const MOON_MONTH = 27.32;
const EARTH_DAY = 1;

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.1;

  // Earth rotation (one rotation per day)
  earth.rotation.y += (2 * Math.PI) / (EARTH_DAY * 1500); // Diviseur augmenté pour ralentir
  clouds.rotation.y += (2 * Math.PI) / (EARTH_DAY * 850); // Ralentir également les nuages

  // Moon orbit (one rotation per month)
  moonOrbit.rotation.y = (2 * Math.PI * time) / (MOON_MONTH * 100);
  moon.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);
}

// Improved window resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
