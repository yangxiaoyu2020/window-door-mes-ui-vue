<template>
  <el-dialog
    v-model="dialogVisible"
    :destroy-on-close="true"
    width="850px"
    title="编辑图表"
  >
    <div>
      <el-input v-model="editedChart.options.title.text" placeholder="图表标题" />
      <el-select v-model="editedChart.xAxisField" placeholder="选择X轴字段">
        <el-option
          v-for="field in fields"
          :key="field.value"
          :label="field.label"
          :value="field.value"
        />
      </el-select>
      <el-select v-model="editedChart.yAxisField" placeholder="选择Y轴字段">
        <el-option
          v-for="field in fields"
          :key="field.value"
          :label="field.label"
          :value="field.value"
        />
      </el-select>
    </div>
    <div>
      <el-button @click="closeModal">取消</el-button>
      <el-button type="primary" @click="confirmSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from "vue";
import _ from "lodash";

const props = defineProps({
  chart: Object,
});

const emit = defineEmits(["close", "save"]);

// 可选字段
const fields = ref([
  { value: "product_id", label: "产品ID" },
  { value: "order_name", label: "订单名称" },
  { value: "total_amount", label: "总金额" },
  { value: "creation_date", label: "创建日期" },
  // 添加更多字段
]);

// 使用深拷贝来避免直接修改 props 数据
const editedChart = ref(_.cloneDeep(props.chart));
const dialogVisible = ref(false);

// 监听传入的 chart 数据，当其变化时更新本地副本
watch(
  () => props.chart,
  (newVal) => {
    editedChart.value = _.cloneDeep(newVal);
    dialogVisible.value = true;
  },
  { immediate: true }
);

const confirmSave = () => {
  emit("save", _.cloneDeep(editedChart.value));
  closeModal();
};

const closeModal = () => {
  dialogVisible.value = false;
  emit("close");
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-actions {
  margin-top: 20px;
  text-align: right;
}
</style>
