<template>
  <el-row
    :gutter="20"
    type="flex"
    align="middle"
    justify="space-between"
    :style="headerStyle"
  >
    <el-col :span="20">
      <el-row type="flex" align="middle">
        <el-col :span="4">
          <el-avatar size="large">
            <h2>
              {{ sender.name.charAt(0) }}
            </h2>
          </el-avatar>
        </el-col>
        <el-col :span="16">
          <tr>
            <h2 :style="nameStyle">
              {{ sender.name }}
              <el-tag v-if="sender.online" size="small" type="success" class="ml-2">
                <el-icon class="mr-1">
                  <i class="el-icon-circle-check"></i>
                </el-icon>
                Online
              </el-tag>
            </h2>
            <div>{{ sender.username }}</div>
          </tr>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" align="middle" justify="end">
        <el-button
          icon="Phone"
          circle
          v-show="!isMobile"
          size="large"
          ref="phoneRef"
          v-click-outside="onClickPhone"
        ></el-button>
        <el-popover
          ref="popPhoneRef"
          :virtual-ref="phoneRef"
          trigger="click"
          virtual-triggering
        >
          <span>
            {{ sender.phoneNum }}
          </span>
        </el-popover>
        <!-- <el-button icon="el-icon-more" circle></el-button> -->
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, unref } from "vue";
import { ElRow, ElCol, ElAvatar, ElButton, ElTag, ElIcon, ElPopover } from "element-plus";
import { Message } from "@/api/interface/message";
import { ClickOutside as vClickOutside } from "element-plus";

// Props
const props = defineProps<{
  sender: Message.UserProps;
}>();

const phoneRef = ref();

const popPhoneRef = ref();

const onClickPhone = () => {
  unref(popPhoneRef).popPhoneRef?.delayHide?.();
};

// Computed properties
const isMobile = computed(() => window.innerWidth < 640);

// Styles
const headerStyle = {
  borderBottom: "1px solid #dcdfe6",
  backgroundColor: "#f9f9f9",
  padding: "10px 16px",
};

const nameStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
};
</script>

<style>
.ml-2 {
  margin-left: 8px;
}
.mr-1 {
  margin-right: 4px;
}
</style>
