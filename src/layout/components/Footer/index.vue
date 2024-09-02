<template>
  <div class="footer flx-center">
    <a href="https://gitee.com/frankyang92/window-door-mes-ui-vue" target="_blank">
      <h3>
        https://gitee.com/frankyang92/window-door-mes-ui-vue 沪ICP备 9999999999999
        placeholder 号-1
      </h3>
    </a>
    <el-button class="flx-left">
      <el-popover :visible="visible" placement="top">
        <p>Are you sure to logout ?</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">cancel</el-button>
          <el-button size="small" type="primary" @click="logout"> confirm </el-button>
        </div>
        <template #reference>
          <el-icon size="large" color="red" @click="visible = true"
            ><SwitchButton
          /></el-icon>
        </template>
      </el-popover>
    </el-button>

    <el-button class="chat-button" @click="openDialog">
      <div class="chat-content">
        <el-badge
          :value="badgeValue"
          class="badge"
          :offset="[-2, 10]"
          :class="{ 'animate-badge': animate }"
        >
          <img src="@/assets/images/chat_icon.png" alt="Chat Icon" class="chat-icon" />
          <span class="chat-text">{{ $t("chat.message") }}</span>
        </el-badge>
      </div>
    </el-button>
    <el-dialog v-model="dialogVisible" width="60%" :draggable="true" :overflow="true">
      <template #header>
        <span>My Messages</span>
      </template>
      <MyMessage />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import MyMessage from "@/views/chatroom/MyMessage.vue";
import { SwitchButton, InfoFilled } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
import { LOGIN_URL } from "@/config";
import { Login } from "@/api/interface";
import { logoutApi } from "@/api/modules/login";

const dialogVisible = ref(false);
const visible = ref(false);

const i18n = useI18n();

const router = useRouter();
const userStore = useUserStore();
// 退出登录

const cancelEvent = () => {
  console.log("cancel logout");
};
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
      visible.value = false;
      // 2.清除 Token
      userStore.setToken("");

      // 3.重定向到登陆页
      router.replace(LOGIN_URL);
      ElMessage.success(i18n.t("message.logoutSuccess"));
    }
  });
};

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

.flx-left {
  position: fixed;
  bottom: 20px; /* 调整距离底部的位置 */
  left: 20px; /* 调整距离左侧的位置 */
  background-color: #fff; /* 背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  z-index: 999; /* 确保标题在其他内容之上 */
}

.logout-button {
  display: flex;
  align-items: center;
  position: fixed;
  height: 50px;
  width: 50px;
  left: 20px;
  bottom: 20px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  z-index: 1000;
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
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
