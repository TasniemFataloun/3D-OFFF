import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import GUI from "lil-gui";
import gsap from "gsap";

/* Canvas */
const canvas = document.querySelector("canvas.webgl");

/* Scene */
const scene = new THREE.Scene();

/* Models */
const gltfLoader = new GLTFLoader();

let marge, modelChild;
let gsapAnimation;

gltfLoader.load("models/mannetje/mannetje.gltf", (gltf) => {
  marge = gltf;
  gltf.scene.position.set(2, 2, 2.5);
  gltf.scene.rotation.set(0, -0.3, 0);
  //scale
  gltf.scene.scale.set(0.9, 0.9, 0.9);
  scene.add(gltf.scene);

  // Animation gsap

  gsapAnimation = gsap.to(gltf.scene.position, {
    y: 1.75,
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
});

gltfLoader.load("models/blauw/blauw.gltf", (gltf) => {
  modelChild = gltf;
  gltf.scene.position.set(2, 2, 2.5);
  gltf.scene.rotation.set(0, 0.1, 0);
  gltf.scene.scale.set(1.1, 1.1, 1.1);
  scene.add(gltf.scene);

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
});

/* Lights*/
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

//light 1
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(-9, 4, -4);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

directionalLightHelper.visible = false;

//light 2
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(3, 4, 1);
scene.add(directionalLight2);

const directionalLightHelper2 = new THREE.DirectionalLightHelper(
  directionalLight2,
  0.2
);
scene.add(directionalLightHelper2);

directionalLightHelper2.visible = false;


//light 3 
const directionalLight3 = new THREE.DirectionalLight(0xff9000, 2);
directionalLight3.position.set(1, 4, 3);
scene.add(directionalLight3);

const directionalLightHelper3 = new THREE.DirectionalLightHelper(
  directionalLight3,
  0.2
);
scene.add(directionalLightHelper3);

directionalLightHelper3.visible = false;


//light 4
const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight4.position.set(1, -4, -3);
scene.add(directionalLight4);

const directionalLightHelper4 = new THREE.DirectionalLightHelper(
  directionalLight4,
  0.2
);
scene.add(directionalLightHelper4);

directionalLightHelper4.visible = false;

//shadows
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 30;directionalLight.shadow.radius = 2;


/*  GUI */
const gui = new GUI({
  width: 400,
  title: "Debug Panel",
  closeFolders: true,
});
gui.hide();

gui.show(false);

document.addEventListener("keydown", (event) => {
  if (event.key === "p") {
    gui.show(gui._hidden);
  }
});

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

//model position 
const modelPosition = gui.addFolder("Model position");
modelPosition.add(debugParams, "xPosition", -10, 10).onChange((value) => {
  marge.scene.position.x = value;
  modelChild.scene.position.x = value;
});

//y position controller
const yPositionController = modelPosition.add(
  debugParams,
  "yPosition",
  -10,
  10
);
yPositionController.onChange((value) => {
  gsapAnimation.pause();
  marge.scene.position.y = value;
  modelChild.scene.position.y = value;
});

yPositionController.onFinishChange(() => {
  if (marge.scene.position.y < 2) {
    gsapAnimation = gsap.to(marge.scene.position, {
      y: Math.PI / 8,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  } else if (marge.scene.position.y > 2 && marge.scene.position.y < 5) {
    gsapAnimation = gsap.to(marge.scene.position, {
      y: 3,
      yoyo: true,
      duration: 2,
      repeat: -1,
      ease: "sine.inOut",
    });
  } else {
    gsapAnimation = gsap.to(marge.scene.position, {
      y: 2,
      yoyo: true,
      duration: 2,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
});

modelPosition.add(debugParams, "zPosition", -10, 10).onChange((value) => {
  marge.scene.position.z = value;
  modelChild.scene.position.z = value;
});

//light positions
const lightPosition = gui.addFolder("Light");
lightPosition.add(debugParams, "lightXPosition", -20, 20).onChange((value) => {
  directionalLight.position.x = value;
});
lightPosition.add(debugParams, "lightYPosition", -20, 20).onChange((value) => {
  directionalLight.position.y = value;
});
lightPosition.add(debugParams, "lightZPosition", -20, 20).onChange((value) => {
  directionalLight.position.z = value;
});

//light helpers
lightPosition.add(debugParams, "directionalLightHelper").onChange((value) => {
  directionalLightHelper.visible = value;
  directionalLightHelper2.visible = value;
  directionalLightHelper3.visible = value;
  directionalLightHelper4.visible = value;
});

//animations controller
const animations = gui.addFolder("Animations");
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

animations
  .add({ stop: () => gsap.globalTimeline.clear() }, "stop")
  .name("Remove animations");

//add animation speed to gui for every model
animations
  .add({ speed: 1 }, "speed", 0.1, 2, 0.01)
  .onChange((value) => {
    gsap.globalTimeline.timeScale(value);
  })
  .name("Animation speed");

//hide models 
const hideModels = gui.addFolder("Hide models");

hideModels
  .add(debugParams, "hideModels")
  .onChange((value) => {
    modelChild.scene.visible = !value;
  })
  .name("Hide marge");


hideModels
  .add(debugParams, "hideModels")
  .onChange((value) => {
    marge.scene.visible = !value;
  })
  .name("Hide child");


/*Sizes*/ 
const sizes = {
  width: 800,
  height: 800,
};

/* Camera */ 
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(20, 4, 0);
scene.add(camera);

/* Renderer */
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
//enable zoom
controls.enableZoom = false;

// Animation loop
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
