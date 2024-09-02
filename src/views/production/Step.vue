<template>
  <div>
    <!-- Button to open the dialog -->
    <!-- MyTable component displaying production steps -->
    <MyTable
      ref="stepTable"
      highlight-current-row
      :key="tableKey"
      :columns="columns"
      :request-api="getTemplateSteps"
    >
      <template #createTime="scope">
        <TimeZoneConverter :inputTime="scope.row.createTime" />
      </template>
      <template #updateTime="scope">
        <TimeZoneConverter :inputTime="scope.row.updateTime" />
      </template>
      <template #createBy="scope">
        <el-avatar>{{ scope.row.createdBy.createBy.username }} </el-avatar>
      </template>
      <template #customFields="scope">
        <div v-for="(field, key) in scope.row.customFields" :key="key">
          <div>{{ field.label }}: {{ field.value }}</div>
          <div>Required ：{{ field.required }}</div>
        </div>
      </template>
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog">
          {{ $t("production.createStep") }}
        </el-button>
      </template>
    </MyTable>

    <!-- Dialog for creating a new production step -->
    <el-dialog
      title="创建生产步骤"
      v-model="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <div>
        <el-form :model="newStep" ref="formRef" label-width="120px">
          <el-form-item label="步骤名称">
            <el-input v-model="newStep.name" placeholder="例如：cutting" />
          </el-form-item>

          <el-form-item label="步骤描述">
            <el-input v-model="newStep.description" placeholder="描述这个步骤" />
          </el-form-item>

          <div v-for="(field, key) in newStep.customFields" :key="key">
            <el-form-item :label="'输入字段'">
              <el-input v-model="field.label" />
            </el-form-item>
            <el-form-item :label="'输入字段数值'">
              <el-input v-model="field.value" />
            </el-form-item>
            <el-form-item label="是否必选">
              <el-switch v-model="field.required" />
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="removeCustomField(key.toString())">
                删除自定义字段
              </el-button>
            </el-form-item>
          </div>

          <el-button @click="addCustomField">添加自定义字段</el-button>
        </el-form>
      </div>

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
import { View, CirclePlus } from "@element-plus/icons-vue";
import TimeZoneConverter from "@/components/FormattedTime/index.vue";

import MyTable from "@/components/table/index.vue";
import { Production } from "@/api/interface/production";
import { useI18n } from "vue-i18n";

import { createProductionStep, getTemplateSteps } from "@/api/modules/production";
import { ColumnProps, MyTableInstance } from "@/components/table/interface";
import { useUserStore } from "@/stores/modules/user";

// MyTable 实例
const stepTable = ref<MyTableInstance>();
const userStore = useUserStore();

const tableKey = ref(0);

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Production.ResTemplateStep>[]>([
    { prop: "id", label: "步骤ID" },
    { prop: "name", label: "步骤名称" },
    { prop: "description", label: "步骤描述" },
    { prop: "createTime", label: "创建时间" },
    { prop: "updateTime", label: "更新是按" },
    { prop: "createdBy", label: "创建人" },
    { prop: "customFields", label: "用户自定义" },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// Production steps data
const productionSteps = ref<Production.ReqCreateStep[]>([]);

// Dialog visibility
const dialogVisible = ref(false);

// New step data
const newStep = reactive<Production.ReqCreateStep>({
  name: "",
  createdBy: userStore.userInfo,
  description: "",
  customFields: {},
});

// Form reference
const formRef = ref<FormInstance>();

// Open dialog
const openDialog = () => {
  dialogVisible.value = true;
};

// Reset form and dialog visibility
const resetForm = () => {
  newStep.name = "";
  newStep.description = "";
  newStep.customFields = {};
};

// Add a custom field to the step
const addCustomField = () => {
  const key = `field${Object.keys(newStep.customFields!).length + 1}`;
  newStep.customFields![key] = {
    label: `自定义字段${key}`,
    required: false,
  };
};

// Remove a custom field from the step
const removeCustomField = (key: string | undefined) => {
  if (key) {
    delete newStep.customFields![key];
  }
};

// Save the new step
const saveStep = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      await createProductionStep(newStep);
      productionSteps.value.push({ ...newStep });
      ElMessage.success("生产步骤已保存！");
      console.log(newStep.customFields);
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
