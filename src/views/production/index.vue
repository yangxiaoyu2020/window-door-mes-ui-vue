<template>
  <div>
    <h1>生产监控仪表板</h1>
    <draggable
      v-model="dashboardItems"
      itemKey="id"
      class="chart-containers"
      :class="chartContainerClass"
      :animation="300"
    >
      <template #item="{ element }">
        <div v-if="element.component === 'ChartComponent'" class="item">
          <ChartComponent
            :type="'line'"
            :data="element.props.data"
            :options="element.props.options"
          />
        </div>
        <div v-else-if="element.component === 'ProgressBar'" class="item">
          <h2>{{ element.props.title }}</h2>
          <ProgressBar :progress="element.props.progress" />
        </div>
        <div v-else-if="element.component === 'alarms'" class="item">
          <h2>{{ element.props.title }}</h2>
          <el-scrollbar
            height="180px"
            ref="scrollbarRef"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
          >
            <template v-for="(item, index) in element.props.content" :key="index">
              <el-alert
                :title="item['time']"
                :description="item['message']"
                :type="item['type']"
                :closable="false"
                show-icon
                @click="showContent(item)"
              />
            </template>
          </el-scrollbar>
        </div>
        <div v-else-if="element.component === 'statistic'">
          <div class="statistic-card">
            <el-statistic :value="element.props.data">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  {{ element.props.title }}
                  <!-- Daily active users -->
                  <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one day"
                    placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span>{{ element.props.compare }}</span>
                <span :class="element.props.color">
                  {{ element.props.persent }}%
                  <el-icon v-if="element.props.color === 'green'">
                    <CaretTop />
                  </el-icon>
                  <el-icon v-else-if="element.props.color === 'red'">
                    <CaretBottom />
                  </el-icon>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="item">
          <h2>{{ element.props.title }}</h2>
          <p>{{ element.props.content }}</p>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import draggable from "vuedraggable";
import ChartComponent from "@/components/Charts/ChartComponent.vue";
import ProgressBar from "@/components/Charts/ProgressBar.vue";
import { CaretBottom, CaretTop, Warning } from "@element-plus/icons-vue";
import { ElScrollbar } from "element-plus";

const oee = ref(85);
const orderCompletion = ref<number>(120);
const totalOrders = ref<number>(150);

const formattedOEE = computed(() => oee.value.toString());

const oeeChartData = ref({
  labels: ["周一", "周二", "周三", "周四", "周五"],
  data: [70, 80, 85, 90, 95],
  options: {
    title: { text: `oeeChartData 图表` },
    tooltip: {},
    xAxis: { data: ["周一", "周二", "周三", "周四", "周五"] },
    yAxis: {},
    series: [{ type: "line", data: [70, 80, 85, 90, 95] }],
  },
});

const yieldChartData = ref({
  labels: ["00:00", "02:00", "04:00", "06:00"],
  data: [70, 80, 85, 90, 95],
  options: {
    title: { text: `yieldChartData 图表` },
    tooltip: {},
    xAxis: { data: ["00:00", "02:00", "04:00", "06:00"] },
    yAxis: {},
    series: [{ type: "line", data: [70, 80, 85, 90, 95] }],
  },
});

const qualityAcceptanceRate = ref(95);
const equipmentUtilization = ref(70);
const employeePerformance = ref("优秀");

const alarms = ref([
  { id: 1, time: "08:30", message: "机器A过热", type: "error" },
  { id: 2, time: "09:01", message: "机器B需要维护", type: "warning" },
  { id: 3, time: "09:20", message: "机器B需要维护", type: "warning" },
  { id: 4, time: "09:30", message: "机器B需要维护", type: "warning" },
  { id: 5, time: "09:40", message: "机器B需要维护", type: "warning" },
]);

