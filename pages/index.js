import Head from "next/head";
import Link from "next/link";

import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

import { getChampions } from "./api/getChampions";
// import capitalize from "../utils/captilize";

import styles from "../styles/Home.module.css";
import { useEffect } from "react";

export default function Home({ champions }) {
  useEffect(() => {
    let camera, scene, renderer, controls, mixer, clock;

    function init() {
      clock = new THREE.Clock();
      const container = document.getElementById("container");

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
  function RenderChampions() {
    const championsElementsArray = [];

    for (let i = 0; i < Object.keys(champions).length; i++) {
      const index = Object.keys(champions)[i];
      const champion = champions[index];
      const championCoverImage = `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/champion/${champion.id}.png`;
      // const championTitle = capitalize(champion.title);

      championsElementsArray.push(
        <Link key={i} href={`champion/${champion.id}`}>
          <div className={styles.champion}>
            <div className={styles.frame}>
              <img src={championCoverImage} />
            </div>
            <h4>{champion.name}</h4>
            {/* <p>{championTitle}</p> */}
          </div>
        </Link>
      );
    }

    return <>{championsElementsArray}</>;
  }

  return (
    <div>
      <Head>
        <title>Next and LoL API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.main_text}>
          <h1>Lorem ipsum dolor sit amet elit</h1>
          <h2>
            Duis mattis metus vel nisl laoreet euismod. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos.
          </h2>
          <p>Suspendisse tellus nibh, faucibus eu purus vitae, fringilla.</p>
        </div>
        <div className={styles.champion_animation} id="container"></div>
      </header>

      <main className={styles.champions_container}>
        <h1>Champions</h1>
        <input
          className={styles.search_bar}
          placeholder="Lorem ipsum dolor sit amet"
        />
        <div className={styles.grid}>
          <RenderChampions />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const { data } = await getChampions();
  return {
    props: {
      champions: data,
    },
  };
};
