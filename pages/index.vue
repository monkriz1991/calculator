<script setup>
import * as THREE from "three";
import {
  Mesh,
  MeshBasicMaterial,
  Shape,
  ExtrudeGeometry,
  TextureLoader,
  RepeatWrapping,
} from "three";

const gl = reactive({
  clearColor: "#f8f8f8",
});

const canvas = ref(null);
const geometryParams = reactive({
  width: 10,
  widthTop: 10,
  heightLeft: 12,
  heightRight: 8.8,
  depth: 0.4,
  curveRadius: 0.9,
  quadraticControlPointXLeft: 0,
  quadraticControlPointYLeft: 3.5,
  endCurvePointXLeft: 0,
  endCurvePointYLeft: 0.0,
  quadraticControlPointXRight: 6.0,
  quadraticControlPointYRight: 8.6,
  endCurvePointXRight: 4.4,
  endCurvePointYRight: 12.6,
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
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixFJy6dIarwM7YePFycgw6JF5h99rHaLtWw&s"
  );
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(0.1, 0.1); // Пример значений, вы можете изменить их по вашему усмотрению
}

let textureURL = ref("");
// let textureURL = null;

const updateTexture = () => {
  console.log(textureURL.value);
  textureLoader.load(textureURL.value, (loadedTexture) => {
    loadedTexture.wrapS = loadedTexture.wrapT = RepeatWrapping;
    loadedTexture.repeat.set(0.1, 0.1);
    texture = loadedTexture;
    board.material.map = texture;
    board.material.needsUpdate = true;
    console.log("Texture updated", texture);
  });
};

const createBoard = (params) => {
  const shape = new Shape();
  const {
    width,
    widthTop,
    heightLeft,
    heightRight,
    curveRadius,
    quadraticControlPointXLeft,
    quadraticControlPointYLeft,
    endCurvePointXLeft,
    endCurvePointYLeft,
    quadraticControlPointXRight,
    quadraticControlPointYRight,
    endCurvePointXRight,
    endCurvePointYRight,
  } = params;

  const widthBottom = width - widthTop;

  shape.moveTo(0, 0);
  shape.lineTo(widthTop, 0);
  shape.lineTo(widthTop, heightRight - curveRadius);
  shape.quadraticCurveTo(
    quadraticControlPointXRight,
    quadraticControlPointYRight,
    endCurvePointXRight,
    endCurvePointYRight
  );
  shape.lineTo(widthBottom, heightLeft + curveRadius);
  shape.quadraticCurveTo(
    quadraticControlPointXLeft,
    quadraticControlPointYLeft,
    endCurvePointXLeft,
    endCurvePointYLeft
  );
  shape.lineTo(0, 0);

  const extrudeSettings = {
    depth: params.depth,
    bevelEnabled: false,
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  const material = new MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const board = new Mesh(geometry, material);
  return board;
};

let board = createBoard(geometryParams);

watch(geometryParams, (newParams) => {
  const newBoard = createBoard(newParams);
  board.geometry.dispose();
  board.geometry = newBoard.geometry;
});

const inputFields = [
  { label: "Width", key: "width" },
  { label: "Width (Top)", key: "widthTop" },
  { label: "Left Height", key: "heightLeft" },
  { label: "Right Height", key: "heightRight" },
  { label: "Depth", key: "depth" },
  { label: "Curve Radius", key: "curveRadius" },
  {
    label: "Quadratic Control Point X (Left)",
    key: "quadraticControlPointXLeft",
  },
  {
    label: "Quadratic Control Point Y (Left)",
    key: "quadraticControlPointYLeft",
  },
  { label: "End Curve Point X (Left)", key: "endCurvePointXLeft" },
  { label: "End Curve Point Y (Left)", key: "endCurvePointYLeft" },
  {
    label: "Quadratic Control Point X (Right)",
    key: "quadraticControlPointXRight",
  },
  {
    label: "Quadratic Control Point Y (Right)",
    key: "quadraticControlPointYRight",
  },
  { label: "End Curve Point X (Right)", key: "endCurvePointXRight" },
  { label: "End Curve Point Y (Right)", key: "endCurvePointYRight" },
];

const firstHalfFields = inputFields.slice(0, 6);
const secondHalfFields = inputFields.slice(6);
</script>

<template>
  <div class="container">
    <div class="content">
      <h1>Interactive Board</h1>
      <div class="form-hard">
        <form>
          <div class="field-body">
            <template v-for="field in firstHalfFields" :key="field.key">
              <div class="field">
                <label class="label">{{ field.label }}:</label>
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    v-model="geometryParams[field.key]"
                    step="0.1"
                  />
                </div>
              </div>
            </template>
          </div>
          <div class="field-body">
            <template v-for="field in secondHalfFields" :key="field.key">
              <div class="field">
                <label class="label">{{ field.label }}:</label>
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    v-model="geometryParams[field.key]"
                    step="0.1"
                  />
                </div>
              </div>
            </template>
          </div>
        </form>
        <div class="field is-grouped mt-5 mb-5">
          <div class="control is-expanded">
            <input
              class="input"
              type="text"
              placeholder="Texture URL:"
              v-model="textureURL"
            />
          </div>
          <div class="control">
            <button class="button is-primary" @click="updateTexture">
              Update Texture
            </button>
          </div>
        </div>
      </div>
      <div class="canvas" ref="canvas">
        <ClientOnly>
          <TresCanvas v-bind="gl">
            <TresPerspectiveCamera
              :position="[0, 30, 50]"
              :look-at="[0, 0, 0]"
            />
            <OrbitControls />
            <primitive :object="board" />
          </TresCanvas>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
