<template>
    <div class="fullscreen">
      <img alt="fullscreen" 
      class="fullscreen-img"
      :src="require('@/assets/images/fullscreen.png')" 
      width="50px" 
      height="50px"
       @click="handleFullScreen" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import screenfull from "screenfull";

const isFullscreen = ref(screenfull.isFullscreen);

onMounted(() => {
screenfull.on("change", () => {
    if (screenfull.isFullscreen) isFullscreen.value = true;
    else isFullscreen.value = false;
});
});

const handleFullScreen = () => {
if (!screenfull.isEnabled) ElMessage.warning("当前您的浏览器不支持全屏 ❌");
screenfull.toggle();
};
</script>

<style>

.fullscreen-img:hover {
  /* 鼠标悬停时的选中效果 */
  border: 2px solid rgb(0, 255, 128); /* 添加边框 */
  cursor: pointer; /* 更改鼠标指针样式 */
}

</style>