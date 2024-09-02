<template>
  <div>
    <!-- MyTable component displaying production steps -->
    <MyTable
      ref="stepTable"
      highlight-current-row
      :key="tableKey"
      :columns="columns"
      :request-api="getSteps"
    >
      <template #createTime="scope">
        <TimeZoneConverter :inputTime="scope.row.createTime" />
      </template>
      <template #updateTime="scope">
        <TimeZoneConverter :inputTime="scope.row.updateTime" />
      </template>
      <template #role="scope">
        {{ scope.row.role.roleName }}
      </template>
      <template #createdBy="scope">
        <AsyncAvatar
          :avatar-identifier="scope.row.createdBy.avatar || ''"
          :avatar-name="scope.row.createdBy.username || ''"
        />
      </template>
      <template #condition="scope">
        <ApprovalConditionComponent
          v-if="scope.row.condition"
          :input-condition="scope.row.condition"
        />
      </template>

      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog">
          {{ $t("approval.createStep") }}
        </el-button>
      </template>
    </MyTable>

    <!-- Dialog for creating a new production step -->
    <el-dialog
      title="创建审批步骤"
      v-model="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form :model="newStep" ref="formRef" label-width="120px">
        <!-- Step Name -->
        <el-form-item label="步骤名称" :rules="rules.nameRule">
          <el-input v-model="newStep.name" placeholder="for instance: Manager approval" />
        </el-form-item>

        <!-- Role Selection -->
        <el-form-item label="审批角色" :rules="rules.roleIdRule">
          <el-select
            v-model="newStep.roleId"
            placeholder="选择审批角色"
            filterable
            remote
            reserve-keyword
            :remote-method="fetchRoles"
            :loading="loading"
            @scroll-bottom="loadMoreRoles"
          >
            <el-option :value="''" disabled :label="'请选择审批角色'">
              <span style="color: #888">请选择审批角色</span>
            </el-option>
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id || ''"
            >
              <span style="float: left">{{ role.roleName }}</span>
              <div class="role-details" style="float: right">
                <span> 审批权限: {{ role.canApproval ? "是" : "否" }}</span>
                <span> 审批优先级: {{ role.approvalPriority }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否强制">
          <el-switch
            v-model="newStep.isMandatory"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>

        <!-- Dynamic Conditions -->
        <el-form-item label="条件类型">
          <el-segmented
            v-model="newStep.condition.type"
            :options="conditionOptions"
            @change="handleConditionChange"
          />
        </el-form-item>

        <!-- Render condition-specific inputs -->
        <div v-if="newStep.condition.type === 'Single'">
          <el-form-item label="必需角色">
            <el-select
              v-model="newStep.condition.userId"
              placeholder="选择审批角色"
              filterable
              remote
              reserve-keyword
              :remote-method="fetchUsers"
              :loading="loading"
              @scroll-bottom="loadMoreUsers"
            >
              <el-option
                v-for="user in users"
                :key="user.id"
                :label="user.username"
                :value="user.id"
              >
                <span style="float: left">
                  {{ user.fullName }}
                </span>
                <div class="role-details" style="float: right">
                  <span> 全名: {{ user.fullName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div v-if="newStep.condition.type === 'Multi'">
          <el-form-item label="多角色顺序">
            <el-select
              v-model="newStep.condition.userIds"
              placeholder="选择审批角色"
              filterable
              multiple
              remote
              reserve-keyword
              :remote-method="fetchUsers"
              :loading="loading"
              @scroll-bottom="loadMoreUsers"
            >
              <el-option
                v-for="user in users"
                :key="user.id"
                :label="user.username"
                :value="user.id"
              >
                <span style="float: left">{{ user.username }}</span>
                <div class="role-details" style="float: right">
                  <span> 全名: {{ user.fullName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- Add Condition Button -->
        <div v-if="newStep.condition.type">
          <el-button type="primary" @click="removeCondition">
            {{ $t("approval.removeCondition") }}
          </el-button>
        </div>
      </el-form>

      <!-- Dialog Footer -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStep">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { CirclePlus } from "@element-plus/icons-vue";
import TimeZoneConverter from "@/components/FormattedTime/index.vue";
import AsyncAvatar from "@/components/table/AsyncAvatar.vue";

import MyTable from "@/components/table/index.vue";
import { Approval } from "@/api/interface/approval";
import { useI18n } from "vue-i18n";

import { createStep, getSteps } from "@/api/modules/approval";
import { getRoleList, getUsersByRole } from "@/api/modules/role";
import { getUserScollList } from "@/api/modules/user";
import ApprovalConditionComponent from "./ApprovalConditionComponent.vue";

import { ColumnProps, MyTableInstance } from "@/components/table/interface";
import { useUserStore } from "@/stores/modules/user";
import { Role } from "@/api/interface/role";
import { User } from "@/api/interface/user";

const stepTable = ref<MyTableInstance>();
const userStore = useUserStore();
const tableKey = ref(0);

// Roles data
const roles = ref<Role.ResRole[]>([]);
const users = ref<User.UserInfo[]>([]);
const loading = ref(false);
const searchKeyword = ref("");
const usersIndex = ref(1);
const rolesIndex = ref(1);
const usersEnd = ref(false);
const rolesEnd = ref(false);
const conditionOptions = ["Single", "Multi"];

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Approval.ResStep>[]>([
    { prop: "id", label: "步骤ID", width: 80 },
    { prop: "name", label: "步骤名称", width: 120 },
    { prop: "role", label: "角色", width: 120 },
    { prop: "createdBy", label: "创建人", width: 180 },
    { prop: "createTime", label: "创建时间", width: 180 },
    { prop: "updateTime", label: "更新时间", width: 180 },
    { prop: "condition", label: "用户自定义", width: 480 },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// Dialog visibility
const dialogVisible = ref(false);

// 表单验证规则
const rules = reactive({
  nameRule: [{ required: true, message: "步骤名称是必填项", trigger: "blur" }],
  roleIdRule: [{ required: true, message: "审批角色是必填项", trigger: "change" }],
});

// New step data
const newStep = reactive<Approval.ReqCreateStep>({
  name: "",
  createdBy: userStore.userInfo.id,
  roleId: undefined,
  isMandatory: false,
  condition: {
    type: "",
  },
});

// Dialog form reference
const formRef = ref<FormInstance>();

// Function to remove a condition
const removeCondition = (index: number) => {
  newStep.condition = { type: "" };
};

// Function to handle condition change
const handleConditionChange = (type: any) => {
  // Reset other fields when the condition type changes
  newStep.condition = { type: type };
};

// Function to open the dialog
const openDialog = () => {
  dialogVisible.value = true;
};

// Function to reset the form
const resetForm = () => {
  formRef.value?.resetFields();
  newStep.name = "";
  newStep.roleId = undefined;
  newStep.condition = { type: "" };
};

// Function to save the new step
const saveStep = async () => {
  try {
    await createStep(newStep);
    ElMessage.success("审批步骤创建成功");
    dialogVisible.value = false;
    tableKey.value += 1; // 强制刷新表格
  } catch (error) {
    ElMessage.error("审批步骤创建失败");
  }
};

// Function to fetch roles
const fetchRoles = async (keyword: string) => {
  try {
    loading.value = true;
    const response = await getRoleList({
      keyWord: keyword || "",
      index: rolesIndex.value,
    });
    roles.value = response.data.list || [];
    rolesEnd.value = response.data.end;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async (keyword: string) => {
  try {
    loading.value = true;
    const response = await getUserScollList({
      keyWord: keyword || "",
      index: usersIndex.value,
    });
    users.value = response.data.list || [];
    usersEnd.value = response.data.end;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

// Function to load more roles when scrolling to the bottom
const loadMoreRoles = async () => {
  if (rolesEnd.value) return;

  try {
    loading.value = true;
    rolesIndex.value += 1;
    const response = await getRoleList({
      index: rolesIndex.value,
      keyWord: searchKeyword.value,
    });
    roles.value = roles.value.concat(response.data.list || []);
    rolesEnd.value = response.data.end;
  } catch (error) {
    ElMessage.error("加载更多角色失败");
  } finally {
    loading.value = false;
  }
};

const loadMoreUsers = async () => {
  if (rolesEnd.value) return;

  try {
    loading.value = true;
    rolesIndex.value += 1;
    const response = await getUsersByRole({
      roleId: newStep.roleId || 0,
      index: rolesIndex.value,
      keyWord: searchKeyword.value,
    });
    roles.value = roles.value.concat(response.data.list || []);
    rolesEnd.value = response.data.end;
  } catch (error) {
    ElMessage.error("加载更多角色失败");
  } finally {
    loading.value = false;
  }
};
</script>
