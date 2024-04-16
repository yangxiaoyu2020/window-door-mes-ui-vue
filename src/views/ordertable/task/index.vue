<template>
  <div class="main-box">
    <SelectFilter
      :data="selectFilterData"
      :default-values="selectFilterValues"
      @change="changeSelectFilter"
    />
    <div class="flex-row">
      <div
        class="list-container"
        v-for="(list, status) in filteredLists"
        :key="status"
        tabindex="0"
      >
        <h4 style="cursor: pointer; user-select: none">
          <span class="status-text">{{ status }}</span>
        </h4>
        <div>
          <ul v-infinite-scroll="() => load(status as OrderSteps)" class="list">
            <VueDraggable
              class="draggable"
              v-model="lists[status]"
              :animation="150"
              ghostClass="ghost"
              group="people"
              @update="handleUpdate"
              @add="handleAdd(status as OrderSteps)"
            >
              <template v-if="list.length === 0">
                <div disabled="true" class="placeholder">Drag items here</div>
              </template>
              <el-card
                v-for="item in list"
                shadow="hover"
                :key="item.orderId"
                @click="openDialog(item)"
                class="card"
              >
                <template #header>
                  <div class="text-lg">Order Name: {{ item.orderName }}</div>
                </template>

                <div>product id: {{ item.productId }}</div>
                <div v-if="isException(item.status)" class="exception-status">
                  <el-tag effect="dark" type="danger">
                    {{ item.status }}
                  </el-tag>
                </div>
                <div v-else>
                  <el-tag effect="dark" type="success">
                    {{ item.status }}
                  </el-tag>
                </div>

                <div>
                  <el-avatar>
                    {{ item.orderHistories[0].userName.charAt(0).toUpperCase() }}
                  </el-avatar>
                  {{ item.orderHistories[0].userName }}
                </div>
              </el-card>
              <div v-if="loading[status]" class="loading-container">
                <el-icon class="loading-icon">
                  <Loading />
                </el-icon>
              </div>
            </VueDraggable>
          </ul>
        </div>
      </div>
    </div>
    <Dialog ref="drawerRef" />
  </div>
</template>

<script setup lang="ts">
import { Order } from "@/api/interface/order";
import { ref, reactive, onMounted, computed } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { Loading } from "@element-plus/icons-vue";
import { OrderSteps } from "@/enums/order/OrderStatus";
import { getAllTask, getTask, getAllSteps, updateOrder } from "@/api/modules/orders";
import { ElMessage } from "element-plus";
import SelectFilter from "@/components/SelectFilter/index.vue";
import { useUserStore } from "@/stores/modules/user";
import Dialog from "../components/Dialog.vue";

const userStore = useUserStore();

type ListsType = {
  [K in OrderSteps]: Order.ResOrderList[];
};

// 初始化 lists 时为每个状态提供一个空数组
const lists = ref<ListsType>({} as ListsType);
const loading = ref<{ [K in OrderSteps]?: boolean }>(
  {} as { [K in OrderSteps]?: boolean }
);
const count = ref<{ [K in OrderSteps]?: number }>({} as { [K in OrderSteps]?: number });

Object.values(OrderSteps).forEach((status) => {
  lists.value[status] = [];
  loading.value[status] = false;
  count.value[status] = 0;
});

// selectFilter 数据
const selectFilterData = reactive([
  {
    title: "Order步骤",
    key: "OrderSteps",
    multiple: true,
    options: [],
  },
]);

// 默认 selectFilter 参数
const selectFilterValues = ref({
  OrderSteps: [""],
});

const isException = (status: string) => {
  return status.endsWith("EXCEPTION");
};

const changeSelectFilter = (value: typeof selectFilterValues.value) => {
  console.log(selectFilterValues.value.OrderSteps);
  ElMessage.success("请注意查看请求参数变化 🤔");
  selectFilterValues.value = value;
};

// 使用计算属性来过滤需要显示的列表
const filteredLists = computed(() => {
  if (
    selectFilterValues.value.OrderSteps.length === 1 &&
    selectFilterValues.value.OrderSteps[0] === ""
  ) {
    return lists.value;
  }
  const selectedStatuses = new Set<OrderSteps>(
    selectFilterValues.value.OrderSteps as OrderSteps[]
  );

  const filtered = Object.fromEntries(
    Object.entries(lists.value).filter(([key, _]) =>
      selectedStatuses.has(key as OrderSteps)
    )
  );
  return filtered;
});

onMounted(async () => {
  try {
    const response = await getAllTask({ userId: userStore.userInfo.userId });
    const tasks = response.data.orderTaskMap;

    for (const status in tasks) {
      if (Object.prototype.hasOwnProperty.call(tasks, status)) {
        lists.value[status as OrderSteps] = reactive(tasks[status]);
      }
    }
  } catch (error) {
    console.error("Failed to load tasks:", error);
    ElMessage.error("Failed to load tasks");
  }
});

onMounted(() => getOrderSteps());
const getOrderSteps = async () => {
  const response = await getAllSteps({ userId: userStore.userInfo.userId });
  const data = response.data;
  data.unshift({ label: "All", value: "" });
  selectFilterData[0].options = data as any;
};

const load = async (status: OrderSteps) => {
  console.log(loading.value[status]);
  loading.value[status] = true;
  const reqParam: Order.ReqTaskParams = {
    taskStatus: status,
    index: count[status],
  };
  const response = await getTask(reqParam);

  setTimeout(() => {
    count[status] += 1;
    lists.value[status].push(...response.data[status]);

    loading.value[status] = false;
  }, 4000);
};

// Event handlers
function handleUpdate() {
  console.log("List updated");
}

function handleAdd(status: OrderSteps) {
  console.log("Item added in list ", status);
}

const dialogRef = ref<InstanceType<typeof Dialog> | null>(null);
const openDialog = async (row: Partial<Order.ResOrderList> = {}) => {
  const params = {
    title: "详情",
    isView: true,
    row: { ...row },
    api: undefined,
  };
  dialogRef.value?.acceptParams(params);
};
</script>

<style scoped lang="scss">
@import "./index.scss";

.list-container.is-collapsed {
  max-height: 0;
}

.el-icon-arrow-down,
.el-icon-arrow-right {
  cursor: pointer;
  margin-right: 5px;
}

/* 使滚动条更明显 */
:deep(.el-scrollbar__bar.is-horizontal) {
  display: block !important;
  margin-right: 10px; /* 右边距 */
}

:deep(.el-scrollbar__thumb) {
  background-color: #0e7cfa;
  margin-right: 10px; /* 右边距 */

  padding: 2px;
  border-radius: 3px;
  border: 7px solid #099bf0;
  display: block !important;
}

/* 调整滚动条滑块的样式 */
:deep(.el-scrollbar__thumb.is-horizontal) {
  background-color: #0e7cfa;
  border: none; /* 移除边框 */
  margin-right: 10px; /* 右边距 */
  border-radius: 3px;
  padding: 2px;
  background-clip: padding-box; /* 确保背景不延伸到边框之外 */
}
</style>
