<template>
  <div class="main-box">
    <!-- <TreeFilter
        title="部门列表(多选)"
        multiple
        label="name"
        :request-api="getDepartment"
        :default-value="treeFilterValues.departmentId"
        @change="changeTreeFilter"
      /> -->
    <div class="table-box">
      <div class="card mb10 pt0 pb0">
        <SelectFilter
          :data="selectFilterData"
          :default-values="selectFilterValues"
          @change="changeSelectFilter"
        />
      </div>
      <MyTable
        ref="factoryTable"
        highlight-current-row
        :columns="columns"
        :request-api="getFactoryList"
        :init-param="Object.assign(selectFilterValues)"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')"
            >$t(新增订单)</el-button
          >

          <!-- <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加订单</el-button>
            <el-button type="primary" :icon="Download" plain @click="downloadFile">导出订单数据</el-button> -->
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
        </template>
      </MyTable>
      <Drawer ref="drawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="FactoryTable">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { orderStatus } from "./utils";
import MyTable from "@/components/table/index.vue";
import Drawer from "./components/Drawer.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View } from "@element-plus/icons-vue";
import { Factory } from "@/api/interface/factory";
import {
  getFactoryList,
  createFactory,
  updateFactory,
  getFactoryItem,
} from "@/api/modules/factory";

// MyTable 实例
const factoryTable = ref<MyTableInstance>();

// 表格配置项
const columns = reactive<ColumnProps<Factory.ResFactoryList>[]>([
  { type: "radio", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "id", label: "ID", width: 120 },
  { prop: "factoryName", label: "工厂名", width: 120 },
  { prop: "createTime", label: "创建时间" },
  { prop: "updateTime", label: "更新时间" },
  { prop: "status", label: "状态" },
  { prop: "processNow", label: "开始日期" },
  // { prop: "details", label: "详细"},
  { prop: "operation", label: "操作", width: 330, fixed: "right" },
]);

// selectFilter 数据（用户角色为后台数据）
// 开始日期 时间 组单号 合同号 库位 当前工序 状态 扇工序 状态 结束日期 时间 交货日期 车间 客户地址 产品名称 颜色 业务技术异常类型异常扇异常类型扇异常宽x高x数量面积扇数金额位置备注纱扇说明操作
const selectFilterData = reactive([
  {
    title: "Order状态(单)",
    key: "orderstatus",
    options: [
      { label: "全部", value: "" },
      { label: "进行中", value: "1", icon: "Loading" },
      { label: "已完成", value: "2", icon: "CircleCheck" },
      { label: "异常", value: "3", icon: "Warning" },
    ],
  },
  {
    title: "工厂步骤",
    key: "factorStatus",
    options: [
      { label: "全部", value: "" },
      { label: "仓库", value: "0", icon: "Loading" },
      { label: "压线", value: "1", icon: "CircleCheck" },
      { label: "异常", value: "2", icon: "Warning" },
    ],
  },
  // {
  //     title: "多选(多)",
  //     key: "key？？？",
  //     multiple: true,
  //     options: []
  // }
]);

const selectFilterValues = ref({ factorStatus: "" });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  factoryTable.value!.pageable.pageNum = 1;
  selectFilterValues.value.factorStatus = value.factorStatus;
};

// 默认 treeFilter 参数
// const treeFilterValues = reactive({ departmentId: ["11"] });
// const changeTreeFilter = (val: string[]) => {
//     ElMessage.success("请注意查看请求参数变化 🤔");
//     factoryTable.value!.pageable.pageNum = 1;
//     // treeFilterValues.departmentId = val;
// };

// 选择行
const setCurrent = () => {
  factoryTable.value!.radio = factoryTable.value?.tableData[3].id;
  factoryTable.value?.element?.setCurrentRow(factoryTable.value?.tableData[3]);
};

watch(
  () => factoryTable.value?.radio,
  () =>
    factoryTable.value?.radio &&
    ElMessage.success(`选中 id 为【${factoryTable.value?.radio}】的数据`)
);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Factory.ResFactoryList> = {}) => {
  if (title === "新增") {
    const params = {
      title,
      isView: false,
      row: { ...{} },
      api: createFactory,
      getTableList: factoryTable.value?.getTableList,
    };
    drawerRef.value?.acceptParams(params);
  } else {
    const itemparam: Factory.ReqFactoryItemParams = {
      id: row.id,
      // 其他可能的参数
    };
    const Item = await getFactoryItem(itemparam);
    const params = {
      title,
      isView: title === "查看",
      row: { ...Item.data },
      api: title === "编辑" ? updateFactory : undefined,
      getTableList: factoryTable.value?.getTableList,
    };
    drawerRef.value?.acceptParams(params);
  }
};
</script>
