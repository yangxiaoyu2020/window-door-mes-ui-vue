<template>
  <div>
    <div ref="chartDiv" class="chart-component"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, defineProps, watch, onUnmounted } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  type: { type: String, required: true },
  data: { type: Array, default: () => [] },
  options: { type: Object, default: () => ({ series: [] }) },
});

const chartDiv = ref(null);
let chart = null;

onMounted(async () => {
  await nextTick(); // 等待 DOM 渲染完成
  if (chartDiv.value) {
    console.log(chartDiv.value);
    chart = echarts.init(chartDiv.value);
    setOptions();
  }
  window.addEventListener("resize", resizeChart);
});

watch(
  () => props.data,
  () => {
    setOptions();
  }
);

watch(
  () => props.options,
  () => {
    setOptions();
  },
  { deep: true }
);

function setOptions() {
  try {
    console.log("props.options");
    console.log(props.options);
    console.log(props.data);
    if (chart && props.options && props.data) {
      const rawData = Array.isArray(props.data)
        ? JSON.parse(JSON.stringify(props.data))
        : [];

      const option = {
        ...props.options,
        series: props.options.series.map((serie) => ({
          ...serie,
          data: rawData,
        })),
      };
      console.log(option);

      chart.setOption(option);
    }
  } catch (error) {
    console.error("Error setting chart options:", error);
  }
}

function resizeChart() {
  if (chart) {
    chart.resize();
  }
}

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener("resize", resizeChart);
});
</script>

<style scoped>
.chart-component {
  width: 100%;
  height: 300px;
}
</style>
