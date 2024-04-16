<template>
  <div class="three-scene">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, defineProps } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const canvas = ref<HTMLCanvasElement | null>(null);

export interface ThreeSceneProps {
  fileRaw?: Blob;
  width: number;
  height: number;
}

const props = defineProps<ThreeSceneProps>();

onMounted(() => {
  const scene = new THREE.Scene();
  scene.add(new THREE.AxesHelper(5));

  const gridHelper = new THREE.GridHelper(100, 100);
  scene.add(gridHelper);

  const light = new THREE.PointLight(0xffffff, 50);
  light.position.set(0.8, 3.4, 2.5);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const camera = new THREE.PerspectiveCamera(75, props.width / props.height, 0.1, 1000);
  camera.position.set(-10, 14, 10);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, alpha: true });
  renderer.setSize(props.width, props.height);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);

  watch(
    () => props.fileRaw,
    async (newFileRaw) => {
      if (newFileRaw) {
        const fbxLoader = new FBXLoader();
        const url = URL.createObjectURL(newFileRaw);

        fbxLoader.load(
          url,
          (object) => {
            object.traverse(function (child) {
              if ((child as THREE.Mesh).isMesh) {
                if ((child as THREE.Mesh).material) {
                  ((child as THREE.Mesh)
                    .material as THREE.MeshBasicMaterial).transparent = false;
                }
              }
            });
            object.scale.set(0.01, 0.01, 0.01);
            scene.add(object);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.error("Failed to load FBX model:", error);
          }
        );
      }
    },
    { immediate: true }
  );

  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = props.width / props.height;
    camera.updateProjectionMatrix();
    renderer.setSize(props.width, props.height);
    render();
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style scoped>
.three-scene {
  width: 100%;
  height: 100%;
}
</style>
