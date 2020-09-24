import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/GLTFLoader.min.js";

import { AnimationMixer } from "https://cdn.jsdelivr.net/npm/three@0.120.1/src/animation/AnimationMixer.min.js";

import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/RGBELoader.min.js";

import { ConvexHull } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/math/ConvexHull.js";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.15.1/dist/cannon-es.js";

let world;
let wheelBodies = [];
let chassisBody;
let vehicle;
let planeBody;

let drawingSurface, copySIZE;
drawingSurface = document.getElementById("threeJS");
copySIZE = document.getElementById("copySIZE");

let scene, camera, cameraRig, cameraTar, renderer, mixer;

let wheelMeshes = [];
let carGroup;

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

  if (carGroup) {
    let temp = new THREE.Vector3();
    temp = temp.setFromMatrixPosition(cameraRig.matrixWorld);

    let tar = new THREE.Vector3();
    tar = tar.setFromMatrixPosition(cameraTar.matrixWorld);

    carGroup.position.copy(chassisBody.position);
    carGroup.quaternion.copy(chassisBody.quaternion);
    camera.position.lerp(temp, 0.2);
    camera.lookAt(tar);
  }

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
  //world.defaultContactMaterial.friction = 0;

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
    radius: 0.3,
    directionLocal: new CANNON.Vec3(0, 0, 1),
    suspensionStiffness: 50,
    suspensionRestLength: 0.3,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, 1, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  world.addContactMaterial(wheelGroundContactMaterial);

  let chassisShape = new CANNON.Box(new CANNON.Vec3(4, 1.5, 0.25));
  chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(0, 5, 0);
  chassisBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    Math.PI / 2
  );

  let planeShape = new CANNON.Box(new CANNON.Vec3(150, 0.1, 150));
  planeBody = new CANNON.Body({ static: true });
  planeBody.position.set(0, 1, 0);
  planeBody.addShape(planeShape);

  world.addBody(chassisBody);
  world.addBody(planeBody);

  vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
  });

  options.chassisConnectionPointLocal.set(1.125, 0.7, -0.1);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(1.125, -0.7, -0.1);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1.8, 0.7, -0.1);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1.8, -0.7, -0.1);
  vehicle.addWheel(options);

  vehicle.addToWorld(world);

  vehicle.wheelInfos.forEach((wheel) => {
    let cylinderShape = new CANNON.Cylinder(
      wheel.radius,
      wheel.radius,
      wheel.radius,
      20
    );
    let wheelBody = new CANNON.Body({
      mass: 0,
    });
    wheelBody.type = CANNON.Body.KINEMATIC;
    wheelBody.collisionFilterGroup = 0; // turn off collisions
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
  camera = new THREE.PerspectiveCamera(40, 1.0, 0.1, 1000);
  camera.position.set(10, 10, 10);
  camera.lookAt(0.0, 0.25, 0.0);

  let colliders = new THREE.Group();
  let colliderBody = new CANNON.Body({ static: true });
  let boxMat = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true
  });

  fetch("assets/colliders.json")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((collider) => {
        let dim = collider.dim;
        let pos = collider.pos;
        let quat = collider.quat;

        let colliderShape = new CANNON.Box(new CANNON.Vec3(dim[0] / 2, dim[1] / 4, dim[2] / 4));
        let colliderQuat = new CANNON.Quaternion(quat[1], quat[2], quat[3], quat[0]);
        let colliderPos = new CANNON.Vec3(pos[0], pos[1], pos[2]);
        colliderBody.addShape(colliderShape, colliderPos, colliderQuat);

        let boxGeo = new THREE.BoxGeometry(dim[0], dim[1], dim[2]);
        let boxMesh = new THREE.Mesh(boxGeo, boxMat);
        colliders.add(boxMesh);
        boxMesh.position.set(pos[0], pos[1], pos[2]);
        boxMesh.quaternion.set(quat[1], quat[2], quat[3], quat[0]);
      });
    });

  scene.add(colliders);
  world.addBody(colliderBody);
  colliders.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  colliderBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.tonMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  let gltfLoaderCar = new GLTFLoader().setPath("assets/");

  gltfLoaderCar.load("car_body.gltf", function (gltf) {
    carGroup = new THREE.Group();

    cameraRig = new THREE.Object3D();
    cameraRig.position.set(-6, 0, -1.5);

    cameraTar = new THREE.Object3D();
    cameraTar.position.set(0, 0, -0.5);

    gltf.scene.position.set(0, 0, 2.5);
    gltf.scene.rotation.set(0, Math.PI / 2, -Math.PI / 2);
    carGroup.add(gltf.scene);
    carGroup.add(cameraRig);
    carGroup.add(cameraTar);
    scene.add(carGroup);
  });

  let gltfLoaderTrack = new GLTFLoader().setPath("assets/");

  gltfLoaderTrack.load("track_simple.gltf", function (gltf) {
    gltf.scene.position.set(0, 2, 0);

    gltf.scene.traverse((o) => {
      if (o.name.includes("collider") && o.isMesh) {
        console.log(o);
        let bbox = new CANNON.Box(
          new CANNON.Vec3(o.scale.x, o.scale.y / 8, o.scale.z / 4)
        );
        let bbody = new CANNON.Body({ static: true });
        bbody.addShape(bbox);
        bbody.position.copy(o.position);
        bbody.quaternion.copy(o.quaternion);
        //bbody.addShape(bbox);
        world.addBody(bbody);

        o.visible = false;
      }
    });

    scene.add(gltf.scene);
  });

  vehicle.wheelInfos.forEach((wheel) => {
    var geometry = new THREE.CylinderGeometry(
      wheel.radius,
      wheel.radius,
      wheel.radius,
      20
    );
    var material = new THREE.MeshPhysicalMaterial({ color: 0x131313 });
    var cylinder = new THREE.Mesh(geometry, material);
    wheelMeshes.push(cylinder);
    scene.add(cylinder);
  });

  let pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath("assets/")
    .load("quattro_canti_1k.hdr", function (texture) {
      let envMap = pmremGenerator.fromEquirectangular(texture).texture;

      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });

  drawingSurface.appendChild(renderer.domElement);
}

document.onkeydown = handler;
document.onkeyup = handler;

var maxSteerVal = 0.5;
var maxForce = 700;
var brakeForce = 200;
function handler(event) {
  var up = event.type == "keyup";

  if (!up && event.type !== "keydown") {
    return;
  }

  vehicle.setBrake(0, 0);
  vehicle.setBrake(0, 1);
  vehicle.setBrake(0, 2);
  vehicle.setBrake(0, 3);

  switch (event.keyCode) {
    case 87: // forward
      vehicle.applyEngineForce(up ? 0 : maxForce, 2);
      vehicle.applyEngineForce(up ? 0 : maxForce, 3);
      break;

    case 83: // backward
      vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
      vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
      break;

    case 66: // b
      vehicle.setBrake(brakeForce, 0);
      vehicle.setBrake(brakeForce, 1);
      vehicle.setBrake(brakeForce, 2);
      vehicle.setBrake(brakeForce, 3);
      break;

    case 68: // right
      vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0);
      vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1);
      break;

    case 65: // left
      vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0);
      vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1);
      break;
  }
}
