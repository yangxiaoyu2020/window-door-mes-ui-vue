<template>
  <div class="async-avatar">
    <!-- 使用 v-if 来判断是否加载完成 -->
    <div v-if="avatarUrl">
      <el-avatar :src="avatarUrl"></el-avatar>
      <span class="avatar-name">{{ avatarName }}</span>
    </div>
    <!-- 加载中的占位符或默认头像 -->
    <div v-else>
      <!-- 显示首字母大写的默认头像 -->
      <el-avatar>
        {{ getInitialAvatar(avatarName || "") }}
      </el-avatar>
      <span class="avatar-name">{{ avatarName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import { useUrlCacheStore } from "@/stores/modules/urlCache";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";

const props = defineProps<{
  avatarIdentifier: string;
  avatarName: string;
}>();

const avatarUrl = ref(""); // 初始时没有URL

onMounted(async () => {
  if (props.avatarIdentifier) {
    // 确保 avatarIdentifier 不是 undefined
    avatarUrl.value = await getTempUrl(props.avatarIdentifier);
  }
});

const getTempUrl = async (fileUrl: string) => {
  if (!fileUrl) {
    return "";
  }
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
  console.log(fileTempUrl);

  return fileTempUrl;
};

const getInitialAvatar = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : "";
};
</script>

<style scoped>
.async-avatar {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.avatar-name {
  margin-left: 20px; /* 与头像保持一定间距 */
  /* 你可以添加更多样式，比如字体大小、颜色等 */
}
.avatar-name {
  margin-left: 20px;
  font-size: 16px;
  color: #333; /* 设置颜色 */
}
</style>
