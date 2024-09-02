<template>
  <div class="demo-image__placeholder">
    <div class="block">
      <span class="demonstration">{{ fileName }}</span>
      <el-image :src="imageUrl">
        <template #placeholder>
          <div class="image-slot">Loading<span class="dot">...</span></div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import { useUrlCacheStore } from "@/stores/modules/urlCache";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";

const props = defineProps<{
  path: string;
  filename: string;
}>();

const imageUrl = ref(""); // 初始时没有URL
const fileName = ref("");

onMounted(async () => {
  if (props.filename) {
    fileName.value = props.filename;
  }
  if (props.path) {
    // 确保 avatarIdentifier 不是 undefined
    imageUrl.value = await getTempUrl(props.path);
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
</script>

<style scoped>
.demo-image__placeholder .block {
  padding: 30px 0;
  text-align: center;
  vertical-align: top;
}
.demo-image__placeholder .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__placeholder .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
}

.demo-image__placeholder.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
.demo-image__placeholder .dot {
  animation: dot 2s infinite steps(3, start);
  overflow: hidden;
}
</style>
