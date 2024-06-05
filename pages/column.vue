<script setup>
import { Mesh, TextureLoader, MeshBasicMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import * as THREE from "three";

const gl = reactive({
  clearColor: "#f8f8f8",
});

const canvas = ref(null);
const geometryParams = reactive({
  width: 4,
  height: 12,
  depth: 1,
  curveRadius: 2,
});

const preventScroll = (event) => {
  if (event.deltaY !== 0) {
    event.preventDefault();
  }
};

onMounted(() => {
  const canvasElement = canvas.value;
  if (canvasElement) {
    canvasElement.addEventListener("wheel", preventScroll, { passive: false });
  }
});

onUnmounted(() => {
  const canvasElement = canvas.value;
  if (canvasElement) {
    canvasElement.removeEventListener("wheel", preventScroll);
  }
});

const textureLoader = new TextureLoader();
let texture = null;

if (typeof window !== "undefined") {
  texture = textureLoader.load(
    "https://raw.githubusercontent.com/Tresjs/assets/main/textures/black-rock/Rock035_2K_Displacement.jpg"
  );
}

const createCubes = (count, box) => {
  const cubes = [];
  const geometry = new RoundedBoxGeometry(
    box.width,
    box.height,
    box.depth,
    box.curveRadius
  );
  const material = new THREE.MeshBasicMaterial({ map: texture });

  for (let i = 0; i < count; i++) {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(i * 5, 0, 0); // Position the cubes
    cubes.push(cube);
  }

  return cubes;
};

const cubes = createCubes(3, geometryParams);
</script>

<template>
  <div class="container">
    <h1>Title</h1>
    <div class="canvas" ref="canvas">
      <TresCanvas v-bind="gl">
        <TresPerspectiveCamera
          :position="[0, 10, 40]"
          :look-at="[10, 10, 10]"
        />
        <OrbitControls />
        <template v-for="(cube, index) in cubes" :key="index">
          <primitive :object="cube" />
        </template>
      </TresCanvas>
    </div>
  </div>
</template>
