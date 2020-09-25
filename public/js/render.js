import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/GLTFLoader.min.js";

import { AnimationMixer } from "https://cdn.jsdelivr.net/npm/three@0.120.1/src/animation/AnimationMixer.min.js";

import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/RGBELoader.min.js";

import { ConvexHull } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/math/ConvexHull.js";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.15.1/dist/cannon-es.js";

let loaded = 0;

let world;
let wheelBodies = [];
let chassisBody;
let vehicle;
let planeBody;

let forwardAxis = 0.0,
  backwardAxis = 0.0,
  leftAxis = 0.0,
  rightAxis = 0.0;

let engineAxis = 0.0,
  turnAxis = 0.0;

let drawingSurface, copySIZE;
drawingSurface = document.getElementById("threeJS");
copySIZE = document.getElementById("copySIZE");

let scene, camera, cameraRig, cameraTar, renderer, mixer;

let wheelMeshes = [];
let carGroup;

let lights = new Array(5);

initCannon();
initThree();

document.getElementById("hide_on_load").style.display = "none";

let clock = new THREE.Clock();

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

       callback();

       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
}

function increaseLoad() {
    loaded += 25;
    console.log(loaded + "%");


    let i = 0;
    if(loaded == 100) {
        console.log("Done loading all assets");
        setIntervalX(() => {
            lights[i].emissive.set(0xff0000);
            i++;
        }, 1000, 5);
    }
}

(function animate() {
  let delta = clock.getDelta();
  //   if (mixer) {
  //     mixer.update(delta);
  //   }

  if(loaded == 100) {
    world.step(1 / 60);
  }

  if (carGroup) {
    let temp = new THREE.Vector3();
    temp = temp.setFromMatrixPosition(cameraRig.matrixWorld);

    let tar = new THREE.Vector3();
    tar = tar.setFromMatrixPosition(cameraTar.matrixWorld);

    carGroup.position.copy(chassisBody.position);
    carGroup.quaternion.copy(chassisBody.quaternion);
    camera.position.lerp(temp, 0.5);
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

  if (vehicle) {
    vehicle.applyEngineForce((forwardAxis - backwardAxis) * maxForce, 2);
    vehicle.applyEngineForce((forwardAxis - backwardAxis) * maxForce, 3);

    turnAxis = lerp(turnAxis, leftAxis - rightAxis, 0.25);

    vehicle.setSteeringValue(turnAxis * maxSteerVal, 0);
    vehicle.setSteeringValue(turnAxis * maxSteerVal, 1);
  }

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
})();

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

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
    radius: 0.32,
    directionLocal: new CANNON.Vec3(0, 0, 1),
    suspensionStiffness: 50,
    suspensionRestLength: 0.3,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(0, -1, 0),
    chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  world.addContactMaterial(wheelGroundContactMaterial);

  let chassisShape = new CANNON.Box(new CANNON.Vec3(4, 1.5, 0.25));
  chassisBody = new CANNON.Body({ mass: 150 });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(-0.6, 5, 35);
  chassisBody.quaternion.set(0.5, 0.5, -0.5, 0.5);

  let planeShape = new CANNON.Box(new CANNON.Vec3(150, 0.1, 150));
  planeBody = new CANNON.Body({ static: true });
  planeBody.position.set(0, 1, 0);
  planeBody.addShape(planeShape);

  world.addBody(chassisBody);
  world.addBody(planeBody);

  vehicle = new CANNON.RaycastVehicle({
    chassisBody: chassisBody,
  });

  options.chassisConnectionPointLocal.set(1.125, 0.7, 0.0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(1.125, -0.7, 0.0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1.8, 0.7, 0.0);
  vehicle.addWheel(options);

  options.chassisConnectionPointLocal.set(-1.8, -0.7, 0.0);
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

  let colliderBody = new CANNON.Body({ static: true });

  fetch("assets/colliders.json")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((collider) => {
        let dim = collider.dim;
        let pos = collider.pos;
        let quat = collider.quat;

        let colliderShape = new CANNON.Box(
          new CANNON.Vec3(dim[0] / 2, dim[1] / 4, dim[2] / 4)
        );
        let colliderQuat = new CANNON.Quaternion(
          quat[1],
          quat[2],
          quat[3],
          quat[0]
        );
        let colliderPos = new CANNON.Vec3(pos[0], pos[1], pos[2]);
        colliderBody.addShape(colliderShape, colliderPos, colliderQuat);
      });
    });

  world.addBody(colliderBody);
  colliderBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI / 2
  );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.tonMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  let gltfLoaderCar = new GLTFLoader().setPath("assets/");

  gltfLoaderCar.load("car_body.gltf", function (gltf) {
    carGroup = new THREE.Group();

    cameraRig = new THREE.Object3D();
    cameraRig.position.set(-6, 0, -1);

    cameraTar = new THREE.Object3D();
    cameraTar.position.set(2.0, 0, -0.2);

    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.set(0, Math.PI / 2, -Math.PI / 2);
    carGroup.add(gltf.scene);
    carGroup.add(cameraRig);
    carGroup.add(cameraTar);
    scene.add(carGroup);

    increaseLoad();
  });

  let gltfLoaderTrack = new GLTFLoader().setPath("assets/");

  gltfLoaderTrack.load("track.gltf", function (gltf) {
    gltf.scene.position.set(0, 2, 0);

    gltf.scene.traverse((o) => {
        if(o.isMesh) {
      if (o.name.includes("collider")) {
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
      } else if (o.name.includes("light") && o.material.name.includes("emit")) {
        let lightMat = new THREE.MeshStandardMaterial({color: 0x111111, emissive: 0x000000});
        o.material = lightMat;
        let match = o.name.match(/(\d+)/);
        lights[parseInt(match[0]) - 1] = lightMat;
        console.log(lights);
      }
    }
    });

    scene.add(gltf.scene);

    increaseLoad();
  });

  let gltfTire = new GLTFLoader().setPath("assets/");

  gltfTire.load("tire.gltf", function (gltf) {
    vehicle.wheelInfos.forEach((wheel, i) => {
      let group = new THREE.Group();
      let clone = gltf.scene.clone();
      group.add(clone);
      wheelMeshes.push(group);
      scene.add(group);
      if (i % 2 == 0) {
        clone.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, -1),
          Math.PI / 2
        );
      } else {
        clone.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          Math.PI / 2
        );
      }
    });

    increaseLoad();
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

      increaseLoad();
    });

  drawingSurface.appendChild(renderer.domElement);
}

var maxSteerVal = 0.5;
var maxForce = 700;
var brakeForce = 200;

var onKeyDown = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      forwardAxis = 1.0;
      break;

    case 37: // left
    case 65: // a
      leftAxis = 1.0;
      break;

    case 40: // down
    case 83: // s
      backwardAxis = 1.0;
      break;

    case 39: // right
    case 68: // d
      rightAxis = 1.0;
      break;
  }
};

var onKeyUp = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      forwardAxis = 0.0;
      break;

    case 37: // left
    case 65: // a
      leftAxis = 0.0;
      break;

    case 40: // down
    case 83: // s
      backwardAxis = 0.0;
      break;

    case 39: // right
    case 68: // d
      rightAxis = 0.0;
      break;
  }
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
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