const dashboardItems = ref([
  {
    id: 1,
    component: "ChartComponent",
    props: {
      data: oeeChartData.value.data,
      options: oeeChartData.value.options,
    },
    key: "oee",
  },
  {
    id: 2,
    component: "ProgressBar",
    props: {
      class: "order-completion",
      title: `订单完成量: ${orderCompletion.value} / ${totalOrders.value} 件`,
      progress:
        (parseFloat(orderCompletion.value.toString()) /
          parseFloat(totalOrders.value.toString())) *
        100,
    },
    key: "order-completion",
  },
  {
    id: 3,
    component: "ChartComponent",
    props: {
      data: yieldChartData.value.data,
      options: yieldChartData.value.options,
    },
    key: "real-time-yield",
  },
  {
    id: 4,
    component: "div",
    props: {
      class: "quality-rates",
      title: "质量合格率",
      content: `${qualityAcceptanceRate.value}%`,
    },
    key: "quality-rates",
  },
  {
    id: 5,
    component: "div",
    props: {
      class: "equipment-utilization",
      title: "设备利用率",
      content: `${equipmentUtilization.value}%`,
    },
    key: "equipment-utilization",
  },
  {
    id: 6,
    component: "div",
    props: {
      class: "employee-performance",
      title: "员工绩效",
      content: employeePerformance.value,
    },
    key: "employee-performance",
  },
  {
    id: 7,
    component: "alarms",
    props: {
      class: "alarms",
      title: "异常报警",
      content: alarms.value,
    },
    key: "alarms",
  },
  {
    id: 8,
    component: "statistic",
    props: {
      data: 444,
      class: "statistic",
      title: "Daily active users",
      content: "Number of users who logged into the product in one day",
      compare: "than yesterday",
      persent: 24,
      color: "green",
    },
  },
  {
    id: 9,
    component: "statistic",
    props: {
      data: 444,
      class: "statistic",
      title: "Daily active users",
      content: "Number of users who logged into the product in one day",
      compare: "than yesterday",
      persent: 24,
      color: "red",
    },
  },
]);

const showContent = (content) => {
  alert(content["time"] + ": " + content["message"]);
};

const chartContainerClass = computed(() => {
  const count = dashboardItems.value.length;
  if (count === 1) return "one-chart";
  if (count === 2) return "two-charts";
  if (count === 3) return "three-charts";
  return "multiple-charts";
});

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const isHovering = ref(false);

let scrollFrame: number | null = null;
const initValue = ref(0);

const autoScroll = () => {
  if (scrollbarRef.value) {
    const scrollbarEl = scrollbarRef.value.$el; // 获取滚动元素
    if (scrollbarEl) {
      const { clientHeight } = scrollbarEl;
      // 定义滚动的步长
      const step = 4;
      let pauseTimeout: number | null = null;

      // 执行滚动
      const scroll = () => {
        if (!isHovering.value) {
          initValue.value += 10;
          if (initValue.value < clientHeight - 30) {
            scrollbarRef.value!.setScrollTop(initValue.value + step);
          } else {
            initValue.value = 0;
            scrollbarRef.value!.setScrollTop(initValue.value);
          }
        }
        // 设置滚动暂停时间
        clearTimeout(pauseTimeout);
        pauseTimeout = setTimeout(() => {
          scrollFrame = requestAnimationFrame(scroll);
        }, 300); // 每100毫秒滚动一次，你可以根据需要调整这个值
        // 继续滚动
      };

      scrollFrame = requestAnimationFrame(scroll); // 开始滚动
    }
  }
};

onMounted(() => {
  nextTick(() => {
    // 组件挂载后，开始滚动
    autoScroll();
  });
});

onBeforeUnmount(() => {
  if (scrollFrame) {
    cancelAnimationFrame(scrollFrame); // 组件卸载时，停止滚动
  }
});
</script>

<style scoped>
.chart-containers {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.chart-containers > .item {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(33.3333% - 16px);
}
.one-chart > .item {
  flex: 1 1 100%;
}
.two-charts > .item {
  flex: 1 1 calc(50% - 16px);
}
.three-charts > .item {
  flex: 1 1 calc(33.3333% - 16px);
}
.quality-rates,
.equipment-utilization,
.employee-performance {
  text-align: center;
}
.statistic-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.statistic-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.footer-item span {
  display: inline-flex;
  align-items: center;
}
.footer-item span.green {
  color: green;
}
.footer-item span.red {
  color: red;
}
</style>
