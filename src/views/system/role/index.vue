<template>
  <div class="main-box">
    <TreeFilter
      label="deploymentId"
      title="部门列表(单选)"
      :data="treeFilterData"
      :default-value="initParam.departmentId"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <MyTable
        ref="employeeTable"
        row-key="id"
        :indent="20"
        :columns="columns"
        :request-api="getEmployeeList"
        :request-auto="false"
        :init-param="initParam"
        :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')"
            >新增用户</el-button
          >
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="openDrawer('查看', scope.row)"
            >查看</el-button
          >
          <el-button
            type="primary"
            link
            :icon="EditPen"
            @click="openDrawer('编辑', scope.row)"
            >编辑</el-button
          >
          <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"
            >删除</el-button
          >
        </template>
      </MyTable>
      <UserDrawer ref="drawerRef" />
      <!-- <ImportExcel ref="dialogRef" /> -->
    </div>
  </div>
</template>

<script setup lang="tsx" name="TreeProTable">
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import MyTable from "@/components/table/index.vue";
import TreeFilter from "@/components/treeFilter/index.vue";
import ImportExcel from "@/components/importExcel/index.vue";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import { ColumnProps, MyTableInstance } from "@/components/table/interface";
import {
  getEmployeeList,
  getEmployeeStatus,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getEmployeeItem,
  getEmployeeDepartment,
} from "@/api/modules/employee";
import { Employee } from "@/api/interface/employee";
import { useHandleData } from "@/hook/useHandleData";
import EmployeeDrawer from "./EmployeeDrawer.vue";

onMounted(() => {
  getTreeFilter();
  ElNotification({
    title: "温馨提示",
    message: "该页面 数据请求完成之后，才会触发表格请求。",
    type: "info",
    duration: 10000,
  });
  setTimeout(() => {
    ElNotification({
      title: "温馨提示",
      message: "该页面 数据请求完成之后 x",
      type: "info",
      duration: 10000,
    });
  }, 0);
});

// Table 实例
const employeeTable = ref<MyTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ departmentId: "" });

// 获取 treeFilter 数据
// 当 Table 的 requestAuto 属性为 false，不会自动请求表格数据，等待 treeFilter 数据回来之后，更改 initParam.departmentId 的值，才会触发请求 proTable 数据
const treeFilterData = ref<any>([]);
const getTreeFilter = async () => {
  const { data } = await getEmployeeDepartment();
  treeFilterData.value = data;
  initParam.departmentId = treeFilterData.value[0].id;
};

// 树形筛选切换
const changeTreeFilter = (val: string) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  employeeTable.value!.pageable.pageNum = 1;
  initParam.departmentId = val;
};

// 表格配置项
const columns = reactive<ColumnProps<Employee.ResEmployeeList>[]>([
  { type: "index", label: "#", width: 80 },
  { prop: "username", label: "员工姓名" },
  { prop: "gender", label: "性别" },
  { prop: "phonenumber", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    sortable: true,
    enum: getEmployeeStatus,
    search: { el: "tree-select" },
    fieldNames: { label: "employeeLabel", value: "employeeVable" },
  },
  { prop: "createTime", label: "创建时间", width: 180 },
  { prop: "operation", label: "操作", width: 300, fixed: "right" },
]);

// 删除用户信息
const deleteAccount = async (params: Employee.ReqDeleteEmployeeParams) => {
  await useHandleData(deleteEmployee, { id: [params.id] }, `删除 ${params.username}`);
  employeeTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof EmployeeDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Employee.ResEmployeeList> = {}) => {
  const itemparam: Employee.ReqEmployeeItemParams = {
    id: row.id,
    // 其他可能的参数
  };
  const employeeItem = await getEmployeeItem(itemparam);
  const params = {
    title,
    row: { ...employeeItem.data },
    isView: title === "查看",
    api:
      title === "新增" ? createEmployee : title === "编辑" ? updateEmployee : undefined,
    getTableList: employeeTable.value?.getTableList,
  };
  drawerRef.value?.acceptParams(params);
};
</script>

<style>
@import url("./index.scss");
</style>
