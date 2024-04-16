<template>
  <div class="main-box">
    <div class="table-box">
      <MyTable
        ref="productTable"
        highlight-current-row
        :columns="columns"
        :request-api="getProductList"
        :init-param="Object.assign(selectFilterValues)"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openCreateDialog('新增')">
            {{ $t("product.create") }}
          </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="openShowDialog('查看', scope.row)"
          >
            {{ $t("product.check") }}
          </el-button>
        </template>
      </MyTable>
      <CreateDialog ref="createDialogRef" />
      <ShowDialog ref="showDialogRef" />
    </div>
  </div>
</template>

<script setup lang="ts" name="ProductTable">
import { ref, reactive, onMounted, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CreateDialog from "./components/CreateDialog.vue";
import MyTable from "@/components/table/index.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View } from "@element-plus/icons-vue";
import { Product } from "@/api/interface/product";

import { getProductList, createProduct, download } from "@/api/modules/product";
import ShowDialog from "./components/ShowDialog.vue";

// MyTable 实例
const productTable = ref<MyTableInstance>();

const columns = reactive<ColumnProps<Product.ResProductList>[]>([
  { type: "radio", width: 80 },
  { type: "index", label: "#", width: 80 },
  { prop: "productId", label: "产品代号", width: 120 },
  { prop: "productName", label: "产品名称", width: 120 },
  { prop: "createTime", label: "创建时间" },
  { prop: "updateTime", label: "更新时间" },

  { prop: "operation", label: "操作", width: 330, fixed: "right" },
]);

const selectFilterValues = ref({ productStatus: "" });
// 选择行
const setCurrent = () => {
  productTable.value!.radio = productTable.value?.tableData[3].id;
  productTable.value?.element?.setCurrentRow(productTable.value?.tableData[3]);
};

watch(
  () => productTable.value?.radio,
  () =>
    productTable.value?.radio &&
    ElMessage.success(`选中 id 为【${productTable.value?.radio}】的数据`)
);
// 打开 dialog

const createDialogRef = ref<InstanceType<typeof CreateDialog> | null>(null);
const openCreateDialog = async (title: string) => {
  const params = {
    title,
    api: createProduct,
  };
  createDialogRef.value?.acceptParams(params);
};

const showDialogRef = ref<InstanceType<typeof ShowDialog> | null>(null);

const openShowDialog = async (
  title: string,
  row: Partial<Product.ResProductList> = {}
) => {
  const params = {
    title,
    row: { ...row },
    api: download,
  };
  showDialogRef.value?.acceptParams(params);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
