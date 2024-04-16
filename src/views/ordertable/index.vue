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
        ref="orderTable"
        highlight-current-row
        :key="tableKey"
        :columns="columns"
        :request-api="getOrderList"
        :init-param="Object.assign(selectFilterValues)"
      >
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="openCreateOrderDialog">
            {{ $t("order.create") }}
          </el-button>
        </template>
        <template #percentageScope="scope">
          <el-progress
            :percentage="getStatusDetails(scope.row.status).percentage"
            :status="getStatusDetails(scope.row.status).isException ? 'exception' : ''"
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
      <Drawer ref="drawerRef" />
      <CreateOrder ref="createOrderRef" @orderCreated="reloadOrderTable" />
    </div>
  </div>
</template>

<script setup lang="ts" name="OrderTable">
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import MyTable from "@/components/table/index.vue";
import Drawer from "./components/Drawer.vue";
import CreateOrder from "./createOrder/index.vue";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { MyTableInstance, ColumnProps } from "@/components/table/interface";
import { CirclePlus, EditPen, View } from "@element-plus/icons-vue";
import {
  getOrderList,
  createOrder,
  downloadSample,
  getOrderitem,
  updateOrder,
} from "@/api/modules/orders";
import { Order } from "@/api/interface/order";
import { useI18n } from "vue-i18n";
import { OrderStatus } from "@/enums/order/OrderStatus";

// MyTable 实例
const orderTable = ref<MyTableInstance>();

const tableKey = ref(0);

// 表格配置
const i18n = useI18n();
const createColumns = () =>
  reactive<ColumnProps<Order.ResOrderList>[]>([
    { type: "radio", width: 80 },
    { prop: "id", label: i18n.t("orderList.orderId"), width: 120 },
    { prop: "orderName", label: i18n.t("orderList.orderName"), width: 120 },
    { prop: "productId", label: i18n.t("orderList.productId") },
    { prop: "status", label: i18n.t("orderList.status") },
    { prop: "percentageScope", label: i18n.t("orderList.percentage"), width: 150 },
    { prop: "prepaymentAmount", label: i18n.t("orderList.prepaymentAmount") },
    { prop: "totalAmount", label: i18n.t("orderList.totalAmount") },
    { prop: "deliveryDate", label: i18n.t("orderList.deliveryDate") },
    { prop: "creationDate", label: i18n.t("orderList.creationDate") },
    { prop: "lastUpdate", label: i18n.t("orderList.lastUpdate") },
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
    title: "Order状态",
    key: "orderStatus",
    options: [
      { label: "全部", value: "" },
      { label: "进行中", value: "1", icon: "Loading" },
      { label: "已完成", value: "2", icon: "CircleCheck" },
      { label: "异常", value: "3", icon: "Warning" },
    ],
  },
]);

// 默认 selectFilter 参数
const selectFilterValues = ref({ orderStatus: "" });
const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  ElMessage.success("请注意查看请求参数变化 🤔");
  orderTable.value!.pageable.pageNum = 1;
  selectFilterValues.value.orderStatus = value.orderStatus;
};

// 监听选中行变化
watch(
  () => orderTable.value?.radio,
  () =>
    orderTable.value?.radio &&
    ElMessage.success(`选中 id 为【${orderTable.value?.radio}】的数据`)
);

const createOrderRef = ref<InstanceType<typeof CreateOrder> | null>(null);
const openCreateOrderDialog = () => {
  const params = {
    title: "order.create",
    tempApi: downloadSample, // 替换为实际的下载模板API
    importApi: createOrder, // 替换为实际的导入订单API
    getTableList: orderTable.value?.getTableList,
  };
  createOrderRef.value?.acceptParams(params);
};

const reloadOrderTable = () => {
  orderTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Order.ResOrderList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "编辑" ? updateOrder : undefined,
    getTableList: orderTable.value?.getTableList,
  };
  drawerRef.value?.acceptParams(params);
};

const getStatusDetails = (status: OrderStatus) => {
  let percentage = 0;
  let isException = false;
  switch (status) {
    case OrderStatus.Creating:
      percentage = 5;
      break;
    case OrderStatus.Submitted:
      percentage = 10;
      break;
    case OrderStatus.MeasurementVerification:
      percentage = 20;
      break;
    case OrderStatus.Prepayment:
      percentage = 30;
      break;
    case OrderStatus.TechnicalUnpacking:
      percentage = 40;
      break;
    case OrderStatus.Cutting:
      percentage = 50;
      break;
    case OrderStatus.Scheduling:
      percentage = 60;
      break;
    case OrderStatus.PaymentOfBalance:
      percentage = 70;
      break;
    case OrderStatus.Logistics:
      percentage = 80;
      break;
    case OrderStatus.OrderCompletion:
      percentage = 100;
      break;

    // Exception cases
    case OrderStatus.SubmittedException:
      percentage = 5;
      isException = true;
      break;
    case OrderStatus.CreationException:
      percentage = 10;
      isException = true;
      break;
    case OrderStatus.MeasurementVerificationException:
      percentage = 20;
      isException = true;
      break;
    case OrderStatus.PrepaymentException:
      percentage = 30;
      isException = true;
      break;
    case OrderStatus.TechnicalUnpackingException:
      percentage = 40;
      isException = true;
      break;
    case OrderStatus.CuttingException:
      percentage = 50;
      isException = true;
      break;
    case OrderStatus.SchedulingException:
      percentage = 60;
      isException = true;
      break;
    case OrderStatus.PaymentOfBalanceException:
      percentage = 70;
      isException = true;
      break;
    case OrderStatus.LogisticsException:
      percentage = 80;
      isException = true;
      break;
    case OrderStatus.OrderCompletionException:
      percentage = 90;
      isException = true;
      break;
    case OrderStatus.OtherException:
      percentage = 50;
      isException = true;
      break;

    default:
      percentage = 0;
      isException = true;
      break;
  }

  return { percentage, isException };
};
</script>
