<template>
  <div>
    <el-form-item v-if="approvalCondition.type === 'Single'" label="审批用户">
      <el-descriptions direction="vertical" border style="margin-top: 20px">
        <el-descriptions-item label="Username">{{
          approvalCondition.user?.username
        }}</el-descriptions-item>
        <el-descriptions-item label="Telephone">{{
          approvalCondition.user?.phoneNumber
        }}</el-descriptions-item>
      </el-descriptions>
    </el-form-item>

    <el-form-item v-if="approvalCondition.type === 'Multi'" label="审批用户">
      <el-collapse>
        <el-collapse-item :title="approvalCondition.users![0].username +'...'">
          <el-row v-for="user in approvalCondition.users" :key="user.id" :span="8">
            <el-descriptions border style="margin-top: 20px">
              <el-descriptions-item label="Username">{{
                user.username
              }}</el-descriptions-item>
              <el-descriptions-item label="Telephone">{{
                user.phoneNumber
              }}</el-descriptions-item>
            </el-descriptions>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive } from "vue";
import { ElFormItem, ElSelect, ElOption, ElCard, ElRow, ElCol } from "element-plus";
import { Approval } from "@/api/interface/approval";

const props = defineProps<{ inputCondition: Approval.ResApprovalCondition }>();

// Create a local copy of the condition prop

const approvalCondition = reactive(
  props.inputCondition || {
    type: "Single",
    user: {
      id: 0,
      username: "",
      fullName: "",
      phoneNumber: "",
      roleName: "",
      avatar: "",
    },
  }
);
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}
.user-info {
  flex-grow: 1;
}
</style>
