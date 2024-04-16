<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`批量添加${parameter.title}`"
    :destroy-on-close="true"
    width="580px"
    draggable
  >
    <el-form class="drawer-multiColumn-form" label-width="100px">
      <el-form-item label="模板下载 :">
        <el-button type="primary" :icon="Download" @click="downloadTemp">
          点击下载
        </el-button>
      </el-form-item>
      <el-upload
        ref="uploader"
        action="#"
        class="upload"
        :drag="true"
        :limit="excelLimit"
        :multiple="true"
        :show-file-list="true"
        :http-request="uploadExcel"
        :before-upload="beforeExcelUpload"
        :on-exceed="handleExceed"
        :on-success="excelUploadSuccess"
        :on-error="excelUploadError"
        :accept="parameter.fileType?.join(',')"
      >
        <slot name="empty">
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </slot>
        <template #tip>
          <slot name="tip">
            <div class="el-upload__tip">
              请上传 .xls , .xlsx 标准格式文件，文件最大为 {{ parameter.fileSize }}M
            </div>
          </slot>
        </template>
      </el-upload>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, watch } from "vue";
import { useDownload } from "@/hook/useDownload";
import { Download } from "@element-plus/icons-vue";
import { ElNotification, UploadRequestOptions, UploadRawFile } from "element-plus";

export interface ExcelParameterProps {
  title: string;
  fileSize?: number;
  fileType?: File.ExcelMimeType[];
  tempApi?: (params: any) => Promise<any>;
  importApi?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const excelLimit = ref(1);

const dialogVisible = ref(false);
const parameter = ref<ExcelParameterProps>({
  title: "",
  fileSize: 5,
  fileType: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
});

// 接收父组件参数
const acceptParams = (params: ExcelParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  dialogVisible.value = true;
};

const downloadTemp = () => {
  if (!parameter.value.tempApi) return;
  useDownload(parameter.value.tempApi, `${parameter.value.title}模板`);
};

watch(
  () => parameter.value,
  (newVal) => {
    if (!newVal.fileType) {
      newVal.fileType = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
    }
  }
);

const notify = (options: {
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
}) => {
  ElNotification(options);
};

const uploadExcel = async (param: UploadRequestOptions) => {
  const excelFormData = new FormData();
  excelFormData.append("file", param.file);
  try {
    await parameter.value.importApi!(excelFormData);
    parameter.value.getTableList && parameter.value.getTableList();
    notify({
      title: "成功",
      message: `批量添加${parameter.value.title}成功`,
      type: "success",
    });
  } catch (error) {
    notify({
      title: "错误",
      message: `批量添加${parameter.value.title}失败，请重试`,
      type: "error",
    });
  } finally {
    dialogVisible.value = false;
  }
};

const beforeExcelUpload = (file: UploadRawFile) => {
  const isExcel = parameter.value.fileType!.includes(file.type as File.ExcelMimeType);
  const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize!;
  if (!isExcel) {
    notify({
      title: "温馨提示",
      message: "上传文件只能是 xls / xlsx 格式！",
      type: "warning",
    });
  }
  if (!fileSize) {
    notify({
      title: "温馨提示",
      message: `上传文件大小不能超过 ${parameter.value.fileSize}MB！`,
      type: "warning",
    });
  }
  return isExcel && fileSize;
};

const handleExceed = () => {
  notify({
    title: "温馨提示",
    message: "最多只能上传一个文件！",
    type: "warning",
  });
};

const excelUploadError = () => {
  notify({
    title: "温馨提示",
    message: `批量添加${parameter.value.title}失败，请您重新上传！`,
    type: "error",
  });
};

const excelUploadSuccess = () => {
  notify({
    title: "温馨提示",
    message: `批量添加${parameter.value.title}成功！`,
    type: "success",
  });
};

defineExpose({ acceptParams });
</script>
