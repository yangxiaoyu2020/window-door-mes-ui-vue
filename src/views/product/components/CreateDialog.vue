<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t(parameter.title)"
    :destroy-on-close="true"
    width="880px"
    draggable
    @close="resetForm"
  >
    <el-form class="drawer-multiColumn-form" label-width="auto">
      <el-form-item :label="$t('product.productName')">
        <el-input v-model="productData.productName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.productId')">
        <el-input v-model="productData.productId"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.uploadFile')" class="el-form-upload">
        <el-upload
          v-model:file-list="productData.fileList"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <template #trigger>
            <el-button type="primary"> {{ $t("uploadFile.choose") }} </el-button>
          </template>
          <template #tip>
            <div class="el-upload__tip text-red">{{ $t("uploadFile.limitOneFile") }}</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <div v-if="fileRaw">
      <ThreeScene :fileRaw="fileRaw" :width="400" :height="300" />
    </div>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">
        {{ $t("message.cancel") }}
      </el-button>
      <el-button type="primary" @click="createProduct">
        {{ $t("message.confirm") }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import { ElMessage } from "element-plus";
import ThreeScene from "./ThreeScene.vue";
import type { UploadProps, UploadFile } from "element-plus";
import { Product } from "@/api/interface/product";
import { convertToFormData } from "@/api/modules/product";

const dialogVisible = ref(false);
const fileRaw = ref<Blob | null>(null);

interface CreateProductProps {
  title: string;
  api?: (params: any) => Promise<any>;
}

const parameter = ref<CreateProductProps>({
  title: "",
});

const productData = ref<Product.ReqCreateProduct>({
  productName: "",
  productId: "",
  fileList: [],
});

const beforeUpload: UploadProps["beforeUpload"] = (file: File) => {
  const isFBX = file.name.endsWith(".fbx") || file.name.endsWith(".FBX");
  if (!isFBX) {
    ElMessage.error("上传文件只能是FBX格式!");
  }
  return isFBX;
};

const handleFileChange: UploadProps["onChange"] = (
  file: UploadFile,
  fileList: UploadFile[]
) => {
  if (file.raw) {
    fileRaw.value = file.raw;
    productData.value.fileList = fileList;
  }
};

const handleFileRemove: UploadProps["onRemove"] = () => {
  fileRaw.value = null;
  productData.value.fileList = [];
};

const createProduct = async () => {
  try {
    // 在这里执行创建订单的逻辑
    console.log("Creating order with data:", productData.value);

    // 假设有一个API函数来处理订单创建
    if (parameter.value.api) {
      const formData = convertToFormData(productData.value);
      await parameter.value.api(formData);
    }

    dialogVisible.value = false;
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

const resetForm = () => {
  productData.value = {
    productName: "",
    productId: "",
    fileList: [],
  };
  fileRaw.value = null;
};

const acceptParams = (params: CreateProductProps) => {
  parameter.value = params;
  dialogVisible.value = true;
};

defineExpose({
  acceptParams,
});
</script>

<style scoped lang="scss">
@import "./CreateDialog.scss";
</style>
