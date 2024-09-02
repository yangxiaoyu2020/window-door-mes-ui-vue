<template>
  <div>
    <h2>Machine Details for {{ machineId }}</h2>
    <div v-if="data">
      <h3>Coils</h3>
      <div class="data-grid">
        <span v-for="(value, index) in data.coils" :key="index">
          Coil {{ index }}: {{ value ? "On" : "Off" }}
        </span>
      </div>

      <h3>Discrete Inputs</h3>
      <div class="data-grid">
        <span v-for="(value, index) in data.discreteInputs" :key="index">
          Input {{ index }}: {{ value ? "Active" : "Inactive" }}
        </span>
      </div>

      <h3>Input Registers</h3>
      <echarts :options="inputRegistersOptions" class="chart"></echarts>

      <h3>Holding Registers</h3>
      <echarts :options="holdingRegistersOptions" class="chart"></echarts>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, defineProps } from "vue";
import * as echarts from "echarts";
interface MachineData {
  coils: boolean[];
  discreteInputs: boolean[];
  inputRegisters: number[];
  holdingRegisters: number[];
}

const props = defineProps<{ machineId: number }>();
const data = ref<MachineData | null>(null);

const fetchData = () => {
  // 模拟根据 machineId 获取机器的实时数据
  data.value = {
    coils: [false, true, false, false, true],
    discreteInputs: [true, false, true, false, true],
    inputRegisters: [100, 200, 150, 50, 90],
    holdingRegisters: [300, 400, 500, 250, 100],
  };
};

onMounted(() => {
  fetchData();
  // 模拟每秒钟更新一次数据
  setInterval(fetchData, 1000);
});

watch(() => props.machineId, fetchData);

const inputRegistersOptions = computed(() => ({
  xAxis: {
    type: "category",
    data: data.value?.inputRegisters.map((_, index) => `Register ${index}`) || [],
  },
  yAxis: { type: "value" },
  series: [
    {
      data: data.value?.inputRegisters || [],
      type: "bar",
    },
  ],
}));

const holdingRegistersOptions = computed(() => ({
  xAxis: {
    type: "category",
    data: data.value?.holdingRegisters.map((_, index) => `Register ${index}`) || [],
  },
  yAxis: { type: "value" },
  series: [
    {
      data: data.value?.holdingRegisters || [],
      type: "bar",
    },
  ],
}));
</script>

<style scoped>
.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}
.chart {
  height: 400px;
}
</style>
