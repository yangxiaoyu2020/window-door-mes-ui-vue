<template>
  <el-row>
    <el-col :span="24">
      <div class="input-container">
        <el-input
          v-model="localTextAreaValue"
          type="textarea"
          placeholder="Type something here…"
          :autosize="{ minRows: 4, maxRows: 10 }"
          @keydown="handleKeyDown"
          class="text-area"
        />
      </div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="4" :offset="20">
      <el-button
        type="primary"
        :icon="Promotion"
        @click="handleClick"
        class="send-button"
      >
        Send
      </el-button>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps } from "vue";
import { Promotion } from "@element-plus/icons-vue";

interface MessageInputProps {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  onSubmit: () => void;
}

const props = defineProps<MessageInputProps>();
const localTextAreaValue = ref(props.textAreaValue);

const handleClick = () => {
  if (localTextAreaValue.value.trim() !== "") {
    if (props.onSubmit) {
      if (props.setTextAreaValue) {
        props.setTextAreaValue(localTextAreaValue.value.trim());
      }
      props.onSubmit();
    }

    localTextAreaValue.value = "";
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    handleClick();
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
