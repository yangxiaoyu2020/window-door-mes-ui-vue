<template>
  <el-dropdown class="language-img" trigger="hover" @command="changeLanguage">
    <img
      alt="logo"
      class="language-imgg"
      :src="require('@/assets/images/languages.png')"
      width="50px"
      height="50px"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in languageList"
          :key="item.value"
          :command="item.value"
          :disabled="language === item.value"
        >
          {{ $t(item.label) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

import { useGlobalStore } from "@/stores/modules/global";
import { LanguageType } from "@/stores/interface";

const i18n = useI18n();
const globalStore = useGlobalStore();
const language = computed(() => globalStore.language);

const changeLanguage = (lang: string) => {
  i18n.locale.value = lang;
  globalStore.setGlobalState("language", lang as LanguageType);
};

const languageList = [
  { label: "zh", value: "zh" },
  { label: "en", value: "en" },
  { label: "jp", value: "jp" },
];
</script>

<style>
.language-img:hover {
  cursor: pointer; /* 更改鼠标指针样式 */
  border: 2px solid rgb(0, 255, 128); /* 添加边框 */
}

.language-imgg:hover {
  /* 鼠标悬停时的选中效果 */
  border: 2px solid rgb(0, 255, 128); /* 添加边框 */
  cursor: pointer; /* 更改鼠标指针样式 */
}
</style>
