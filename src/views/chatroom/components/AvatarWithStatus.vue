<template>
  <el-badge
    :value="status"
    :color="color"
    :type="online ? 'success' : 'info'"
    :style="badgeStyle"
  >
    <el-avatar size="large">
      <h2>
        {{ name.substring(0, 1) }}
      </h2>
    </el-avatar>
  </el-badge>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { ElBadge, ElAvatar } from "element-plus";

interface AvatarWithStatusProps {
  online?: boolean;
  // src: string;
  name: string;
}

const props = defineProps<AvatarWithStatusProps>();

const badgeStyle = computed(() => ({
  position: "relative",
  display: "inline-block",
  lineHeight: 0,
  width: "var(--el-avatar-size-base)",
  height: "var(--el-avatar-size-base)",
  verticalAlign: "middle",
}));

const status = computed(() => (props.online ? "online" : "offline"));
const color = computed(() => (props.online ? "green" : "grey"));

// const avatarProps = computed(() => ({
//   src: props.src,
// }));
</script>

<style scoped>
.el-badge__content {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
