<template>
  <div ref="chartRef" style="width: 100%; height: 300px"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from "vue";
import * as echarts from "echarts";

interface ChartData {
  labels: string[];
  datasets: {
    name: string;
    data: number[];
  }[];
}

const props = defineProps<{
  chartData: ChartData;
  chartTitle: string;
}>();

const chartRef = ref(null);
let myChart: echarts.ECharts | null = null;

onMounted(() => {
  myChart = echarts.init(chartRef.value);
  watch(
    () => props.chartData,
    (newData) => {
      if (!myChart || !newData) return;
      myChart.setOption({
        title: { text: props.chartTitle },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: newData.labels },
        yAxis: { type: "value" },
        series: newData.datasets.map((dataset) => ({
          type: "line",
          data: dataset.data,
          name: dataset.name,
        })),
      });
    }
  );
});
</script>
