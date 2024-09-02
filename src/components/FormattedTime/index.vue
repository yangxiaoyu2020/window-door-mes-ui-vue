<template>
  <div class="time-display-component">
    <span> {{ formattedDateTime }}</span>
    <!-- <el-select v-model="selectedTimeZone" @change="applyTimeZone">
      <el-option
        v-for="zone in timeZoneOptions"
        :key="zone.value"
        :label="zone.label"
        :value="zone.value"
      />
    </el-select> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from "vue";
import { ElSelect, ElOption } from "element-plus";

const props = defineProps({
  inputTime: {
    type: Number,
    default: () => new Date().getTime(), // 默认值为当前时间的Unix时间戳
  },
});
const timeZoneOptions = ref([
  { label: "UTC-12", value: "Etc/GMT+12" },
  { label: "UTC-11", value: "Etc/GMT+11" },
  { label: "UTC-10", value: "Etc/GMT+10" },
  { label: "UTC-9", value: "Etc/GMT+9" },
  { label: "UTC-8", value: "Etc/GMT+8" },
  { label: "UTC-7", value: "Etc/GMT+7" },
  { label: "UTC-6", value: "Etc/GMT+6" },
  { label: "UTC-5", value: "Etc/GMT+5" },
  { label: "UTC-4", value: "Etc/GMT+4" },
  { label: "UTC-3", value: "Etc/GMT+3" },
  { label: "UTC-2", value: "Etc/GMT+2" },
  { label: "UTC-1", value: "Etc/GMT+1" },
  { label: "UTC", value: "Etc/GMT" },
  { label: "UTC+1", value: "Etc/GMT-1" },
  { label: "UTC+2", value: "Etc/GMT-2" },
  { label: "UTC+3", value: "Etc/GMT-3" },
  { label: "UTC+3.5", value: "Etc/GMT-3:30" },
  { label: "UTC+4", value: "Etc/GMT-4" },
  { label: "UTC+4.5", value: "Etc/GMT-4:30" },
  { label: "UTC+5", value: "Etc/GMT-5" },
  { label: "UTC+5.75", value: "Etc/GMT-5:45" },
  { label: "UTC+6", value: "Etc/GMT-6" },
  { label: "UTC+6.5", value: "Etc/GMT-6:30" },
  { label: "UTC+7", value: "Etc/GMT-7" },
  { label: "UTC+8", value: "Etc/GMT-8" },
  { label: "UTC+8.75", value: "Etc/GMT-8:45" },
  { label: "UTC+9", value: "Etc/GMT-9" },
  { label: "UTC+9.5", value: "Etc/GMT-9:30" },
  { label: "UTC+10", value: "Etc/GMT-10" },
  { label: "UTC+10.5", value: "Etc/GMT-10:30" },
  { label: "UTC+11", value: "Etc/GMT-11" },
  { label: "UTC+12", value: "Etc/GMT-12" },
  { label: "UTC+12.75", value: "Etc/GMT-12:45" },
  { label: "UTC+13", value: "Etc/GMT-13" },
  { label: "UTC+14", value: "Etc/GMT-14" },
]);

const selectedTimeZone = ref("local"); // 默认为本地时区

const formattedDateTime = ref("");

watchEffect(() => {
  const date = new Date(props.inputTime);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: selectedTimeZone.value === "local" ? undefined : selectedTimeZone.value,
    hour12: false, // 使用24小时制
  };
  formattedDateTime.value = new Intl.DateTimeFormat("en-US", options).format(date);
});

const applyTimeZone = () => {
  // 当用户改变时区时，重新格式化日期时间
  formattedDateTime.value = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: selectedTimeZone.value,
    hour12: false, // 使用24小时制
  }).format(new Date(props.inputTime));
};
</script>

<style scoped>
.time-display-component {
  /* 你的样式 */
}
</style>
