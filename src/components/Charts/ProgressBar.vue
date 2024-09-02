<template>
  <el-progress
    :percentage="props.progress"
    :status="props.progress! >= 100 ? 'success' : ''"
  ></el-progress>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { ElProgress } from "element-plus";

const props = defineProps({
  progress: Number,
});
</script>
