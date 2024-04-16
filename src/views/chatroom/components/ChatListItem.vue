<template>
  <div>
    <el-divider v-if="!firstItem" style="margin: 0"></el-divider>
    <p>
      <el-card :class="{ 'is-selected': selected }" @click="handleClick">
        <el-row type="flex" align="middle" justify="space-between">
          <el-col :span="3">
            <avatar-with-status
              :online="chat.sender.online"
              :src="chat.sender.avatar"
              :name="chat.sender.name"
            />
          </el-col>
          <el-col :span="3">
            <tr>
              {{
                chat.sender.name
              }}
            </tr>
            <tr>
              {{
                chat.sender.username
              }}
            </tr>
          </el-col>
          <el-col :span="5" style="text-align: right">
            <el-icon v-if="unread" color="primary" style="font-size: 12px"> </el-icon>
            <tr style="display: none">
              5 mins ago
            </tr>
          </el-col>
        </el-row>
        <td class="message-content">
          {{ lastMessageContent }}
        </td>
      </el-card>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from "vue";
import { ElCard, ElRow, ElCol, ElDivider, ElIcon } from "element-plus";
import AvatarWithStatus from "./AvatarWithStatus.vue";
import { Message } from "@/api/interface/message";

// Props
interface ChatListItemProps {
  chat: Message.ChatProps;
  unread?: boolean;
  selectedChatId?: string;
  firstItem?: boolean;
}

const props = defineProps<ChatListItemProps>();

// Emits
const emit = defineEmits(["selectChat"]);

// Computed properties
const selected = computed(() => props.selectedChatId === props.chat.id);

// Methods
const handleClick = () => {
  emit("selectChat", props.chat.id);
};

const lastMessageContent = computed(() => {
  if (props.chat.messages.length > 0) {
    return props.chat.messages[0].content;
  } else {
    return "";
  }
});
</script>

<style scoped>
.is-selected {
  border-left: 3px solid #409eff;
  background-color: #f0f9ff;
}

.message-content {
  max-width: 200px; /* Adjust the width as needed */
  word-wrap: break-word;
  white-space: normal; /* Allows the text to wrap */
  overflow-wrap: break-word; /* Ensure long words break */
}
</style>
