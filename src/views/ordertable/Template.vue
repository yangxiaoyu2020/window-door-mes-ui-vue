<template>
  <div>
    <!-- MyTable component displaying order steps -->
    <MyTable
      ref="stepTable"
      highlight-current-row
      :key="tableKey"
      :columns="columns"
      :request-api="getOrderSteps"
    >
      <template #createTime="scope">
        <TimeZoneConverter :inputTime="scope.row.created_at" />
      </template>
      <template #updateTime="scope">
        <TimeZoneConverter :inputTime="scope.row.updated_at" />
      </template>
      <template #createdBy="scope">
        <el-avatar>{{ scope.row.created_by.username }}</el-avatar>
      </template>
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog">
          {{ $t("order.createStep") }}
        </el-button>
      </template>
    </MyTable>

    <!-- Dialog for creating a new order step -->
    <el-dialog
      title="创建订单步骤"
      v-model="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form :model="newStep" ref="formRef" label-width="120px">
        <el-form-item label="步骤名称">
          <el-input v-model="newStep.name" placeholder="例如：切割" />
        </el-form-item>

        <el-form-item label="步骤描述">
          <el-input v-model="newStep.description" placeholder="描述这个步骤" />
        </el-form-item>

        <el-form-item label="是否强制">
          <el-switch v-model="newStep.isMandatory" />
        </el-form-item>

        <el-form-item label="是否可以跳过">
          <el-switch v-model="newStep.canBeSkipped" />
        </el-form-item>
      </el-form>

      <!-- Footer buttons -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStep">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { CirclePlus } from "@element-plus/icons-vue";
import TimeZoneConverter from "@/components/FormattedTime/index.vue";
import MyTable from "@/components/table/index.vue";
import { Order } from "@/api/interface/order";
import { useI18n } from "vue-i18n";
import { createOrderStep, getOrderSteps } from "@/api/modules/orders";
import { ColumnProps, MyTableInstance } from "@/components/table/interface";
import { useUserStore } from "@/stores/modules/user";

// MyTable 实例
const stepTable = ref<MyTableInstance>();
const userStore = useUserStore();

const tableKey = ref(0);

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Order.OrderStep>[]>([
    { prop: "id", label: "步骤ID" },
    { prop: "name", label: "步骤名称" },
    { prop: "description", label: "步骤描述" },
    { prop: "created_at", label: "创建时间" },
    { prop: "updated_at", label: "更新时间" },
    { prop: "created_by", label: "创建人" },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// Dialog 可见性
const dialogVisible = ref(false);

// 新的订单步骤数据
const newStep = reactive<Order.ReqCreateStep>({
  name: "",
  createdBy: userStore.userInfo.id,
  description: "",
  isMandatory: true,
  canBeSkipped: false,
  customFields: {},
});

// 表单引用
const formRef = ref<FormInstance>();

// 打开对话框
const openDialog = () => {
  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  newStep.name = "";
  newStep.description = "";
  newStep.isMandatory = true;
  newStep.canBeSkipped = false;
  newStep.customFields = {};
};

// 保存新的订单步骤
const saveStep = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      await createOrderStep(newStep);
      ElMessage.success("订单步骤已保存！");
      dialogVisible.value = false;
      resetForm();
    } else {
      ElMessage.error("请填写必填字段");
    }
  });
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
