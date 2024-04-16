<template>
  <el-container :style="containerStyle">
    <template v-if="attachment">
      <el-row>
        <el-col>
          <el-card shadow="always" :style="cardStyle">
            <el-row align="middle">
              <el-col :span="4">
                <el-avatar icon="el-icon-document" :style="avatarStyle"></el-avatar>
              </el-col>
              <el-col :span="20">
                <div :style="fileNameStyle">{{ attachment.fileName }}</div>
                <div :style="fileSizeStyle">{{ attachment.size }}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <el-row>
        <el-col>
          <el-card
            :shadow="isHovered || isLiked || isCelebrated ? 'always' : 'hover'"
            :style="[cardStyle, bubbleStyle]"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
          >
            <div style="contentStyle">
              {{ content }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div :style="typographyStyle">{{ timestamp }}</div>
        </el-col>
      </el-row>
    </template>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from "vue";
import { ElContainer, ElRow, ElCol, ElCard, ElAvatar } from "element-plus";
import { Message } from "@/api/interface/message";

interface ChatBubbleProps extends Message.MessageProps {
  variant: "sent" | "received";
}

const props = defineProps<ChatBubbleProps>();

const isHovered = ref(false);
const isLiked = ref(false);
const isCelebrated = ref(false);
const senderName = computed(() =>
  props.sender === "You" ? props.sender : (props.sender as any).name
);
const isSent = computed(() => props.variant === "sent");

// Styles
const containerStyle = computed(() => ({
  maxWidth: "40%",
  minWidth: "auto",
}));

const rowStyle = computed(() => ({
  marginBottom: "0.25rem",
}));

const typographyStyle = computed(() => ({
  fontSize: "11px",
}));

const cardStyle = computed(() => ({
  padding: "1.25rem",
  borderRadius: "8px",
  borderTopRightRadius: isSent.value ? "0" : "8px",
  borderTopLeftRadius: isSent.value ? "8px" : "0",
}));

const avatarStyle = computed(() => ({
  color: "primary",
  size: "large",
}));

const fileNameStyle = computed(() => ({
  fontSize: "14px",
}));

const fileSizeStyle = computed(() => ({
  fontSize: "12px",
}));

const bubbleStyle = computed(() => ({
  backgroundColor: isSent.value ? "#409eff" : "#f2f6fc",
  color: isSent.value ? "#fff" : "#000",
}));

const contentStyle = computed(() => ({
  fontSize: "14px",
  wordWrap: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "break-word",
}));

const actionRowStyle = computed(() => ({
  position: "absolute",
  top: "50%",
  padding: "1.5rem",
  transform: isSent.value ? "translate(-100%, -50%)" : "translate(100%, -50%)",
  left: isSent.value ? "0" : "auto",
  right: isSent.value ? "auto" : "0",
}));
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
