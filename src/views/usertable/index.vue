<template>
  <div class="main-box">
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter
          :data="selectFilterData"
          :default-values="selectFilterValues"
          @change="changeSelectFilter"
        />
      </div>
      <MyTable
        ref="userTable"
        highlight-current-row
        :key="tableKey"
        :columns="columns"
        :request-api="getUserList"
        :init-param="Object.assign(selectFilterValues)"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">
            {{ $t("user.create") }}
          </el-button>
          <el-button type="primary" :icon="Upload" plain @click="batchAdd">
            {{ $t("user.batchAdd") }}
          </el-button>
        </template>
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="openDrawer('查看', scope.row)"
          >
            {{ $t("user.check") }}
          </el-button>
          <el-button
            type="primary"
            link
            :icon="EditPen"
            @click="openDrawer('编辑', scope.row)"
          >
            {{ $t("user.edit") }}
          </el-button>
        </template>
      </MyTable>
      <Drawer ref="drawerRef" />
      <ImportExcel ref="dialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="UserTable">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import MyTable from "@/components/table/index.vue";
import Drawer from "./components/Drawer.vue";
import ImportExcel from "@/components/importExcel/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View, Upload } from "@element-plus/icons-vue";
import {
  getUserList,
  createUser,
  downloadSample,
  uploadUserAvatar,
  updateUser,
} from "@/api/modules/user";
import { User } from "@/api/interface/user";
import { useI18n } from "vue-i18n";

// MyTable 实例
const userTable = ref<MyTableInstance>();

const tableKey = ref(0);

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<User.ResUser>[]>([
    { type: "radio", width: 80 },
    // { type: "index", label: "#", width: 80 },
    { prop: "userId", label: i18n.t("user.userId"), width: 120 },
    { prop: "username", label: i18n.t("user.username"), width: 120 },
    { prop: "fullName", label: i18n.t("user.fullName") },
    { prop: "phoneNumber", label: i18n.t("user.phoneNumber") },
    { prop: "roleName", label: i18n.t("user.roleName") },

    { prop: "operation", label: i18n.t("userOperation"), width: 330, fixed: "right" },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// selectFilter 数据
const selectFilterData = reactive([
  {
    title: "User状态(单)",
    key: "userStatus",
    options: [
      { label: "all", value: "" },
      { label: "active", value: "1", icon: "Loading" },
      { label: "inavtive", value: "2", icon: "CircleCheck" },
    ],
  },
]);

// 默认 selectFilter 参数
const selectFilterValues = ref({ userStatus: "" });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  userTable.value!.pageable.pageNum = 1;
  selectFilterValues.value.userStatus = value.userStatus;
};

// 监听选中行变化
watch(
  () => userTable.value?.radio,
  () =>
    userTable.value?.radio &&
    ElMessage.success(`选中 id 为【${userTable.value?.radio}】的数据`)
);

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: downloadSample,
    importApi: uploadUserAvatar,
    getTableList: userTable.value?.getTableList,
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = async (title: string, row: Partial<User.ResUser> = {}) => {
  const params = {
    title: title,
    isView: title === "查看",
    isCreate: title === "新增",
    row: { ...row },
    api: title === "新增" ? createUser : title === "编辑" ? updateUser : undefined,
    getTableList: userTable.value?.getTableList,
  };
  drawerRef.value?.acceptParams(params);
};
</script>
