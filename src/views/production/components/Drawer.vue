<template>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}订单`">
      <el-form
        ref="ruleFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="drawerProps.row!.orderId" placeholder="请填写订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="drawerProps.row!.address" placeholder="请填写客户地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="explanation">
          <el-input v-model="drawerProps.row!.processNow" placeholder="工序" clearable></el-input>
        </el-form-item>
      </el-form>
    <div v-show="drawerProps.isView" class="timeline-factory">
      <el-timeline :size="50"
      style="
      justify-content: center;
      display:flex; 
      width: 100%
      flex-direction: row;
      size: 50px">
      <el-timeline-item 
      class="timeline-parent"
        v-for="(activity, index) in drawerProps.row!.details"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
        @click="toggleChildTimeline(activity)"
      >
      <span style="width: 200%;  margin: 10px auto;">
        {{ activity.content }}
      </span>
          <el-timeline v-if="activity.showChildren && activity.children && activity.children.length">
            <el-timeline-item 
            class="timeline-children"
              v-for="(childActivity, childIndex) in activity.children"
              :key="childIndex"
              :icon="childActivity.icon"
              :type="childActivity.type"
              :color="childActivity.color"
              :size="childActivity.size"
              :hollow="childActivity.hollow"
              :timestamp="childActivity.timestamp"
              placement="top"
            >
            {{ childActivity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-timeline-item>
    </el-timeline>
    </div>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="tsx" name="Drawer">
 /* eslint-disable */
import { ref, reactive } from "vue";
import { Order } from "@/api/interface/order";
import { ElMessage, FormInstance } from "element-plus";

//        id: string;
// factoryName: string;
//         createTime: number;
//         updateTime: number;
//         status: number;
//         processNow: number;
const rules = reactive({
    factoryName: [{ required: true, message: "请填写订单号" }],
    createTime: [{ required: true, message: "请填写客户地址" }],
    updateTime: [{ required: true, message: "请填写备注" }]
});

interface DrawerProps {
    title: string;
    isView: boolean;
    row: Partial<Order.ResOrderList>;
    api?: (params: any) => Promise<any>;
    getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
    isView: false,
    title: "",
    row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
    drawerProps.value = params;
    drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
    ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
        await drawerProps.value.api!(drawerProps.value.row);
        ElMessage.success({ message: `${drawerProps.value.title}成功！` });
        drawerProps.value.getTableList!();
        drawerVisible.value = false;
    } catch (error) {
        console.log(error);
    }
    });
};

defineExpose({
    acceptParams
});
</script>