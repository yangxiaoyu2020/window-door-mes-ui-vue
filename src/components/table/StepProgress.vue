<template>
  <el-steps style="max-width: 600px" :active="currentStep">
    <el-step
      v-for="(step, index) in steps"
      :key="index"
      :title="step.step_name"
      :icon="index === currentStep - 1 ? 'Warning' : 'Upload'"
    >
      <template v-if="index === currentStep - 1" #title>
        <div>
          <el-card style="width: 60%">
            <template #header>
              <span> Assigned to </span>
              <AsyncAvatar
                :avatar-identifier="user.avatar || ''"
                :avatar-name="user.username || ''"
              />
            </template>
            <el-progress :stroke-width="16" :percentage="70" />
          </el-card>
        </div>
      </template>
      <template v-if="index === currentStep - 1" #icon>
        <el-icon size="large"><Warning /></el-icon>
      </template>
    </el-step>
  </el-steps>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import AsyncAvatar from "./AsyncAvatar.vue";
import { User } from "@/api/interface/user";

const props = defineProps<{
  steps: { title: string; description: string }[];
  currentStep: number;
  user: User.UserInfo;
}>();
</script>
