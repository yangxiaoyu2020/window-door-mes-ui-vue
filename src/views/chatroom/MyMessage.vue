<template>
  <el-container class="mymessages">
    <el-header style="width: 80%">
      <el-autocomplete
        class="autocomplete-chatsearch"
        v-model="searchQuery"
        :fetch-suggestions="querySearchAsync"
        placeholder="Search user to create chat"
        @select="handleSelect"
        style="width: 3000px"
      />
    </el-header>
    <el-container>
      <el-aside class="message-aside">
        <ChatsPane
          :chats="chats"
          :selectedChatId="selectedChat?.id"
          @setSelectedChat="setSelectedChat"
        />
      </el-aside>
      <el-main class="message-main">
        <MessagesPane :chat="selectedChat" @submit="handleSendMessage" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { ElContainer, ElAside, ElMain } from "element-plus";
import MessagesPane from "./components/MessagesPane.vue";
import ChatsPane from "./components/ChatsPane.vue";
import { Message } from "@/api/interface/message";
import { fetchChats, fetchMessages, fetchChatUsers } from "@/api/modules/message";
import webSocketService from "@/api/websocket-service";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const searchQuery = ref("");

const defaultChat: Message.ChatProps = {
  id: "",
  sender: {
    userId: "",
    name: "",
    phoneNum: "",
    username: "",
    avatar: "",
    online: false,
  },
  messages: [],
};

const chats = ref<Message.ChatProps[]>([]);
const users = ref<{ [key: string]: Message.UserProps }>({});

const selectedChat = ref<Message.ChatProps>(defaultChat);

const transformMessageResponseToProps = (
  message: Message.MessageResponse,
  users: { [key: string]: Message.UserProps }
): Message.MessageProps => {
  return {
    ...message,
    sender:
      message.sender === userStore.userInfo.userId.toString()
        ? "You"
        : users[message.sender],
  };
};

const transformChatResponseToProps = (
  chat: Message.ChatResponse,
  users: { [key: string]: Message.UserProps }
): Message.ChatProps => {
  return {
    id: chat.id,
    sender: users[chat.sender],
    messages: chat.messages.map((message) =>
      transformMessageResponseToProps(message, users)
    ),
  };
};

const querySearchAsync = async (queryString: string, cb: (results: any[]) => void) => {
  if (!queryString) {
    return cb([]);
  }
  console.log("createChat");

  // const response = await searchUsers(queryString);
  // const usersList = response.data.map((user: Message.UserProps) => ({
  //   value: user.username,
  //   userId: user.userId,
  // }));

  // cb(usersList);
  cb([]);
};

const handleSelect = async (item: { value: string; userId: string }) => {
  const newChat = {
    senderId: userStore.userInfo.userId,
    recipientId: item.userId,
  };

  try {
    console.log("createChat");
    // const response = await createChat(newChat);
    // const chat = transformChatResponseToProps(response.data, users.value);
    // chats.value.push(chat);
    // setSelectedChat(chat.id);
  } catch (error) {
    console.error("Error creating chat:", error);
  }
};

const setSelectedChat = async (chatId: string) => {
  const chat = chats.value.find((c) => c.id === chatId);
  if (chat) {
    const reqChat: Message.ReqMessageParams = { chatId: chat.id };
    const response = await fetchMessages(reqChat);

    const messages = response.data.map((message: Message.MessageResponse) =>
      transformMessageResponseToProps(message, users.value)
    );
    selectedChat.value = {
      id: chat.id,
      sender: chat.sender,
      messages,
    };

    await webSocketService.connect(chat.id, (message: Message.MessageResponse) => {
      selectedChat.value?.messages.unshift(
        transformMessageResponseToProps(message, users.value)
      );
      console.log(" selectedChat.value?.messages");
      console.log(selectedChat.value?.messages);
    });
  }
};

const handleSendMessage = async (messageContent: string) => {
  if (selectedChat.value) {
    const newMessage: Message.CreateMessageParams = {
      chatId: selectedChat.value.id,
      content: messageContent,
      sender: userStore.userInfo.userId.toString(),
    };
    webSocketService.sendMessage(selectedChat.value.id, newMessage);
  }
};

onMounted(async () => {
  const req: Message.ReqParams = {
    userId: userStore.userInfo.userId.toString(),
  };

  const [chatResponse, userResponse] = await Promise.all([
    fetchChats(req),
    fetchChatUsers(req),
  ]);

  users.value = userResponse.data.reduce(
    (acc: { [key: string]: Message.UserProps }, user: Message.UserProps) => {
      acc[user.userId] = user;
      return acc;
    },
    {}
  );

  chats.value = chatResponse.data.map((chat: Message.ChatResponse) =>
    transformChatResponseToProps(chat, users.value)
  );

  if (chats.value.length > 0) {
    setSelectedChat(chats.value[0].id);
  }
});

const asideStyle = computed(() => ({
  transform:
    window.innerWidth < 640
      ? "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))"
      : "none",
}));

const asideWidth = computed(() => (window.innerWidth < 640 ? "100%" : "300px"));
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
