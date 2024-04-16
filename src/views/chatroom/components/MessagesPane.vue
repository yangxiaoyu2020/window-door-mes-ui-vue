<template>
  <el-card class="main-card">
    <MessagesPaneHeader :sender="chat.sender" />
    <el-scrollbar ref="scrollbar" class="chat-area">
      <div :style="boxStyle">
        <template v-for="(message, index) in chatMessages" :key="index">
          <el-row :justify="isYou(message) ? 'end' : 'start'" :style="messageStyle">
            <el-col :span="24" :style="colStyle(isYou(message))">
              <AvatarWithStatus
                v-if="!isYou(message) && typeof message.sender === 'object'"
                :online="message.sender.online"
                :src="message.sender.avatar"
                :name="message.sender.name"
              />
              <ChatBubble
                :id="message.id"
                :content="message.content"
                :timestamp="message.timestamp"
                :sender="message.sender"
                :variant="isYou(message) ? 'sent' : 'received'"
                :unread="message.unread"
                :attachment="message.attachment"
              />
            </el-col>
          </el-row>
        </template>
      </div>
    </el-scrollbar>
    <MessageInput
      :textAreaValue="textAreaValue"
      :setTextAreaValue="updateTextAreaValue"
      @submit="handleSubmit"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineProps, watch, nextTick, onMounted } from "vue";
import { ElCard, ElRow, ElCol, ElScrollbar } from "element-plus";
import AvatarWithStatus from "./AvatarWithStatus.vue";
import ChatBubble from "./ChatBubble.vue";
import MessageInput from "./MessageInput.vue";
import MessagesPaneHeader from "./MessagesPaneHeader.vue";
import { Message } from "@/api/interface/message";

// Props
const props = defineProps<{ chat: Message.ChatProps }>();

// Emits
const emit = defineEmits(["submit"]);

// Refs
const scrollbar = ref<InstanceType<typeof ElScrollbar> | null>(null);

// State
const chatMessages = ref<Message.MessageProps[]>([...props.chat.messages]);
const textAreaValue = ref("");

// Watch the chat prop to update chatMessages
watch(
  () => props.chat.messages,
  (newMessages) => {
    chatMessages.value = [...newMessages];
    nextTick(() => {
      scrollToBottom();
    });
  },
  { immediate: true, deep: true }
);

// Methods
function isYou(message: Message.MessageProps) {
  return message.sender === "You";
}

function handleSubmit() {
  const newMessage: Message.MessageProps = {
    id: "",
    sender: "You",
    content: textAreaValue.value,
    timestamp: "Just now",
  };
  nextTick(() => {
    scrollToBottom();
  });
  emit("submit", newMessage.content);
}

function updateTextAreaValue(value: string) {
  textAreaValue.value = value;
}

function scrollToBottom() {
  if (scrollbar.value) {
    const scrollbarElement = (scrollbar.value.$el as HTMLElement).querySelector(
      ".el-scrollbar__wrap"
    );
    if (scrollbarElement) {
      scrollbarElement.scrollTop = scrollbarElement.scrollHeight;
    }
  }
}

onMounted(() => {
  nextTick(() => {
    scrollToBottom();
  });
});

const boxStyle: Record<string, string> = {
  display: "flex",
  flex: "1",
  minHeight: "0",
  padding: "0 16px 16px 16px",
  flexDirection: "column-reverse",
};

const colStyle = (isYou: boolean): Record<string, string> => ({
  display: "flex",
  justifyContent: isYou ? "flex-end" : "flex-start",
});

const messageStyle: Record<string, string> = {
  marginBottom: "8px",
};
</script>

<style scoped>
.main-card {
  height: 80%;
}
.el-scrollbar {
  height: 80%;
}
.chat-area {
  height: 440px;
}
</style>
