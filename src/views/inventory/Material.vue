<template>
  <div class="main-box">
    <div class="table-box">
      <MyTable
        ref="materialTable"
        highlight-current-row
        :key="tableKey"
        :columns="columns"
        :request-api="getMaterialList"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="createDialog('新增')">
            {{ $t("material.create") }}
          </el-button>
        </template>
        <template #createBy="scope">
          <AsyncAvatar
            :avatar-identifier="scope.row.avatar || ''"
            :avatar-name="scope.row.username || ''"
          />
        </template>
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="showDialog('查看', scope.row)"
          >
            {{ $t("user.check") }}
          </el-button>
          <el-button
            type="primary"
            link
            :icon="EditPen"
            @click="editDialog('编辑', scope.row)"
          >
            {{ $t("user.edit") }}
          </el-button>
        </template>
      </MyTable>
      <MaterialCreateDialog ref="materialCreateDialogRef" />
      <MaterialShowDialog ref="materialShowDialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import MyTable from "@/components/table/index.vue";
import MaterialCreateDialog from "./components/MaterialCreateDialog.vue";
import MaterialShowDialog from "./components/MaterialShowDialog.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View, Upload } from "@element-plus/icons-vue";
import { getMaterialList, createMaterial, updateMaterial } from "@/api/modules/material";
import { useI18n } from "vue-i18n";
import { Material } from "@/api/interface/material";
import AsyncAvatar from "@/components/table/AsyncAvatar.vue";

// MyTable 实例
const materialTable = ref<MyTableInstance>();

const tableKey = ref(0);

// 表格配置
// name varchar(255)
// specification varchar(255)
// type varchar(50)
// supplier varchar(255)
// model varchar(255)
// images json
// quantity double
// unit varchar(50)
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Material.Materials>[]>([
    { type: "selection", width: 80 },
    { prop: "id", label: i18n.t("material.id"), width: 80 },
    { prop: "name", label: i18n.t("material.name"), width: 200 },
    { prop: "specification", label: i18n.t("material.specification") },
    { prop: "type", label: i18n.t("material.type") },
    { prop: "supplier", label: i18n.t("material.supplier") },
    { prop: "model", label: i18n.t("material.model") },
    { prop: "quantity", label: i18n.t("material.quantity") },
    { prop: "unit", label: i18n.t("material.unit") },
    { prop: "images", label: i18n.t("material.images") },
    {
      prop: "operation",
      label: i18n.t("material.operation"),
      width: 330,
      fixed: "right",
    },
  ]);

// 表格配置项
const columns = ref(createColumns());

// 监听语言变化
watch(i18n.locale, () => {
  columns.value = createColumns();
  tableKey.value += 1; // 强制重新渲染 MyTable 组件
});

// 默认 selectFilter 参数
const selectFilterValues = ref({ userStatus: "" });
// 监听选中行变化
watch(
  () => materialTable.value?.radio,
  () =>
    materialTable.value?.radio &&
    ElMessage.success(`选中 id 为【${materialTable.value?.radio}】的数据`)
);

// 打开 drawer(新增、查看、编辑)

const materialCreateDialogRef = ref<InstanceType<typeof MaterialCreateDialog> | null>(
  null
);
const createDialog = async (title: string) => {
  const params = {
    title: title,
    api: createMaterial,
  };
  materialCreateDialogRef.value?.acceptParams(params);
};

const materialShowDialogRef = ref<InstanceType<typeof MaterialShowDialog> | null>(null);
const showDialog = async (title: string, row: Partial<Material.Materials> = {}) => {
  const params = {
    title: title,
    isView: title === "查看",
    row: { ...row },
    api: title === "编辑" ? updateMaterial : undefined,
    getTableList: materialTable.value?.getTableList,
  };
  materialShowDialogRef.value?.acceptParams(params);
};
</script>
<style scoped>
.table-box {
  width: calc(100% - 10px);
}
</style>
