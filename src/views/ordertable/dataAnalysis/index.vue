<!-- ParentComponent.vue -->
<template>
  <div>
    <div class="add-chart-container">
      <el-select
        v-model="selectedChartType"
        placeholder="选择图表类型"
        style="width: 240px"
        @change="addNewChartWithSelectedType"
      >
        <el-option
          v-for="item in chartTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <span style="float: left">{{ item.label }}</span>
          <span
            style="float: right; color: var(--el-text-color-secondary); font-size: 13px"
          >
            {{ item.value }}
          </span>
        </el-option>
      </el-select>
    </div>

    <draggable
      :list="charts"
      :item-key="'id'"
      class="chart-containers"
      :class="chartContainerClass"
      :animation="300"
    >
      <template #item="{ element }">
        <div class="item">
          <ChartComponent
            :type="element.type"
            :data="element.data"
            :options="element.options"
          ></ChartComponent>
          <el-button @click="editChart(element)">编辑</el-button>
        </div>
      </template>
    </draggable>

    <EditChartModal
      v-if="selectedChart"
      :chart="selectedChart"
      @close="closeEditChartModal"
      @save="saveChart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import draggable from "vuedraggable";
import ChartComponent from "../components/ChartComponent.vue";
import EditChartModal from "../components/EditChartModal.vue";
import axios from "axios";

// 存储所有图表的数据
const charts = ref([]);
const chartData = ref({});

// 用于保存当前编辑的图表
const selectedChart = ref(null);

// 图表类型选项
const chartTypes = ref([
  { value: "bar", label: "柱状图" },
  { value: "line", label: "折线图" },
  { value: "pie", label: "饼图" },
  { value: "boxplot", label: "箱线图" },
]);

// 选择的图表类型
const selectedChartType = ref("");

// 获取图表配置
const fetchChartConfigs = async () => {
  try {
    const response = await axios.get("/api/orderChart");
    charts.value = response.data;
    charts.value.forEach(fetchChartData);
  } catch (error) {
    console.error("获取图表配置失败", error);
  }
};

// 获取图表数据
const fetchChartData = async (chart) => {
  try {
    const response = await axios.get("/api/getChartData", {
      params: {
        xAxisField: chart.xAxisField,
        yAxisField: chart.yAxisField,
        chartType: chart.type,
      },
    });
    // 确保有数据返回，避免 undefined
    if (response.data) {
      chartData.value[chart.id] = response.data;
    } else {
      // 如果没有数据，设置默认数据，避免 undefined
      chartData.value[chart.id] = {
        seriesData: [],
        xAxisData: [],
        // 其他默认数据...
      };
    }
  } catch (error) {
    console.error("获取图表数据失败", error);
  }
};

// 添加新图表
const addNewChartWithSelectedType = () => {
  if (selectedChartType.value) {
    let xAxisData = [];
    let seriesData = [];

    switch (selectedChartType.value) {
      case "bar":
      case "line":
        xAxisData = ["A", "B", "C", "D", "E", "F"];
        seriesData = [10, 20, 30, 40, 50, 60];
        break;
      case "pie":
        seriesData = [
          { value: 40, name: "A" },
          { value: 20, name: "B" },
          { value: 30, name: "C" },
          { value: 10, name: "D" },
        ];
        break;
      case "boxplot":
        seriesData = [
          [850, 740, 900, 1070, 930],
          [960, 940, 960, 960, 970],
          [880, 880, 880, 880, 880],
          [890, 810, 810, 820, 880],
          [720, 950, 950, 950, 850],
        ];
        break;
      default:
        xAxisData = ["X1", "X2", "X3", "X4", "X5"];
        seriesData = [5, 10, 15, 20, 25];
        break;
    }

    const newChart = {
      id: new Date().getTime(),
      type: selectedChartType.value,
      data: seriesData,
      options: {
        title: { text: `${selectedChartType.value} 图表` },
        tooltip: {},
        xAxis: { data: xAxisData },
        yAxis: {},
        series: [{ type: selectedChartType.value, data: seriesData }],
      },
    };

    charts.value.push(newChart);
    console.log("charts  ");
    console.log(charts.value);
  }
};

// 打开编辑模态框
const editChart = (chart) => {
  selectedChart.value = { ...chart };
};

// 关闭编辑模态框
const closeEditChartModal = () => {
  selectedChart.value = null;
};

// 保存编辑后的图表
const saveChart = async (updatedChart) => {
  const index = charts.value.findIndex((chart) => chart.id === updatedChart.id);
  if (index !== -1) {
    charts.value[index] = { ...updatedChart };
    await axios.post("/api/saveOrderChartConfig", charts.value);
    fetchChartData(updatedChart);
  }
  closeEditChartModal();
};

onMounted(fetchChartConfigs);

// 动态设置容器样式
const chartContainerClass = computed(() => {
  const count = charts.value.length;
  if (count === 1) return "one-chart";
  if (count === 2) return "two-charts";
  if (count === 3) return "three-charts";
  return "multiple-charts";
});
</script>

<style scoped>
.chart-containers {
  display: grid;
  gap: 20px;
}

.one-chart {
  grid-template-columns: 1fr;
}

.two-charts {
  grid-template-columns: repeat(2, 1fr);
}

.three-charts {
  grid-template-columns: repeat(3, 1fr);
}

.multiple-charts {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
}

.item {
  width: 450px;
}

.add-chart-container {
  margin-bottom: 20px;
}
</style>
