<template>
  <div class="main-box">
    <div class="table-box">
      <MyTable
        ref="approvalTable"
        highlight-current-row
        :key="tableKey"
        :columns="columns"
        :request-api="getApprovals"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openCreateOrderDialog">
            {{ $t("approval.create") }}
          </el-button>
        </template>
        <template #createTime="scope">
          <TimeZoneConverter :inputTime="scope.row.createTime" />
        </template>
        <template #updateTime="scope">
          <TimeZoneConverter :inputTime="scope.row.updateTime" />
        </template>
        <template #createBy="scope">
          <AsyncAvatar
            :avatar-identifier="scope.row.createBy.avatar || ''"
            :avatar-name="scope.row.createBy.username || ''"
          />
        </template>
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="openDrawer('查看', scope.row)"
          >
            {{ $t("order.check") }}
          </el-button>
          <el-button
            type="primary"
            link
            :icon="EditPen"
            @click="openDrawer('编辑', scope.row)"
          >
            {{ $t("order.edit") }}
          </el-button>
        </template>
      </MyTable>
    </div>

    <!-- 创建审批弹窗 -->
    <el-dialog
      v-model="createDialogVisible"
      title="创建审批"
      width="600px"
      @close="resetCreateForm"
    >
      <el-form
        :model="createForm"
        :rules="createRules"
        ref="createFormRef"
        label-width="100px"
      >
        <el-form-item label="审批名称" prop="name">
          <el-input v-model="createForm.name" placeholder="请输入审批名称" />
        </el-form-item>
        <el-form-item label="审批描述" prop="description">
          <el-input v-model="createForm.description" placeholder="请输入审批描述" />
        </el-form-item>
        <el-form-item label="审批描述" prop="description">
          <el-select
            v-model="createForm.processType"
            placeholder="Select an process type"
            filterable
            remote
            reserve-keyword
            :remote-method="fetchProcessType"
            :loading="loading"
            @scroll-bottom="fetchMoreProcessType"
          >
            <el-option :value="''" disabled :label="'请选择审批类型'">
              <span style="color: #888">请选择审批类型</span>
            </el-option>
            <el-option
              v-for="processType in processTypes"
              :key="processType.id"
              :label="processType.name"
              :value="processType.id"
            >
              <span style="float: left">
                {{ processType.name }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择步骤" prop="steps" label-width="100px">
          <VueDraggable v-model="createForm.steps" animation="150">
            <el-form
              ref="stepFormRef"
              label-position="left"
              require-asterisk-position="right"
              label-width="auto"
              v-for="(newStep, index) in createForm.steps"
              :key="newStep.id"
              class="step-form"
            >
              <el-form-item
                class="step-form-item"
                :label="'Step ' + (index + 1) + ' Name'"
                :prop="'steps.' + index + '.name'"
                :rules="{
                  required: true,
                  message: 'Step name cannot be empty',
                  trigger: 'blur',
                }"
              >
                <el-select
                  v-model="newStep.id"
                  placeholder="Select an approval step"
                  filterable
                  remote
                  reserve-keyword
                  :remote-method="fetchSteps"
                  :loading="loading"
                  @scroll-bottom="fetcheMoreSteps"
                >
                  <el-option :value="''" disabled :label="'请选择步骤'">
                    <span style="color: #888">请选择审批步骤</span>
                  </el-option>
                  <el-option
                    v-for="step in steps"
                    :key="step.id"
                    :label="step.name"
                    :value="step.id"
                  >
                    <span style="float: left">
                      {{ step.name }}
                    </span>
                    <div class="role-details" style="float: right">
                      <span> 审批步骤类型: {{ step.condition.type }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </VueDraggable>
        </el-form-item>

        <el-form-item>
          <el-button class="mt-2" @click.prevent="addStep"> Add Step </el-button>

          <el-button type="primary" @click="save">创建</el-button>
          <el-button @click="resetCreateForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ApprovalTable">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import MyTable from "@/components/table/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import TimeZoneConverter from "@/components/FormattedTime/index.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View } from "@element-plus/icons-vue";
