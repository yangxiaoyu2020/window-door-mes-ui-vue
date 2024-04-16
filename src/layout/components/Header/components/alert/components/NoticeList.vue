<template>
  <div v-if="list.length">
    <NoticeItem v-for="(item, index) in list" :key="index" :noticeItem="item" />
  </div>
  <el-empty v-else :description="i18n.t(emptyText)" />
</template>

<script setup lang="ts">
import { PropType, defineProps } from "vue";
import { ListItem } from "../data";
import NoticeItem from "./NoticeItem.vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

defineProps({
  list: {
    type: Array as PropType<Array<ListItem>>,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: "",
  },
});
</script>
