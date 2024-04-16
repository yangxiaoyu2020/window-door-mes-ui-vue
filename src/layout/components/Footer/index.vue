<template>
  <div class="footer flx-center">
    <a href="https://gitee.com/frankyang92/window-door-mes-ui-vue" target="_blank"> 
      <h3>
        https://gitee.com/frankyang92/window-door-mes-ui-vue
        沪ICP备 9999999999999 placeholder 号-1
      </h3>
    </a>
    <el-button class="chat-button" @click="openDialog">
      <div class="chat-content">
        <el-badge :value="badgeValue" class="badge" :offset="[-2, 10]" :class="{ 'animate-badge': animate }">
          <img src="@/assets/images/chat_icon.png" alt="Chat Icon" class="chat-icon" />
          <span class="chat-text">{{ $t("chat.message")}}</span>
        </el-badge>
      </div>
    </el-button>
    <el-dialog 
      v-model="dialogVisible" 
      width="60%"
      :draggable="true"
      :overflow="true"
      >
      <template #header>
        <span>My Messages</span>
      </template>
      <MyMessage />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import MyMessage from "@/views/chatroom/MyMessage.vue";

const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const badgeValue = ref(1); // 初始化值
const animate = ref(false);

// 监听 badgeValue 的变化
watch(badgeValue, (newValue, oldValue) => {
  if (newValue >= 0 && newValue !== oldValue) {
    animate.value = true;
    setTimeout(() => {
      animate.value = false;
    }, 1000); // 动画持续时间
  }
});

// 模拟消息到来，增加 badgeValue
setInterval(() => {
  badgeValue.value += 1;
  badgeValue.value %= 10;
}, 3000); // 每 5 秒增加一次
</script>
<style scoped lang="scss">
@import "./index.scss";

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.chat-button {
  display: flex;
  align-items: center;
  position: fixed;
  height: 50px;
  width: 50px;
  right: 20px;
  bottom: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  z-index: 1000;
}

.chat-content {
  position: relative;
  display: inline-block;
  text-align: center;
}

.chat-icon {
  display: block;
  width: 60px;
  height: 60px;
}

.chat-text {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(5, 5, 5);
  font-size: 12px;
  border: 10;
  white-space: nowrap;
}

.badge {
  margin-top: 20px;
  margin-right: 30px;
}

.el-dialog {
    pointer-events: auto; 
}


.badge {
  position: relative;
}

.animate-badge {
  animation: shake 0.5s;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
