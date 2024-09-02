<template>
  <el-dialog
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="650px"
    :title="`${drawerProps.title}`"
    @close="onDrawerClose"
  >
    <el-form
      ref="formRef"
      :model="productionTemplateForm"
      label-width="auto"
      class="production-template-form"
    >
      <el-form-item
        prop="templateName"
        label="Template Name"
        :rules="[
          {
            required: true,
            message: 'Please input template name',
            trigger: 'blur',
          },
        ]"
      >
        <el-input v-model="productionTemplateForm.templateName" />
      </el-form-item>

      <el-form-item label="Production Steps">
        <VueDraggable v-model="productionTemplateForm.steps" animation="150">
          <el-form
            ref="stepFormRef"
            label-position="left"
            require-asterisk-position="right"
            label-width="auto"
            v-for="(step, index) in productionTemplateForm.steps"
            :key="step.key"
            class="step-form"
          >
            <el-form-item
              class="step-form-item"
              :label="'Step ' + (index + 1) + ' Name'"
              :prop="'steps.' + index + '.name'"
              :rules="{
                required: true,
                message: 'Step name cannot be empty',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="step.name"
                placeholder="Select or create a step"
                filterable
                :allow-create="false"
                default-first-option
              >
                <el-option
                  v-for="(option, i) in predefinedSteps"
                  :key="i"
                  :label="option"
                  :value="option"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              class="step-form-item"
              :label="'Step ' + (index + 1) + ' Description'"
              :prop="'steps.' + index + '.description'"
              :rules="{
                required: false,
                message: 'Step description cannot be empty',
                trigger: 'blur',
              }"
            >
              <el-input v-model="step.description" placeholder="Enter step description" />
            </el-form-item>

            <!-- 添加审批流程 -->
            <el-form-item
              class="step-form-item"
              :label="'Step ' + (index + 1) + ' Approval Process'"
              :prop="'steps.' + index + '.approval'"
              :rules="{
                required: false,
                message: 'Please select or create an approval process',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="step.approval"
                placeholder="Select or create approval process"
                filterable
                :allow-create="false"
                default-first-option
              >
                <el-option
                  v-for="(option, i) in approvalList"
                  :key="i"
                  :label="option"
                  :value="option"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="step-actions">
              <el-button class="ml-2" type="danger" @click.prevent="removeStep(step)">
                Delete Step
              </el-button>
            </el-form-item>
          </el-form>
        </VueDraggable>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
        <el-button class="mt-2" @click.prevent="addStep"> Add Step </el-button>

        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose } from "vue";
import type { FormInstance } from "element-plus";
import { VueDraggable } from "vue-draggable-plus";

interface DrawerProps {
  title: string;
  createApi?: (params: any) => Promise<any>;
}

const drawerVisible = ref(false);
const stepKey = ref(1);
const drawerProps = ref<DrawerProps>({
  title: "",
});

// 接收父组件传过来的参数
const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
const stepFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const productionTemplateForm = reactive<{
  templateName: string;
  steps: ProductionStep[];
}>({
  templateName: "",
  steps: [
    {
      key: 1,
      name: "",
      description: "",
      approval: "",
    },
  ],
});

interface ProductionStep {
  key: number;
  name: string;
  description: string;
  approval: string;
}

// 预定义的生产步骤
const predefinedSteps = ["切割", "打孔", "组装", "玻璃安装", "检验", "包装"];

// 预定义的审批流程
const approvalList = ["主管审批", "技术审核", "质量检验"];

const removeStep = (item: ProductionStep) => {
  const index = productionTemplateForm.steps.indexOf(item);
  if (index !== -1) {
    productionTemplateForm.steps.splice(index, 1);
  }
};

const addStep = () => {
  stepKey.value += 1;

  productionTemplateForm.steps.push({
    key: stepKey.value,
    name: "",
    description: "",
    approval: "",
  });
};

// 创建新的审批流程
const createApproval = (index: number) => {
  const newApprovalName = prompt("Please enter a new approval process name:");
  if (newApprovalName) {
    approvalList.push(newApprovalName);
    productionTemplateForm.steps[index].approval = newApprovalName;
  }
};

const createStep = () => {
  console.log("createStep");
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("Form Submitted:", productionTemplateForm);
      console.log("Form Submitted:", formEl);
      // 可以在这里调用API将表单数据发送到后端
    } else {
      console.log("Form Submission Failed!");
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields();
  productionTemplateForm.steps = [
    {
      key: 1, // 初始步骤的 key，可以根据需要生成
      name: "",
      description: "",
      approval: "",
    },
  ];
};

const onDrawerClose = () => {
  formRef.value?.resetFields();
  productionTemplateForm.steps = [
    {
      key: 1, // 初始步骤的 key，可以根据需要生成
      name: "",
      description: "",
      approval: "",
    },
  ];
};

defineExpose({
  acceptParams,
});
</script>

<style scoped>
.production-template-form {
  margin: 20px;
}

.step-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.step-form {
  background-color: #ffffff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.step-form-item {
  margin-bottom: 16px;
}

.delete-step-button {
  background-color: #f56c6c;
  color: #fff;
}

.delete-step-button:hover {
  background-color: #f44336;
  color: #fff;
}
</style>
