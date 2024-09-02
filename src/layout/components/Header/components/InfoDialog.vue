<template>
  <el-dialog
    v-model="dialogVisible"
    :destroy-on-close="true"
    title="个人信息"
    width="500px"
    draggable
  >
    <span>{{ $t(dialogProps.title) }}</span>
    <template #header>
      <span class="dialog-header">
        <el-button type="primary" :icon="Edit" @click="enableEdit = true">编辑</el-button>
      </span>
    </template>

    <el-form
      ref="userInfoFormRef"
      :disabled="!enableEdit"
      label-position="top"
      :model="dialogProps.row"
      :hide-required-asterisk="!enableEdit"
    >
      <el-form-item label="头像" prop="avatar">
        <el-avatar :size="80" :src="avatarUrl || require('@/assets/images/avatar.png')" />
        <el-upload
          v-if="enableEdit"
          v-model:file-list="avatarList"
          action="#"
          :auto-upload="false"
          :limit="1"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input v-model="dialogProps.row.username" placeholder="请输入昵称" clearable />
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input
          v-model="dialogProps.row.phoneNumber"
          placeholder="请输入联系电话"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, reactive, watchEffect } from "vue";
import { Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance, drawerProps } from "element-plus";
import { User as UserNameSpace } from "@/api/interface/user";

import type { UploadFile, UploadProps } from "element-plus";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";
import { useUrlCacheStore } from "@/stores/modules/urlCache";

const imageUrl = ref("");
const avatarList = ref<UploadFile[]>([]);

const handleAvatarSuccess: UploadProps["onSuccess"] = (uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const avatarUrl = ref("");

// 获取头像URL
const userInfoFormRef = ref<FormInstance>();

export interface InfoDialogProps {
  title: string;
  row: Partial<UserNameSpace.UserInfo>;
  updateUser?: (params: any) => Promise<any>;
  uploadAvater?: (params: any) => Promise<any>;
}
const dialogProps = ref<InfoDialogProps>({
  title: "",
  row: {},
});

const dialogVisible = ref(false);
const enableEdit = ref(false);

const acceptParams = (params: InfoDialogProps) => {
  dialogProps.value = params;
  dialogVisible.value = true;
  enableEdit.value = false;
  if (dialogProps.value.row.avatar) {
    getAvatarUrl(dialogProps.value.row.avatar);
  }
};

const getAvatarUrl = async (fileUrl: string) => {
  const urlCacheStore = useUrlCacheStore();
  const cachedUrl = urlCacheStore.getUrl(fileUrl);

  if (cachedUrl) {
    avatarUrl.value = cachedUrl;
  } else {
    const response = await getPresignedUrl({ fileUrl });
    if (response.data && response.data.fileTempUrl) {
      const tempUrl = response.data.fileTempUrl;
      const expire = response.data.expire || Date.now() + 3600 * 1000;
      urlCacheStore.setUrl(fileUrl, tempUrl, expire);
      avatarUrl.value = tempUrl;
    }
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const submitForm = () => {
  if (userInfoFormRef.value) {
    userInfoFormRef.value.validate(async (valid) => {
      if (valid) {
        // Submit the form data
        console.log("Form data:", dialogProps.value.row);
        if (avatarList.value.length > 0) {
          if (avatarList.value[0].raw && avatarList.value[0].name) {
            const formData = new FormData();
            if (dialogProps.value.row.id) {
              formData.append("userId", dialogProps.value.row.id.toString());
            }
            formData.append(
              "avatarFile",
              avatarList.value[0].raw,
              avatarList.value[0].name
            );
            const res = await dialogProps.value.uploadAvater!(formData);
          }
        }
        ElMessage.success("Form submitted!");
        closeDialog();
      } else {
        ElMessage.error("Please fill in the form correctly!");
        return false;
      }
    });
  }
};

defineExpose({ acceptParams });
</script>
