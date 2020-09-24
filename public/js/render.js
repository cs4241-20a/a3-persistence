import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/GLTFLoader.min.js";

import { AnimationMixer } from "https://cdn.jsdelivr.net/npm/three@0.120.1/src/animation/AnimationMixer.min.js";

import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/RGBELoader.min.js";

// let pmremGenerator = new THREE.PMREMGenerator(renderer);
// pmremGenerator.compileEquirectangularShader();

// new RGBELoader()
//   .setDataType(THREE.UnsignedByteType)
//   .setPath("assets/")
//   .load("quattro_canti_1k.hdr", function (texture) {
//     let envMap = pmremGenerator.fromEquirectangular(texture).texture;

//     scene.environment = envMap;

//     texture.dispose();
//     pmremGenerator.dispose();
//   });

// let gltfLoader = new GLTFLoader().setPath("assets/");

// let carMaterial = new THREE.MeshPhysicalMaterial({
//   color: 0xff0000,
//   clearcoat: 0.8,
// });

// gltfLoader.load("animated.gltf", function (gltf) {
//   mixer = new AnimationMixer(gltf.scene);
//   gltf.animations.forEach((clip) => {
//     const action = mixer.clipAction(clip);
//     action.timeScale = 3.0;
//     action.play();
//   });

//   let shadowAlpha = new THREE.TextureLoader().load("assets/shadow_plane.png");
//   shadowAlpha.encoding = THREE.sRGBEncoding;

//   let shadowMaterial = new THREE.MeshBasicMaterial({
//     color: 0x000000,
//     alphaMap: shadowAlpha,
//     transparent: true,
//   });

//   gltf.scene.traverse((o) => {
//     if (o.isMesh) {
//       if (o.material.name === "shadow_plane") {
//         o.material = shadowMaterial;
//         o.rotation.y = Math.PI;
//         o.position.z = -0.25;
//       } else if (o.material.name === "paint") {
//         o.material = carMaterial;
//       } else if (o.name === "Cylinder_0") {
//         o.position.z = -0.3;
//       }
//     }
//   });

//   scene.add(gltf.scene);
//   document.getElementById("hide_on_load").style.display = "none";
// });

let world;
let wheelBodies = [];
let chassisBody;
let vehicle;

let drawingSurface, copySIZE;
drawingSurface = document.getElementById("threeJS");
copySIZE = document.getElementById("copySIZE");

let scene, camera, renderer, mixer;

let wheelMeshes = [];
let geometry;
let material;
let mesh;

initCannon();
initThree();

document.getElementById("hide_on_load").style.display = "none";

let clock = new THREE.Clock();

(function animate() {
  let delta = clock.getDelta();
  //   if (mixer) {
  //     mixer.update(delta);
  //   }

  world.step(1 / 60);

  mesh.position.copy(chassisBody.position);
  mesh.quaternion.copy(chassisBody.quaternion);

  wheelMeshes.forEach((wheelMesh, i) => {
    wheelMesh.position.copy(wheelBodies[i].position);
    wheelMesh.quaternion.copy(wheelBodies[i].quaternion);
  });

  //   let x = Math.sin(clock.getElapsedTime() / 3.0) * 5.0;
  //   let y = Math.cos(clock.getElapsedTime() / 5.0) * 2.0 + 3.0;
  //   let z = 10.0;

  //   camera.position.set(x, y, z);
  //   camera.lookAt(0.0, 0.25, 0.0);

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
})();

function setRenderSize() {
  camera.aspect = copySIZE.clientWidth / copySIZE.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(copySIZE.clientWidth, copySIZE.offsetHeight);
}

setRenderSize();

window.onresize = () => {
  setRenderSize();
};

// pcolor_input.onchange = () => {
//   switch (pcolor_input.value) {
//     case "red":
//       carMaterial.color.setHex(0xff0000);
//       break;
//     case "blue":
//       carMaterial.color.setHex(0x0000ff);
//       break;
//     case "green":
//       carMaterial.color.setHex(0x00ff00);
//       break;
//     case "orange":
//       carMaterial.color.setHex(0xff3500);
//       break;
//     case "black":
//       carMaterial.color.setHex(0x000000);
//       break;
//     case "white":
//       carMaterial.color.setHex(0xffffff);
//       break;
//   }
// };

function initCannon() {
  world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.gravity.set(0, -9.8, 0);
  world.defaultContactMaterial.friction = 0;

  let groundMaterial = new CANNON.Material("groundMaterial");
  let wheelMaterial = new CANNON.Material("wheelMaterial");

  let wheelGroundContactMaterial = (window.wheelGroundContactMaterial = new CANNON.ContactMaterial(
    wheelMaterial,
    groundMaterial,
    {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000,
    }
  ));

  let options = {
    radius: 1.5,
    directionLocal: new CANNON.Vec3(0, 0, -1),
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 0, 1),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  world.addContactMaterial(wheelGroundContactMaterial);

  let chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 1));
  chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 5, 0);
  chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2);
  chassisBody.angularVelocity.set(0, 0, 0.5);

  let planeShape = new CANNON.Box(new CANNON.Vec3(10, 0.1, 10));
  let planeBody = new CANNON.Body({ static: true });
  planeBody.addShape(planeShape);

  world.addBody(chassisBody);
  world.addBody(planeBody);

  vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
  });

  options.chassisConnectionPointLocal.set(1, 1, 0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(1, -1, 0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1, 1, 0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1, -1, 0);
  vehicle.addWheel(options);

  vehicle.addToWorld(world);

  vehicle.wheelInfos.forEach((wheel) => {
    let cylinderShape = new CANNON.Cylinder(
      wheel.radius,
      wheel.radius,
      wheel.radius / 2,
      20
    );
    let wheelBody = new CANNON.Body({ mass: 1 });
    let q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
    wheelBodies.push(wheelBody);
    world.addBody(wheelBody);
  });

  world.addEventListener("postStep", () => {
    vehicle.wheelInfos.forEach((wheel, i) => {
      vehicle.updateWheelTransform(i);
      let t = wheel.worldTransform;
      wheelBodies[i].position.copy(t.position);
      wheelBodies[i].quaternion.copy(t.quaternion);
    });
  });
}

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(20, 1.0, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.tonMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  geometry = new THREE.BoxGeometry(2, 1, 1);
  material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  mesh = new THREE.Mesh(geometry, material);

  let floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
  let floorMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  let floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

  vehicle.wheelInfos.forEach((wheel) => {
    var geometry = new THREE.CylinderGeometry(
      wheel.radius,
      wheel.radius,
      wheel.radius / 2,
      20
    );
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var cylinder = new THREE.Mesh(geometry, material);
    wheelMeshes.push(cylinder);
    scene.add(cylinder);
  });

  scene.add(mesh);
  scene.add(floorMesh);

  camera.position.set(10, 10, 15);
  camera.lookAt(0.0, 0.25, 0.0);

  drawingSurface.appendChild(renderer.domElement);
}
