<template>
  <div class="main-box">
    <div class="table-box">
      <!-- <div class="card mb10 pt0 pb0">
        <SelectFilter
          :data="selectFilterData"
          :default-values="selectFilterValues"
          @change="changeSelectFilter"
        />
      </div> -->
      <MyTable
        ref="templateTable"
        highlight-current-row
        :columns="columns"
        :request-api="getTemplates"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openCreateDrawer">
            {{ $t("production.createTemplate") }}
          </el-button>
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
        </template>
      </MyTable>
      <TemplateDrawer ref="templateDrawerRef" />
    </div>
  </div>
</template>
<script setup lang="ts" name="FactoryTable">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MyTable from "@/components/table/index.vue";
import TemplateDrawer from "./TemplateDrawer.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { View, CirclePlus } from "@element-plus/icons-vue";
import { createTemplate, getTemplates } from "@/api/modules/production";
import { Production } from "@/api/interface/production";

// MyTable 实例
const templateTable = ref<MyTableInstance>();
/**
 ResTemplateList {
        id: string;
        name: string;
        steps: ProductionStep[];
        createTime: number;
        createdBy: string;
    }
 */
// 表格配置项
const columns = reactive<ColumnProps<Production.ResTemplate>[]>([
  { type: "radio", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "id", label: "ID", width: 80 },
  { prop: "name", label: "名称" },
  { prop: "steps", label: "步骤", width: 320 },
  { prop: "createBy", label: "创建者", width: 200 },
  { prop: "createTime", label: "详情" },
  { prop: "operation", label: "操作", width: 330, fixed: "right" },
]);

watch(
  () => templateTable.value?.radio,
  () =>
    templateTable.value?.radio &&
    ElMessage.success(`选中 id 为【${templateTable.value?.radio}】的数据`)
);

const templateDrawerRef = ref<InstanceType<typeof TemplateDrawer> | null>(null);
const openCreateDrawer = () => {
  const params = {
    title: "production.createTemplate",
    createApi: createTemplate, // 替换为实际的导入订单API
  };
  templateDrawerRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
// const drawerTemplateRef = ref<InstanceType<typeof TemplateDrawer> | null>(null);
// const openDrawer = async (title: string, row: Partial<Production.ResTemplate> = {}) => {
//   const params = {
//     title,
//     isView: false,
//     row: { ...row },
//     getTableList: templateTable.value?.getTableList,
//   };
//   drawerTemplateRef.value?.acceptParams(params);
// };
</script>
