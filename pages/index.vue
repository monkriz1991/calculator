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
import { ref, reactive, watch, onMounted, onUnmounted } from "vue";

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
  positionX: 0,
  positionY: 10,
  positionZ: 0,
  rotationX: Math.PI / 2,
  rotationY: 0,
  rotationZ: 0,
});

const scaleX = ref(1);

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
  texture.repeat.set(0.1, 0.1);
}

let textureURL = ref("");

const updateTexture = () => {
  textureLoader.load(textureURL.value, (loadedTexture) => {
    loadedTexture.wrapS = loadedTexture.wrapT = RepeatWrapping;
    loadedTexture.repeat.set(0.1, 0.1);
    texture = loadedTexture;
    board.material.map = texture;
    board.material.needsUpdate = true;
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
    positionX,
    positionY,
    positionZ,
    rotationX,
    rotationY,
    rotationZ,
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
    curveSegments: 50,
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  const material = new MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const board = new Mesh(geometry, material);

  board.position.set(positionX, positionY, positionZ);
  board.rotation.set(rotationX, rotationY, rotationZ);

  return board;
};

let board = createBoard(geometryParams);

watch(
  geometryParams,
  (newParams) => {
    const newBoard = createBoard(newParams);
    board.position.copy(newBoard.position);
    board.rotation.copy(newBoard.rotation);
    board.geometry.dispose();
    board.geometry = newBoard.geometry;
  },
  { deep: true }
);

watch(scaleX, (newScaleX) => {
  board.scale.x = newScaleX;
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
  { label: "Position X", key: "positionX" },
  { label: "Position Y", key: "positionY" },
  { label: "Position Z", key: "positionZ" },
  { label: "Rotation X", key: "rotationX" },
  { label: "Rotation Y", key: "rotationY" },
  { label: "Rotation Z", key: "rotationZ" },
];

const firstHalfFields = inputFields.slice(0, 100);

let backgroundType = ref("texture");
let backgroundColor = ref("#ffffff");
let opacity = ref(1);

watch([backgroundType, backgroundColor, opacity], () => {
  if (backgroundType.value === "color") {
    const color = new THREE.Color(backgroundColor.value);
    board.material.color = color;
    board.material.map = null;
    board.material.opacity = opacity.value;
    board.material.transparent = opacity.value < 1;
  } else if (backgroundType.value === "texture") {
    board.material.color = new THREE.Color("#ffffff");
    board.material.map = texture;
    board.material.opacity = 1;
    board.material.transparent = false;
  }
});
</script>

<template>
  <div class="container">
    <div class="content">
      <h1>Interactive Board</h1>

      <div class="columns">
        <div class="column is-6">
          <el-affix :offset="120">
            <div class="canvas" ref="canvas">
              <ClientOnly>
                <TresCanvas v-bind="gl">
                  <TresPerspectiveCamera
                    :position="[0, 30, 50]"
                    :look-at="[0, 0, 0]"
                  />
                  <OrbitControls />
                  <TresMesh
                    :rotation="[-Math.PI / 2, 0, 0]"
                    :position="[0, 0, 0]"
                  >
                    <TresPlaneGeometry :args="[10, 10]" />
                    <TresMeshStandardMaterial
                      v-if="backgroundType === 'color'"
                      :color="backgroundColor"
                      :opacity="opacity"
                      transparent
                    />
                    <TresMeshStandardMaterial
                      v-else-if="backgroundType === 'texture'"
                      :map="texture"
                    />
                  </TresMesh>
                  <primitive :object="board" />
                </TresCanvas>
              </ClientOnly>
            </div>
          </el-affix>
        </div>
        <div class="column is-6">
          <div class="form-hard">
            <form>
              <div class="field-body-form">
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
            <div class="field">
              <label class="label">Mirror Horizontally:</label>
              <div class="control">
                <input
                  type="checkbox"
                  v-model="scaleX"
                  true-value="-1"
                  false-value="1"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Background Type:</label>
              <div class="control">
                <label class="radio">
                  <input type="radio" v-model="backgroundType" value="color" />
                  Color
                </label>
                <label class="radio">
                  <input
                    type="radio"
                    v-model="backgroundType"
                    value="texture"
                  />
                  Texture
                </label>
              </div>
            </div>
            <div class="field" v-if="backgroundType === 'color'">
              <label class="label">Background Color:</label>
              <div class="control">
                <input class="input" type="color" v-model="backgroundColor" />
              </div>
            </div>
            <div class="field">
              <label class="label">Opacity:</label>
              <div class="control">
                <input
                  class="input"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  v-model="opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
