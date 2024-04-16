<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}用户`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input
          v-model="drawerProps.row!.username"
          :disabled="!drawerProps.isCreate"
          placeholder="请填写用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.fullName')" prop="fullName">
        <el-input
          v-model="drawerProps.row!.fullName"
          :disabled="!drawerProps.isCreate"
          placeholder="请填写用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.phoneNumber')" prop="fullName">
        <el-input
          v-model="drawerProps.row!.phoneNumber"
          placeholder="请填写用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.roleName')" prop="fullName">
        <el-select v-model="drawerProps.row!.roleName" placeholder="请选择角色">
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-tree
      style="max-width: 600px"
      :data="menuData"
      show-checkbox
      :icon="Folder"
      node-key="id"
      :default-expand-all="true"
      :default-checked-keys="defaultCheckedKeys"
      :props="treeProps"
      @check-change="handleCheckChange"
      :disabled="drawerProps.isView"
    />

    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button @click="handleSubmit" v-show="!drawerProps.isView" type="primary">
        确定
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="Drawer">
import { ref, reactive, defineExpose } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface/user";
import { Menu } from "@/api/interface/menu";
import { getMeunList, getMeunUserList } from "@/api/modules/menu";
import { Folder } from "@element-plus/icons-vue";

const rules = reactive({
  username: [{ required: true, message: "请填写用户名" }],
  fullName: [{ required: true, message: "请先填写用户的法律名" }],
  phoneNumber: [{ required: true, message: "请填写用户的电话号码" }],
  roleName: [{ required: true, message: "请选用户权限" }],
});

// 角色选项
const roles = ref([
  { value: "1", label: "Admin" },
  { value: "2", label: "Editor" },
  { value: "3", label: "Viewer" },
  // 添加其他角色选项
]);

// el-tree default props
const treeProps = {
  children: "children",
  label: "label",
};

interface DrawerProps {
  title: string;
  isView: boolean;
  isCreate: boolean;
  row: Partial<User.ResUser>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// tree data and checked keys
const menuData = ref<Menu.ResMenuList[]>([]);
const defaultCheckedKeys = ref<number[]>([]);
const updateCheckedKeys = ref<number[]>([1]);

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  isCreate: false,
  title: "",
  row: {},
});

const initDegaultMenu = async () => {
  try {
    defaultCheckedKeys.value.length = 0;
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
};

const fetchMenuData = async () => {
  try {
    console.log(drawerProps.value.isView);
    const menuList = await getMeunList();
    menuData.value = menuList.data;
    const reqMenu: Menu.ReqUserMenuParams = {
      userId: drawerProps.value.row!.userId?.toString(),
    };
    if (!drawerProps.value.isCreate) {
      const userMenuList = await getMeunUserList(reqMenu);
      defaultCheckedKeys.value = userMenuList.data;
    }
    if (drawerProps.value.isCreate) {
      defaultCheckedKeys.value = [1];
    }
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  initDegaultMenu();
  fetchMenuData();
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return;
    try {
      if (drawerProps.value.isCreate) {
        const reqUser = {
          username: drawerProps.value.row!.username?.toString(),
          fullName: drawerProps.value.row!.fullName?.toString(),
          roleName: drawerProps.value.row!.roleName?.toString(),
          phoneNumber: drawerProps.value.row!.phoneNumber?.toString(),
          menuIds: updateCheckedKeys.value.toString(),
        };
        await drawerProps.value.api!(reqUser);
      } else {
        const reqUser = {
          userId: drawerProps.value.row!.userId?.toString(),
          username: drawerProps.value.row!.username?.toString(),
          fullName: drawerProps.value.row!.fullName?.toString(),
          roleName: drawerProps.value.row!.roleName?.toString(),
          phoneNumber: drawerProps.value.row!.phoneNumber?.toString(),
          menuIds: updateCheckedKeys.value.toString(),
        };
        await drawerProps.value.api!(reqUser);
      }

      // await updateUserMenu(reqUpdate);
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
      ElMessage.error("操作失败！");
    }
  });
};

const handleCheckChange = (data: any, checked: boolean, indeterminate: boolean) => {
  if (drawerProps.value.isView) {
    return;
  }

  const checkedKeys = updateCheckedKeys.value;
  if (checked) {
    if (!checkedKeys.includes(data.id)) {
      checkedKeys.push(data.id);
    }
  } else {
    const index = checkedKeys.indexOf(data.id);
    if (index > -1) {
      checkedKeys.splice(index, 1);
    }
  }

  updateCheckedKeys.value = checkedKeys;
};

defineExpose({
  acceptParams,
});
</script>