import {
  createApproval,
  getApprovals,
  getScrollSteps,
  getProcessTypes,
} from "@/api/modules/approval";
import { Approval } from "@/api/interface/approval";
import { useI18n } from "vue-i18n";
import { VueDraggable } from "vue-draggable-plus";
import AsyncAvatar from "@/components/table/AsyncAvatar.vue";
import { useUserStore } from "@/stores/modules/user";

// MyTable 实例
const approvalTable = ref<MyTableInstance>();
const stepFormRef = ref<FormInstance>();
const userStore = useUserStore();

const tableKey = ref(0);
const loading = ref(false);
const stepIndex = ref(1);
const processTypesIndex = ref(1);

const processTypes = ref<Approval.ProcessType[]>([]);

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Approval.ResApproval>[]>([
    { type: "radio", width: 80 },
    { prop: "id", label: i18n.t("approval.id"), width: 80 },
    { prop: "name", label: i18n.t("approval.name"), width: 120 },
    { prop: "description", label: i18n.t("approval.name"), width: 120 },
    { prop: "createdBy", label: i18n.t("approval.createdBy"), width: 120 },
    { prop: "processType", label: i18n.t("approval.ProcessType"), width: 120 },
    { prop: "steps", label: i18n.t("approval.steps") },
    { prop: "createTime", label: i18n.t("approval.createTime"), width: 150 },
    { prop: "updateTime", label: i18n.t("approval.updateTime"), width: 150 },
    { prop: "operation", label: i18n.t("userOperation"), width: 330, fixed: "right" },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// 默认 selectFilter 参数
const selectFilterValues = ref({ auditType: "" });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  approvalTable.value!.pageable.pageNum = 1;
  selectFilterValues.value.auditType = value.auditType;
};

// 监听选中行变化
watch(
  () => approvalTable.value?.radio,
  () =>
    approvalTable.value?.radio &&
    ElMessage.success(`选中 id 为【${approvalTable.value?.radio}】的数据`)
);

const reloadApprovalTable = () => {
  approvalTable.value?.getTableList();
};

// 创建审批相关
const createDialogVisible = ref(false);

const createForm = reactive<Approval.ReqCreateApproval>({
  name: "",
  description: "",
  createBy: userStore.userInfo.id,
  processType: undefined,
  steps: [
    {
      id: undefined,
    },
  ],
});

const addStep = () => {
  createForm.steps.push({
    id: undefined,
  });
};
const createFormRef = ref();
const createRules = reactive({
  name: [{ required: true, message: "请输入审批名称", trigger: "blur" }],
  stepIds: [{ required: true, message: "请选择至少一个步骤", trigger: "change" }],
});

const steps = ref<Approval.ResStep[]>([]);

const fetchSteps = async () => {
  try {
    const response = await getScrollSteps({
      index: stepIndex.value,
    });
    steps.value = response.data.list;
  } catch (error) {
    ElMessage.error("获取步骤失败");
  }
};

const fetcheMoreSteps = async () => {
  stepIndex.value += 1;
  try {
    const response = await getScrollSteps({
      index: stepIndex.value,
    });
    steps.value = response.data.list;
  } catch (error) {
    ElMessage.error("获取步骤失败");
  }
};

const fetchProcessType = async () => {
  try {
    const response = await getProcessTypes({
      index: processTypesIndex.value,
    });
    processTypes.value = response.data.list;
  } catch (error) {
    ElMessage.error("获取步骤失败");
  }
};

const fetchMoreProcessType = async () => {
  processTypesIndex.value += 1;
  try {
    const response = await getProcessTypes({
      index: processTypesIndex.value,
    });
    processTypes.value = response.data.list;
  } catch (error) {
    ElMessage.error("获取步骤失败");
  }
};

const openCreateOrderDialog = () => {
  createDialogVisible.value = true;
};

const resetCreateForm = () => {
  createForm.name = "";
  createForm.steps = [];
  createDialogVisible.value = false;
};

const save = async () => {
  try {
    await createApproval(createForm);
    ElMessage.success("审批创建成功");
    reloadApprovalTable();
    resetCreateForm();
  } catch (error) {
    ElMessage.error("创建审批失败");
  }
};
</script>

<style scoped>
.table-box {
  width: calc(100% - 10px);
}

.step-form {
  width: calc(100% - 10px);
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

:deep(.el-form-item__content) {
  min-width: 200px;
}

.step-form-item {
  margin-bottom: 16px;
}
</style>
