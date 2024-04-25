import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/* Models */
const gltfLoader = new GLTFLoader();

let mannetje, mannetje2;

gltfLoader.load("models/mannetje/mannetje.gltf", (gltf) => {
  mannetje = gltf;
  gltf.scene.position.set(2, 2, 2.5);
  gltf.scene.rotation.set(0, -0.1, 0);
  scene.add(gltf.scene);

  
  // Animation gsap
  gsap.to(gltf.scene.position, {
    y: 1.75,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
});

gltfLoader.load("models/blauw/blauw.gltf", (gltf) => {
  mannetje2 = gltf;
  //gsap animation
  const childObject = gltf.scene.children[6];
  gsap.from(childObject.position, {
    z: 0,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  gsap.fromTo(
    childObject.position,
    {
      z: -0.05,
    },
    {
      z: 0.05,
      duration: 2.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    }
  );

  gltf.scene.position.set(2, 2, 2.5);
  gltf.scene.rotation.set(0, 0.1, 0);
  scene.add(gltf.scene);
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);
//directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-9, 4, -4);
scene.add(directionalLight);
//light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);
//hide
directionalLightHelper.visible = false;

//directional light2 white
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(3, 4, 1);
scene.add(directionalLight2);
//light helper
const directionalLightHelper2 = new THREE.DirectionalLightHelper(
  directionalLight2,
  0.2
);
scene.add(directionalLightHelper2);
//hide
directionalLightHelper2.visible = false;
//directional light3
const directionalLight3 = new THREE.DirectionalLight(0xff9000, 2);
directionalLight3.position.set(1, 4, 3);
scene.add(directionalLight3);
//light helper
const directionalLightHelper3 = new THREE.DirectionalLightHelper(
  directionalLight3,
  0.2
);
scene.add(directionalLightHelper3);
//hide
directionalLightHelper3.visible = false;
//directional light4 --> onder kleur 0xff9000
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight4.position.set(1, -4, -3);
scene.add(directionalLight4);
//light helper
const directionalLightHelper4 = new THREE.DirectionalLightHelper(
  directionalLight4,
  0.2
);
scene.add(directionalLightHelper4);
//hide
directionalLightHelper4.visible = false;

/*  GUI */
const gui = new GUI({
  width: 400,
  title: "Debug Panel",
  closeFolders: true,
});
gui.hide();

// GUI parameters
const debugParams = {
  yPosition: 0,
  xPosition: 0,
  zPosition: 0,
  lightXPosition: 0,
  lightYPosition: 0,
  lightZPosition: 0,
  directionalLightHelper: false,
  hideModels: false,
};

//model position and folder
const modelPosition = gui.addFolder("Model position");
modelPosition.add(debugParams, "yPosition", -10, 10).onChange((value) => {
  mannetje.scene.position.y = value;
  mannetje2.scene.position.y = value;
});
modelPosition.add(debugParams, "xPosition", -10, 10).onChange((value) => {
  mannetje.scene.position.x = value;
  mannetje2.scene.position.x = value;
});
modelPosition.add(debugParams, "zPosition", -10, 10).onChange((value) => {
  mannetje.scene.position.z = value;
  mannetje2.scene.position.z = value;
});
//light positions and folder
const lightPosition = gui.addFolder("Light position");
lightPosition.add(debugParams, "lightYPosition", -20, 20).onChange((value) => {
  directionalLight.position.y = value;
});
lightPosition.add(debugParams, "lightXPosition", -20, 20).onChange((value) => {
  directionalLight.position.x = value;
});
lightPosition.add(debugParams, "lightZPosition", -20, 20).onChange((value) => {
  directionalLight.position.z = value;
});

//show light helpers
const lightHelpers = gui.addFolder("Light helpers");
lightHelpers.add(debugParams, "directionalLightHelper").onChange((value) => {
  directionalLightHelper.visible = value;
  directionalLightHelper2.visible = value;
  directionalLightHelper3.visible = value;
  directionalLightHelper4.visible = value;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "p" || event.key === "P") {
    gui.visible ? gui.hide() : gui.show();
  }
});

//hide models
gui.add(debugParams, "hideModels").onChange((value) => {
  mannetje.scene.visible = !value;
  mannetje2.scene.visible = !value;
});

//stop animation make folder animations
const animations = gui.addFolder("Animations");
animations
  .add({ stop: () => gsap.globalTimeline.clear() }, "stop")
  .name("Stop animations");

animations
  .add({ pause: () => gsap.globalTimeline.pause() }, "pause")
  .name("Pause animations");

//resume animation
animations
  .add({ pause: () => gsap.globalTimeline.resume() }, "pause")
  .name("Resume animations");
animations
  .add({ restart: () => gsap.globalTimeline.restart() }, "restart")
  .name("Restart animations");

// Sizes
const sizes = {
  width: 800,
  height: 800,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(20, 4, 0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, //transparency
  antialias: true, //smoothness
});
//size and pixel ratio
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 4));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
//enable zoom only z-as

// Animation loop
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
