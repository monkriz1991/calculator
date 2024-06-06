<script setup>
import * as THREE from "three";

const columns = ref([]);
const numberOfColumns = ref(4);
const columnColor = ref("#f4f4f4");
const columnHeight = ref(2);
const roofColor = ref("#8B4513");
const roofWidth = ref(2.5);
const roofHeight = ref(0.3);

const createColumns = () => {
  const positions = [];
  const gridSize = Math.ceil(Math.sqrt(numberOfColumns.value));
  for (let i = 0; i < numberOfColumns.value; i++) {
    const x = (i % gridSize) * 2 - (gridSize - 1);
    const z = Math.floor(i / gridSize) * 2 - (gridSize - 1);
    positions.push([x, 1, z]);
  }

  columns.value = positions.map((position) =>
    reactive({
      position,
      height: columnHeight.value,
      color: columnColor.value,
    })
  );
};

watch(numberOfColumns, (newVal) => {
  numberOfColumns.value = Math.max(1, Math.min(100, newVal));
  createColumns();
});

watch([columnColor, columnHeight], () => {
  columns.value.forEach((column) => {
    column.color = columnColor.value;
    column.height = columnHeight.value;
  });
});

onMounted(() => {
  createColumns();
});
</script>

<template>
  <div>
    <div class="container">
      <h1>Title</h1>
      <div class="controls">
        <input
          type="number"
          class="input"
          v-model.number="numberOfColumns"
          min="1"
          max="100"
          placeholder="Number of columns"
        />
        <input
          type="color"
          class="input"
          v-model="columnColor"
          placeholder="Column color"
        />
        <input
          type="range"
          class="input"
          v-model.number="columnHeight"
          min="1"
          max="10"
          step="0.1"
          placeholder="Column height"
        />
        <input
          type="color"
          class="input"
          v-model="roofColor"
          placeholder="Roof color"
        />
        <input
          type="range"
          class="input"
          v-model.number="roofWidth"
          min="1"
          max="10"
          step="0.1"
          placeholder="Roof width"
        />
        <input
          type="range"
          class="input"
          v-model.number="roofHeight"
          min="0.1"
          max="2"
          step="0.1"
          placeholder="Roof height"
        />
      </div>
      <div class="canvas">
        <TresCanvas clear-color="#ffffff">
          <OrbitControls />
          <TresPerspectiveCamera :position="[5, 5, 5]" :look-at="[0, 0, 0]" />

          <!-- Плоскость -->
          <TresMesh :rotation="[-Math.PI / 2, 0, 0]" :position="[0, 0, 0]">
            <TresPlaneGeometry :args="[10, 10]" />
            <TresMeshStandardMaterial color="blue" />
          </TresMesh>

          <!-- Колонны -->
          <template v-for="(column, index) in columns" :key="index">
            <TresMesh :position="column.position">
              <TresBoxGeometry :args="[0.1, column.height, 0.2]" />
              <TresMeshStandardMaterial :color="column.color || columnColor" />
            </TresMesh>

            <!-- Подпорки слева -->
            <TresMesh
              :position="[
                column.position[0] - 0.25,
                column.position[1] + 0.7,
                column.position[2] + 0.0,
              ]"
              :rotation="[0, 0, -Math.PI / 4]"
            >
              <TresBoxGeometry :args="[Math.sqrt(0.6), 0.1, 0.1]" />
              <TresMeshStandardMaterial :color="column.color || columnColor" />
            </TresMesh>
          </template>

          <!-- Крыша -->
          <TresMesh :position="[0, 2, 0]">
            <TresBoxGeometry :args="[roofWidth, roofHeight, 4]" />
            <TresMeshStandardMaterial :color="roofColor || '#8B4513'" />
          </TresMesh>

          <!-- Освещение -->
          <TresAmbientLight :intensity="0.5" />
          <TresDirectionalLight :position="[5, 5, 5]" :intensity="1" />
        </TresCanvas>
      </div>
    </div>
  </div>
</template>
