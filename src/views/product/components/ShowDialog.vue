<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${$t(parameter.title)}`"
    :destroy-on-close="true"
    width="880px"
    draggable
  >
    <ThreeScene
      ref="threeSceneRef"
      :fileRaw="parameter.fileRaw"
      :width="780"
      :height="600"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import ThreeScene from "./ThreeScene.vue";
import { Product } from "@/api/interface/product";

const dialogVisible = ref(false);

export interface ParameterProps {
  title: string;
  row: Partial<Product.ResProductList>;
  api?: (params: any) => Promise<any>;
  fileRaw?: Blob;
}

const parameter = ref<ParameterProps>({
  title: "",
  row: {},
  fileRaw: undefined,
});

const downloadFile = async (params: ParameterProps): Promise<Blob> => {
  try {
    const files = params.row.fileInfo;
    if (files) {
      const ReqFbx: Product.ReqFile = {
        fileName: files[0].fileName,
        fileUrl: files[0].fileUrl || "",
      };
      const response = await params.api!(ReqFbx);
      const blob = new Blob([response], { type: "application/octet-stream" });
      return blob;
    } else return new Blob();
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

const acceptParams = async (params: ParameterProps) => {
  try {
    const fileRaw = await downloadFile(params);
    parameter.value = { ...params, fileRaw };
    dialogVisible.value = true;
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

defineExpose({
  acceptParams,
});
</script>

<style scoped lang="scss">
@import "./ShowDialog.scss";
</style>
