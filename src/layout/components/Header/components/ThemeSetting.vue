<template>
    <div class="themes" trigger="click" @command="openDrawer">
      <img alt="themes" 
      class="themes-img"
      :src="require('@/assets/images/themes-icon.png')"
      width="50px"
      height="50px"
      @click="openDrawer" />
    </div>
</template>
  
<script setup lang="ts">
import mittBus from '@/utils/mittBus';

const openDrawer = () => {
    mittBus.emit("openThemeDrawer");
};
</script>

<style>

.themes-img:hover {
  /* 鼠标悬停时的选中效果 */
  border: 2px solid rgb(0, 255, 64); /* 添加边框 */
  cursor: pointer; /* 更改鼠标指针样式 */
}
</style>