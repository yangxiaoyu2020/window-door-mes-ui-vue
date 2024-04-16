<style scoped>
@import url("@/style/login.scss");
</style>

<template>
  <div class="login-box">
    <h1>{{ $t("auth.title") }}</h1>

    <h2>{{ $t("auth.signin") }}</h2>
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="username: admin">
          <template #prefix>
            <el-icon class="el-input__icon">
              <user />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="password: 123456"
          show-password
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="loginButton">
      <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
        {{ $t("auth.reset") }}
      </el-button>
      <el-button
        :icon="UserFilled"
        round
        size="large"
        type="primary"
        :loading="loading"
        @click="login(loginFormRef)"
      >
        {{ $t("auth.signin") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { loginApi } from "@/api/modules/login";
import { HOME_URL } from "@/config";

import { ElNotification } from "element-plus";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

import type { ElForm, FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { Login } from "@/api/interface";
import md5 from "md5";

import { initDynamicRouter } from "@/router/modules/dynamicRouter";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";

import { useI18n } from "vue-i18n";
import { downloadFileAndCreateObjectURL } from "@/api/modules/tempUrl";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstace = InstanceType<typeof ElForm>;

const loginFormRef = ref<FormInstace>();

const i18n = useI18n();

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
// function getTimeState() {
//   let timeNow = new Date();
//   let hours = timeNow.getHours();
//   if (hours >= 6 && hours <= 10) return `早上好`;
//   if (hours >= 10 && hours <= 14) return `中午好`;
//   if (hours >= 14 && hours <= 18) return `下午好`;
//   if (hours >= 18 && hours <= 24) return `晚上好`;
//   if (hours >= 0 && hours <= 6) return `凌晨好`;
// }

// 创建响应式对象来存储规则
const loginRules = reactive({
  username: [{ required: true, message: i18n.t("auth.usernamepolicy"), trigger: "blur" }],
  password: [{ required: true, message: i18n.t("auth.passwordpolicy"), trigger: "blur" }],
});

const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: "",
});

const loading = ref(false);

function getTimeState() {
  let timeNow = new Date();
  let hours = timeNow.getHours();
  if (hours >= 6 && hours <= 10) return i18n.t("message.goodMorning");
  if (hours >= 10 && hours <= 14) return i18n.t("message.goodNoon");
  if (hours >= 14 && hours <= 18) return i18n.t("message.goodAfternoon");
  if (hours >= 18 && hours <= 24) return i18n.t("message.goodEvening");
  if (hours >= 0 && hours <= 6) return i18n.t("message.goodMidnight");
}

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data } = await loginApi({
        ...loginForm,
        password: md5(loginForm.password),
      });
      userStore.setToken(data.token);
      userStore.setUserName(data.username);
      userStore.setUserId(data.userId);
      userStore.setAvatar(data.avatar);

      // 2.添加动态路由
      const routerParams: Login.ReqParams = {
        userId: data.userId,
      };
      await initDynamicRouter(routerParams);

      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([]);
      keepAliveStore.setKeepAliveName([]);

      // 3.清空 tabs、keepAlive 数据

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: i18n.t("message.loginweclome"),
        type: "success",
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 监听语言切换事件，更新规则中的消息
watch(i18n.locale, () => {
  updateRules();
});

// 更新规则中的消息
function updateRules() {
  loginRules.username[0].message = i18n.t("auth.usernamepolicy");
  loginRules.password[0].message = i18n.t("auth.passwordpolicy");
}

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});

/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
</script>
