<template>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}订单`">
      <el-form
        ref="ruleFormRef"
        label-width="300px"
        label-suffix=" :"
        :rules="rules"
        :disabled="drawerProps.isView"
        :model="drawerProps.row"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="drawerProps.row!.id" placeholder="请填写订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="drawerProps.row!.role" placeholder="请填写客户地址" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="explanation">
          <el-input v-model="drawerProps.row!.deploymentId" placeholder="请填写备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="tsx" name="EmployeeDrawer">
 /* eslint-disable */
import { ref, reactive } from "vue";
import { Employee } from "@/api/interface/employee";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
    username: [{ required: true, message: "请填写姓名" }],
    address: [{ required: true, message: "请填写客户地址" }],
    explanation: [{ required: true, message: "请填写备注" }]
});

interface DrawerProps {
    title: string;
    isView: boolean;
    row: Partial<Employee.ResEmployeeDetail>;
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