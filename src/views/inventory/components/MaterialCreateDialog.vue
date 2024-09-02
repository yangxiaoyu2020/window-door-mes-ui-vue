<template>
  <el-dialog
    v-model="dialogVisible"
    :destroy-on-close="true"
    size="850px"
    :title="dialogProps.title"
  >
    <el-form ref="ruleFormRef" label-width="300px" label-suffix=" :" :rules="rules">
      <!-- imageFiles -->
      <el-form-item :label="$t('material.name')" prop="">
        <el-input
          v-model="materialData.name"
          placeholder="请填写客户地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('material.specification')" prop="">
        <el-input
          v-model="materialData.specification"
          placeholder="请填写"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('material.model')" prop="">
        <el-input v-model="materialData.model" placeholder="请填" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('material.type')" prop="">
        <el-input v-model="materialData.type" placeholder="请填写" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('material.unit')" prop="">
        <el-input v-model="materialData.unit" placeholder="单位" clearable></el-input>
      </el-form-item>
      <el-form-item label="上传图片文件" class="el-form-upload">
        <el-upload
          v-model:file-list="materialData.imageFiles"
          action="#"
          :drag="true"
          :multiple="true"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click.stop="handlePictureCardPreview(file)"
                >
                  <el-icon><ZoomIn /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="innerdialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="上传DWG文件" class="el-form-upload">
        <el-upload
          v-model:file-list="materialData.dwgFiles"
          action="#"
          :drag="true"
          :multiple="true"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handleDwgPreview"
          :on-remove="handleRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>

          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click.stop="handleDwgPreview(file)"
                >
                  <el-icon><ZoomIn /></el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="innerdialogVisible"> </el-dialog>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false"> 取消 </el-button>
      <el-button v-show="!dialogProps.isView" type="primary" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="tsx" name="Dialog">
/* eslint-disable */
import { ref, reactive, watchEffect } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Material } from "@/api/interface/material";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();

const rules = reactive({
  orderId: [{ required: true, message: "请填写订单号" }],
  address: [{ required: true, message: "请填写客户地址" }],
  explanation: [{ required: true, message: "请填写备注" }],
});

interface DialogProps {
  title: string;
  api?: (params: any) => Promise<any>;
}

/**
 *   name: number;
    unit: string;
    specification: string;
    type: string;
    model: string;
    imageFiles?: UploadFile[];
    dwgFiles?: UploadFile[];
 */
const materialData = ref<Material.ReqCreateMaterials>({
  name: "",
  unit: "",
  specification: "",
  type: "",
  model: "",
  imageFiles: [],
  dwgFiles: [],
});

// Reactive array to store the attachment URLs
const attachmentUrls = ref<string[]>([]);

const dialogVisible = ref(false);
const dialogProps = ref<DialogProps>({
  title: "",
});

// Fetch URLs whenever the attachments change

const isImage = (fileName: string) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
};

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps) => {
  dialogProps.value = params;
  dialogVisible.value = true;
};

// 提交数据（编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      await dialogProps.value.api!();
      ElMessage.success({ message: `${dialogProps.value.title}成功！` });
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams,
});
</script>
