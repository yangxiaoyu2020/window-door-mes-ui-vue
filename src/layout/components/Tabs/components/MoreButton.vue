<template>
    <el-dropdown trigger="click" :teleported="false">
      <div class="more-button">
        <el-icon :size="28" ><Operation /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided @click="closeCurrentTab">
            <el-icon><Remove /></el-icon>{{ $t("tabs.closeCurrent") }}
          </el-dropdown-item>
          <el-dropdown-item @click="closeAllTab">
            <el-icon><FolderDelete /></el-icon>{{ $t("tabs.closeAll") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script setup lang="ts">
/* eslint-disable */ 
import { inject, nextTick } from "vue";
import { HOME_URL } from "@/config";
import { useTabsStore } from "@/stores/modules/tabs";
import { useGlobalStore } from "@/stores/modules/global";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const globalStore = useGlobalStore();
const keepAliveStore = useKeepAliveStore();

// refresh current page
const refreshCurrentPage: Function = inject("refresh") as Function;
const refresh = () => {
setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.fullPath as string);
    refreshCurrentPage(false);
    nextTick(() => {
    route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.fullPath as string);
    refreshCurrentPage(true);
    });
}, 0);
};

// maximize current page
const maximize = () => {
globalStore.setGlobalState("maximize", true);
};

// Close Current
const closeCurrentTab = () => {
if (route.meta.isAffix) return;
tabStore.removeTabs(route.fullPath);
};

// Close All
const closeAllTab = () => {
  tabStore.closeMultipleTab();
  router.push(HOME_URL);
};
</script>

<style scoped lang="scss">
@import url("../index.scss");
</style>