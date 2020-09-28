import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.120.1/build/three.module.js";

import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.120.1/examples/jsm/loaders/GLTFLoader.min.js";

import * as CANNON from "https://cdn.jsdelivr.net/npm/cannon-es@0.15.1/dist/cannon-es.js";

let prevInterval = 0;

let loaded = 0;

let lastLap = "00:00.000";

let lastSector = 0;

let currentLap = 1;

const restartModalButton = document.getElementById("restart_button");
const submitResult = document.getElementById("submit_result");
const resultTime = document.getElementById("result_time");

const stopWatch = new clsStopwatch();

const stopWatchText = document.getElementById("stopwatch");
const throttleText = document.getElementById("throttle");
const steeringText = document.getElementById("steering");
const restartButton = document.getElementById("restart");
const lapText = document.getElementById("lap");

let raceStarted = false;

let world;
let planeBody;
let chassisBody;
let vehicle;
let wheelBodies = [];

const randomColors = [
  0xff0000,
  0x0000ff,
  0x00ff00,
  0xff3500,
  0x000000,
  0xffffff,
];

let forwardAxis = 0.0,
  backwardAxis = 0.0,
  leftAxis = 0.0,
  rightAxis = 0.0;

const maxSteerVal = 0.5;
const maxForce = 500;

let turnAxis = 0.0;
let engineAxis = 0.0;

let drawingSurface = document.getElementById("threeJS");
let copySIZE = document.getElementById("copySIZE");

let scene, camera, cameraRig, cameraTar, renderer;

let wheelMeshes = [];
let carGroup;

const lights = new Array(5);

restartButton.addEventListener("click", () => restartRace());
restartModalButton.addEventListener("click", () => restartRace());

export function getLapTime() {
  return lastLap;
}

function restartRace() {
  if (renderer) {
    raceStarted = false;
    stopWatch.reset();
    lastSector = 0;
    currentLap = 1;
    lapText.textContent = currentLap + "/2";
    lights.forEach((material) => {
      material.emissive.set(0x000000);
    });
    submitResult.classList.remove("is-active");
    chassisBody.position.set(-0.6, 2, 35);
    chassisBody.quaternion.set(0.5, 0.5, -0.5, 0.5);
    chassisBody.velocity.set(0, 0, 0);
    chassisBody.angularVelocity.set(0, 0, 0);
    raceStart();
  }
}

export function beginLoading() {
  initCannon();
  initThree();
  setRenderSize();
  animate();
}

function raceStart() {
  let i = 0;
  window.clearInterval(prevInterval);
  prevInterval = setIntervalX(
    () => {
      if (i < 5) {
        lights[i].emissive.set(0xff0000);
        i++;
      } else {
        raceStarted = true;
        stopWatch.start();
        console.log("It's lights out and away we go!");
        lights.forEach((material) => {
          material.emissive.set(0x000000);
        });
      }
    },
    1000,
    6
  );
}

