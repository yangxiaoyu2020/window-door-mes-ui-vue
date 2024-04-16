<template>
  <div>
    <div v-if="updateAvailable">
      <p>有新的更新可用。</p>
      <button @click="installUpdate">立即更新</button>
    </div>
    <div v-if="updateError">
      <p>更新错误: {{ updateError }}</p>
    </div>
    <div v-if="downloadProgress !== null">
      <p>下载进度: {{ downloadProgress }}%</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ipcRenderer } from "electron";
import { ref, onMounted, onBeforeUnmount } from 'vue';

const updateAvailable = ref(false);
const updateError = ref(null);
const downloadProgress = ref(null);

const installUpdate = () => {
  ipcRenderer.send("install-update");
};

const updateAvailableHandler = () => {
  updateAvailable.value = true;
};

const updateNotAvailableHandler = () => {
  updateAvailable.value = false;
};

const updateErrorHandler = (event, err) => {
  updateError.value = err;
  console.error("Update error:", err);
};

const downloadProgressHandler = (event, progressObj) => {
  downloadProgress.value = progressObj.percent;
  console.log("Download progress:", progressObj);
};

const updateDownloadedHandler = () => {
  updateAvailable.value = false;
  alert("Update downloaded; will install on restart.");
};

onMounted(() => {
  ipcRenderer.on("update-available", updateAvailableHandler);
  ipcRenderer.on("update-not-available", updateNotAvailableHandler);
  ipcRenderer.on("update-error", updateErrorHandler);
  ipcRenderer.on("download-progress", downloadProgressHandler);
  ipcRenderer.on("update-downloaded", updateDownloadedHandler);
});

onBeforeUnmount(() => {
  ipcRenderer.removeAllListeners("update-available");
  ipcRenderer.removeAllListeners("update-not-available");
  ipcRenderer.removeAllListeners("update-error");
  ipcRenderer.removeAllListeners("download-progress");
  ipcRenderer.removeAllListeners("update-downloaded");
});
</script>
