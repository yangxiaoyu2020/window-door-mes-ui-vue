<template>
  <el-card class="chats-pane">
    <div class="header">
      <el-row :gutter="20" align="middle" justify="space-between">
        <el-col>
          <h1>
            Messages <el-tag type="primary">{{ chats.length }}</el-tag>
          </h1>
        </el-col>
      </el-row>
    </div>
    <el-input
      placeholder="Search By User Name"
      prefix-icon="el-icon-search"
      class="search-input"
      v-model="searchQuery"
    ></el-input>
    <el-scrollbar class="scrollbar">
      <div v-for="chat in filteredChats" :key="chat.id">
        <ChatListItem
          :chat="chat"
          :selectedChatId="selectedChatId"
          @selectChat="handleSelectChat"
        />
      </div>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, withDefaults } from "vue";
import { ElCard, ElRow, ElCol, ElTag, ElInput, ElScrollbar } from "element-plus";
import ChatListItem from "./ChatListItem.vue";
import { Message } from "@/api/interface/message";

// Props
const props = withDefaults(
  defineProps<{
    chats: Message.ChatProps[];
    selectedChatId: string;
  }>(),
  {
    chats: () => [],
    selectedChatId: "",
  }
);

const emit = defineEmits(["setSelectedChat"]);

const searchQuery = ref("");

// Methods
const handleSelectChat = (chatId: string) => {
  emit("setSelectedChat", chatId);
};

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.chats;
  }
  return props.chats.filter((chat) =>
    chat.sender.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.chats-pane {
  height: 735px;
  overflow-y: auto;
  padding: 10px;
}

.header {
  padding: 10px;
}

.search-input {
  margin: 10px;
}

.scrollbar {
  height: 470px; /* Adjust height as necessary */
}
</style>