function increaseLoad() {
  loaded += 25;
  console.log("Loaded " + loaded + "%");

  if (loaded == 100) {
    document.getElementById("hide_on_load").style.display = "none";
    document.getElementById("hud").style.visibility = "visible";
    drawingSurface.style.visibility = "visible";
    console.log("Done loading all assets");
    raceStart();
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (loaded == 100) {
    world.step(1 / 60);
  }

  if (raceStarted) {
    engineAxis = lerp(engineAxis, forwardAxis - backwardAxis, 0.8);
    vehicle.applyEngineForce(engineAxis * maxForce, 2);
    vehicle.applyEngineForce(engineAxis * maxForce, 3);

    turnAxis = lerp(turnAxis, leftAxis - rightAxis, 0.25);

    vehicle.setSteeringValue(turnAxis * maxSteerVal, 0);
    vehicle.setSteeringValue(turnAxis * maxSteerVal, 1);

    stopWatchText.textContent = formatTime(stopWatch.time());
    throttleText.textContent = Math.round(engineAxis * 100);
    steeringText.textContent = Math.round(-turnAxis * 45);
  } else {
    vehicle.applyEngineForce(0, 2);
    vehicle.applyEngineForce(0, 3);

    vehicle.setSteeringValue(0, 0);
    vehicle.setSteeringValue(0, 1);

    stopWatchText.textContent = "00:00.000";
    throttleText.textContent = "0";
    steeringText.textContent = "0";
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

  if (renderer) {
    updateDynamic();
    renderer.render(scene, camera);
  }
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function setRenderSize() {
  if (renderer) {
    camera.aspect = copySIZE.clientWidth / copySIZE.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(copySIZE.clientWidth, copySIZE.offsetHeight);
  }
}

window.onresize = () => {
  setRenderSize();
};

function initCannon() {
  world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.gravity.set(0, -9.8, 0);
  //world.defaultContactMaterial.friction = 0;

  let colliderBody = new CANNON.Body({
    static: true,
  });

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

  fetch("assets/trackers.json")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((collider, i) => {
        let dim = collider.dim;
        let pos = collider.pos;
        let quat = collider.quat;

        let trackerBody = new CANNON.Body({
          static: true,
        });

        let trackerShape = new CANNON.Box(
          new CANNON.Vec3(dim[0] / 2, dim[1] / 4, dim[2] / 4)
        );
        trackerShape.collisionResponse = false;
        let trackerQuat = new CANNON.Quaternion(
          quat[1],
          quat[2],
          quat[3],
          quat[0]
        );
        let trackerPos = new CANNON.Vec3(pos[0], pos[1], pos[2]);
        trackerBody.addShape(trackerShape, trackerPos, trackerQuat);
        world.addBody(trackerBody);
        trackerBody.quaternion.setFromAxisAngle(
          new CANNON.Vec3(-1, 0, 0),
          Math.PI / 2
        );
        trackerBody.addEventListener("collide", function (e) {
          console.log("Vehicle passed sector " + (i + 1));
          if (lastSector == 1 && i == 0) {
            if (currentLap == 1) {
              currentLap++;
              lapText.textContent = currentLap + "/2";
            } else {
              stopWatch.stop();
              raceStarted = false;
              const formattedTime = formatTime(stopWatch.time());
              stopWatchText.textContent = formattedTime;
              resultTime.textContent = formattedTime;
              lastLap = formattedTime;
              submitResult.classList.add("is-active");
            }
          }
          lastSector = i;
        });
      });
    });

  const groundMaterial = new CANNON.Material("groundMaterial");
  const wheelMaterial = new CANNON.Material("wheelMaterial");

  const wheelGroundContactMaterial = (window.wheelGroundContactMaterial = new CANNON.ContactMaterial(
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
  chassisBody = new CANNON.Body({
    mass: 150,
  });
  chassisBody.addShape(chassisShape);
  chassisBody.position.set(-0.6, 2, 35);
  chassisBody.quaternion.set(0.5, 0.5, -0.5, 0.5);

  let planeShape = new CANNON.Box(new CANNON.Vec3(150, 0.1, 150));
  planeBody = new CANNON.Body({
    static: true,
  });
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

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.tonMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  setup(renderer);

  let gltfLoaderCar = new GLTFLoader().setPath("assets/");

  const randomColor =
    randomColors[Math.floor(Math.random() * randomColors.length)];

  let carMaterial = new THREE.MeshPhysicalMaterial({
    color: randomColor,
    clearcoat: 0.8,
  });

  gltfLoaderCar.load("car_simple.gltf", function (gltf) {
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

    gltf.scene.traverse((o) => {
      if (o.isMesh && o.material.name.includes("paint")) {
        o.material = carMaterial;
      }
    });

    increaseLoad();
  });

  let gltfLoaderTrack = new GLTFLoader().setPath("assets/");

  gltfLoaderTrack.load("track.gltf", function (gltf) {
    gltf.scene.position.set(0, 2, 0);

    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        if (o.name.includes("collider")) {
          let bbox = new CANNON.Box(
            new CANNON.Vec3(o.scale.x, o.scale.y / 8, o.scale.z / 4)
          );
          let bbody = new CANNON.Body({
            static: true,
          });
          bbody.addShape(bbox);
          bbody.position.copy(o.position);
          bbody.quaternion.copy(o.quaternion);
          //bbody.addShape(bbox);
          world.addBody(bbody);

          o.visible = false;
        } else if (
          o.name.includes("light") &&
          o.material.name.includes("emit")
        ) {
          let lightMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            emissive: 0x000000,
          });
          o.material = lightMat;
          let match = o.name.match(/(\d+)/);
          lights[parseInt(match[0]) - 1] = lightMat;
        }
      }
    });

    scene.add(gltf.scene);

    increaseLoad();
  });

  let gltfTire = new GLTFLoader().setPath("assets/");

  gltfTire.load("tire.gltf", function (gltf) {
    vehicle.wheelInfos.forEach((_, i) => {
      console.log(gltf.scene);
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
  pmremGenerator.compileCubemapShader();

  new THREE.CubeTextureLoader()
    .setPath("assets/quattro/")
    .load(
      ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
      function (texture) {
        let envMap = pmremGenerator.fromCubemap(texture).texture;

        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        increaseLoad();
      }
    );

  drawingSurface.appendChild(renderer.domElement);
}

const onKeyDown = function (event) {
  switch (event.keyCode) {
    case 38: // up
      event.preventDefault();
    case 87: // w
      forwardAxis = 1.0;
      break;

    case 37: // left
      event.preventDefault();
    case 65: // a
      leftAxis = 1.0;
      break;

    case 40: // down
      event.preventDefault();
    case 83: // s
      backwardAxis = 1.0;
      break;

    case 39: // right
      event.preventDefault();
    case 68: // d
      rightAxis = 1.0;
      break;
  }
};

const onKeyUp = function (event) {
  switch (event.keyCode) {
    case 38: // up
      event.preventDefault();
    case 87: // w
      forwardAxis = 0.0;
      break;

    case 37: // left
      event.preventDefault();
    case 65: // a
      leftAxis = 0.0;
      break;

    case 40: // down
      event.preventDefault();
    case 83: // s
      backwardAxis = 0.0;
      break;

    case 39: // right
      event.preventDefault();
    case 68: // d
      rightAxis = 0.0;
      break;
  }
};

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
