import React, { useEffect } from "react";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function CanvasModel({ className }) {
  useEffect(() => {
    let camera, scene, renderer, controls, mixer, clock;
    const container = document.getElementById("container");

    function init() {
      clock = new THREE.Clock();

      camera = new THREE.PerspectiveCamera(
        20,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      );
      camera.position.x = 5;
      camera.position.y = 1;
      camera.position.z = 5;

      scene = new THREE.Scene();

      // helpers
      // const axesHelper = new THREE.AxesHelper(5);
      // scene.add(axesHelper);

      // model

      new GLTFLoader()
        .setPath("static/models/")
        .load("heimerdinguer_blender.glb", function (gltf) {
          gltf.scene.position.setY(-0.5);
          gltf.scene.scale.set(0.01, 0.01, 0.01);
          scene.add(gltf.scene);
          mixer = new THREE.AnimationMixer(gltf.scene);

          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
        });

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(10);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);

      const environment = new RoomEnvironment();
      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      scene.environment = pmremGenerator.fromScene(environment).texture;

      // camera rotate
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enabled = false;
      controls.target.set(0, 0.35, 0);
      controls.update();

      window.addEventListener("resize", onWindowResize);
    }

    function onWindowResize() {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
    }

    //

    function animate() {
      requestAnimationFrame(animate);

      controls.update(); // required if damping enabled
      var delta = clock.getDelta();

      if (mixer) mixer.update(delta);
      render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    init();
    animate();
  }, []);
  return <div className={className} id="container"></div>;
}

export default CanvasModel;
