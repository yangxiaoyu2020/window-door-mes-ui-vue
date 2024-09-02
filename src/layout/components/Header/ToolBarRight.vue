<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <LanguageSelector />
      <Fullscreen />
      <Avatar />
      <Alert />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/modules/user";
import LanguageSelector from "@/locals/components/LanguageSelector.vue";
// import SearchMenu from "./components/SearchMenu.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Avatar from "./components/Avatar.vue";
import Alert from "./components/alert/Alert.vue";

const userStore = useUserStore();
const username = computed(() => userStore.userInfo.username);
</script>

<style scoped lang="scss">
@import url("./index.scss");
</style>
