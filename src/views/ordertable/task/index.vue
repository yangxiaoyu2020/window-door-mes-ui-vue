<template>
  <div class="main-box">
    <div class="flex-row">
      <div
        class="list-container"
        v-for="(list, index) in allTasks"
        :key="index"
        tabindex="0"
      >
        <h4 style="cursor: pointer; user-select: none">
          <span class="status-text">{{ $t(`orderTask.${index}`) }}</span>
        </h4>
        <div>
          <ul
            v-infinite-scroll="() => load(index)"
            :infinite-scroll-disabled="loading[index]"
            :infinite-scroll-distance="10"
            class="infinite-list"
            style="overflow-y: auto; height: 600px"
          >
            <VueDraggable
              class="draggable"
              v-model="list.tasks"
              :animation="150"
              ghostClass="ghost"
              group="people"
              @update="handleUpdate"
              @add="handleAdd()"
            >
              <template v-if="list.tasks.length === 0">
                <div disabled="true" class="placeholder">Drag items here</div>
              </template>
              <el-card
                v-for="item in list.tasks"
                shadow="hover"
                :key="item.id"
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
                  <AsyncAvatar
                    :avatar-identifier="item.assigened.avatar || ''"
                    :avatar-name="item.assigened.username || ''"
                  />
                </div>
              </el-card>
              <div v-if="loading[index]" class="loading-container">
                <el-icon class="loading-icon">
                  <Loading />
                </el-icon>
              </div>
            </VueDraggable>
          </ul>
          <p v-if="loading[index]">Loading...</p>
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
import { getTasks } from "@/api/modules/orderTasks";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import Dialog from "../components/Dialog.vue";
import AsyncAvatar from "@/components/table/AsyncAvatar.vue";

const userStore = useUserStore();
const allTasks = ref<{ status: number; tasks: Order.ResOrderList[] }[]>([]);
const loading = ref<Record<number, boolean>>({});
const indexs = ref<Record<number, number>>({});
const taskStatus = ref<number[]>([0, 1, 2, 3, 4]);

// 初始化 lists 时为每个状态提供一个空数组

onMounted(async () => {
  await getOrderTasks();
});

const getOrderTasks = async () => {
  try {
    // step1 init all params
    for (const status of taskStatus.value) {
      loading.value[status] = false;
      indexs.value[status] = 0;
    }
    for (const status of taskStatus.value) {
      await loadTasksForStep(status);
    }
  } catch (error) {
    console.error("Failed to load steps:", error);
    ElMessage.error("Failed to load steps");
  }
};

const isException = (index: string) => {
  return index.endsWith("EXCEPTION");
};

const load = async (index: number) => {
  if (loading.value[index]) return; // 如果当前正在加载，直接返回

  loading.value[index] = true;

  try {
    indexs.value[index] = indexs.value[index] + 1; // 增加页码
    const params = {
      userId: userStore.userInfo.id, // 替换为真实的 userId
      status: index,
      index: indexs.value[index],
    };
    const response = await getTasks(params);
    const tasks = response.data.list;
    allTasks.value[index].tasks = [...allTasks.value[index].tasks, ...tasks];
    // Append the mockOrderList to the tasks array of the specific status
  } catch (error) {
    console.error("Failed to load tasks:", error);
    ElMessage.error("Failed to load tasks");
  } finally {
    loading.value[index] = false; // 加载结束
  }
};

const loadTasksForStep = async (status: number) => {
  try {
    loading.value[status] = true;
    const response = await getTasks({
      userId: userStore.userInfo.id,
      status: status,
      index: indexs[status],
    });
    const tasks = response.data.list;
    allTasks.value.push({ status, tasks: tasks });
  } catch (error) {
    console.error("Failed to load tasks for step:", error);
    ElMessage.error("Failed to load tasks");
  } finally {
    loading.value[status] = false;
  }
};

// Event handlers
function handleUpdate() {
  console.log("List updated");
}

function handleAdd() {
  console.log("load");
  console.log(loading.value);
  console.log("Item added in list ");
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
</style>
