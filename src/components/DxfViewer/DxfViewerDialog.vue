<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogProps.title"
    size="850px"
    :destroy-on-close="true"
  >
    <h1>{{ dialogProps.title }}</h1>
    <div>
      <div id="myCanvas" style="width: 600px; height: 700px"></div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="DxfViewerDialog">
import { ref, defineExpose } from "vue";
import {
  DxfViewer,
  DxfViewerConfig,
  ModelConfig,
} from "@pattern-x/gemini-viewer-threejs";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";
import { useUrlCacheStore } from "@/stores/modules/urlCache";
const urlCacheStore = useUrlCacheStore();

const dialogVisible = ref(false);

interface DialogProps {
  title: string;
  fileUrl: string;
}

const dialogProps = ref<DialogProps>({
  title: "",
  fileUrl: "",
});

const acceptParams = async (params: DialogProps) => {
  dialogProps.value = params;
  dialogVisible.value = true;

  const tempUrl = await getTempUrl(dialogProps.value.fileUrl); // Fetch the temporary URL
  if (tempUrl) {
    loadDxfFile(tempUrl); // Call the method to load the DXF file with the temp URL
  }
};

defineExpose({
  acceptParams,
});

const viewerCfg: DxfViewerConfig = {
  containerId: "myCanvas",
  enableSpinner: true,
  enableLayoutBar: false,
};

const loadDxfFile = async (fileUrl: string) => {
  try {
    const response = await fetch(fileUrl);
    const fileContent = await response.text();

    const viewer = new DxfViewer(viewerCfg);
    const fontFiles = ["/fonts/hztxt.shx", "/fonts/simplex.shx", "/fonts/arial.ttf"];

    await viewer.setFont(fontFiles);

    const modelCfg: ModelConfig = {
      modelId: "id_0",
      name: fileUrl.split("/").pop() || "model.dxf", // Use the filename from the URL or default to 'model.dxf'
      src: fileContent,
    };

    await viewer.loadModelAsync(modelCfg, (event) => {
      console.log("Loading progress:", (event.loaded / event.total) * 100, "%");
    });

    viewer.goToHomeView();
  } catch (error) {
    console.error("Error loading DXF file:", error);
  }
};

const getTempUrl = async (fileUrl: string) => {
  if (!fileUrl) {
    return "";
  }

  const cachedUrl = urlCacheStore.getUrl(fileUrl);

  if (cachedUrl) {
    return cachedUrl;
  }

  const req: ReqFileUrl = {
    fileUrl: fileUrl,
  };
  const response = await getPresignedUrl(req);
  const fileTempUrl = response.data.fileTempUrl || "default-url";
  const expire = response.data.expire ? response.data.expire : Date.now() + 3600 * 1000; // 默认过期时间为1小时

  urlCacheStore.setUrl(fileUrl, fileTempUrl, expire);
  // console.log(fileTempUrl);

  return fileTempUrl;
};
</script>

<style scoped>
#myCanvas {
  width: 100%;
  height: 100%;
}
</style>
