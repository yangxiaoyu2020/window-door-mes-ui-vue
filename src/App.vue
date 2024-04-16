<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

  
  name: 'App',
  setup() {
    // 在 setup 函数中可以执行一些初始化逻辑
    return {};
  }
});


</script>

<style scoped>
/* 样式 */
</style>
