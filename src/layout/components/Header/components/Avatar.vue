<template>
  <el-dropdown trigger="hover">
    <div class="avatar">
      <el-avatar
        alt="avatar"
        class="avatar-img"
        shape="circle"
        :src="avatarUrl || require('@/assets/images/avatar.png')"
      />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('header.personalData')">
          <el-icon><UserFilled /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <!-- <PasswordDialog ref="passwordRef"></PasswordDialog> -->
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
// import PasswordDialog from "./PasswordDialog.vue";
import { useI18n } from "vue-i18n";
import { Login } from "@/api/interface";
import { getUserInfo, updateUser, uploadUserAvatar } from "@/api/modules/user";
import { User } from "@/api/interface/user";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";
import { useUrlCacheStore } from "@/stores/modules/urlCache";
const i18n = useI18n();

const router = useRouter();
const userStore = useUserStore();

const avatarUrl = ref("");

// 获取头像URL
const getAvatarUrl = async (fileUrl: string) => {
  const urlCacheStore = useUrlCacheStore();
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

  return fileTempUrl;
};

// 监控userStore.userInfo.avatar并更新头像URL
watchEffect(async () => {
  if (userStore.userInfo.avatar) {
    avatarUrl.value = await getAvatarUrl(userStore.userInfo.avatar);
  }
});

// 退出登录
const logout = () => {
  ElMessageBox.confirm(i18n.t("message.logoutMessage"), i18n.t("message.reminder"), {
    confirmButtonText: i18n.t("message.confirm"),
    cancelButtonText: i18n.t("message.cancel"),
    type: "warning",
  }).then(async () => {
    // 1.执行退出登录接口
    try {
      const logoutBody: Login.ReqLogout = {
        userId: userStore.userInfo.id,
      };
      await logoutApi(logoutBody);
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // 2.清除 Token
      userStore.setToken("");

      // 3.重定向到登陆页
      router.replace(LOGIN_URL);
      ElMessage.success(i18n.t("message.logoutSuccess"));
    }
  });
};

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
// const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);
const openDialog = async (dialogName: string) => {
  const userInfo = await getUserInfo({ userId: userStore.userInfo.id.toString() });
  const currentUser: User.UserInfo = {
    id: userStore.userInfo.id,
    username: userInfo.data.username,
    fullName: userInfo.data.fullName,
    phoneNumber: userInfo.data.phoneNumber,
    avatar: userInfo.data.avatar,
  };
  const params = {
    title: dialogName,
    row: currentUser,
    updateUser: updateUser,
    uploadAvater: uploadUserAvatar,
  };
  infoRef.value?.acceptParams(params);
};
</script>

//
<style scoped lang="scss">
.avatar-img {
  height: 60px;
  width: auto;
}
.avatar-img:hover {
  /* 鼠标悬停时的选中效果 */
  border: 2px solid rgb(0, 255, 128); /* 添加边框 */
  cursor: pointer; /* 更改鼠标指针样式 */
}
</style>
