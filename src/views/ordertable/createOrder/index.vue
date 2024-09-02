<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${$t(parameter.title)}`"
    :destroy-on-close="true"
    width="880px"
    draggable
    @open="fetchProductList"
  >
    <el-form class="drawer-multiColumn-form" label-width="auto">
      <el-form-item label="订单创建方式 :">
        <el-radio-group v-model="activeTab">
          <el-radio-button value="manual">手动创建</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="activeTab === 'manual'">
        <el-form-item :label="$t('orderList.orderName')">
          <el-input v-model="orderData.orderName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('orderList.productId')">
          <el-select v-model="orderData.productId" placeholder="Select a product">
            <el-option
              v-for="product in productList"
              :key="product.id"
              :label="product.productName"
              :value="product.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('orderList.deliveryDate')">
          <el-date-picker
            v-model="orderData.deliveryDate"
            dateType="time"
            value-format="x"
            placeholder="Pick a date"
          />
        </el-form-item>
        <el-form-item label="上传文件" class="el-form-upload">
          <el-upload
            v-model:file-list="orderData.fileList"
            action="#"
            :drag="true"
            :multiple="true"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>

            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop="handlePictureCardPreview(file)"
                  >
                    <el-icon><ZoomIn /></el-icon>
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="innerdialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>
      </div>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t("message.cancel") }}</el-button>
      <el-button type="primary" @click="createOrder">{{
        $t("message.confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script setup lang="ts" name="CreateOrder">
import { ref, defineExpose } from "vue";
import { ElNotification, ElUpload } from "element-plus";
import { UploadFilled, Delete, ZoomIn } from "@element-plus/icons-vue";
import type { UploadFile } from "element-plus";
import { Order } from "@/api/interface/order";
import { convertToFormData } from "@/api/modules/orders";
import { useUserStore } from "@/stores/modules/user";
import { getProductList } from "@/api/modules/product";
import { Product } from "@/api/interface/product";

const userStore = useUserStore();

const dialogVisible = ref(false);
const innerdialogVisible = ref(false);
const dialogImageUrl = ref("");
const activeTab = ref("manual");
const productList = ref<Product.ResProductList[]>([]);

export interface ParameterProps {
  title: string;
  fileSize?: number;
  fileType?: File.ExcelMimeType[];
  tempApi?: (params: any) => Promise<any>;
  importApi?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const parameter = ref<ParameterProps>({
  title: "",
  fileSize: 5,
  fileType: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
});

const fetchProductList = async () => {
  try {
    const reqParams: Product.ReqProductParams = {
      userId: userStore.userInfo.id.toString(),
      pageNum: 1,
      pageSize: 10,
    };
    const response = await getProductList(reqParams); // 替换为你的实际后端接口
    productList.value = response.data.list;
  } catch (error) {
    console.error("Error fetching product list:", error);
  }
};

const acceptParams = (params: ParameterProps) => {
  parameter.value = params;
  dialogVisible.value = true;
};

const notify = (options: {
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
}) => {
  ElNotification(options);
};

const orderData = ref<Order.ReqCreateOrder>({
  orderName: "",
  customerId: userStore.userInfo.id.toString(),
  productId: "",
  deliveryDate: "", // 初始化为当前日期
  fileList: [],
});

const handleRemove = (file: UploadFile) => {
  const index = orderData.value.fileList.indexOf(file);
  if (index !== -1) {
    orderData.value.fileList.splice(index, 1);
  }
};
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  innerdialogVisible.value = true;
};

const createOrder = async () => {
  try {
    console.log("Upload Excel functionality to be implemented");

    if (activeTab.value === "manual") {
      // 调用相关API
      console.log(orderData.value.deliveryDate);
      const formData = convertToFormData(orderData.value);

      try {
        const res = await parameter.value.importApi!(formData);

        if (res.code === 200) {
          notify({
            title: "成功",
            message: `添加${parameter.value.title}成功`,
            type: "success",
          });
        } else {
          throw new Error(`API returned unexpected code: ${res.code}`);
        }
      } catch (apiError) {
        const error = apiError as Error;
        notify({
          title: "错误",
          message: `添加${parameter.value.title}失败: ${error.message}`,
          type: "error",
        });
        console.error("API error:", error);
      }
    } else {
      notify({
        title: "错误",
        message: "添加功能尚未实现",
        type: "error",
      });
      console.log("Upload Excel functionality to be implemented");
    }
  } catch (error) {
    const err = error as Error;
    notify({
      title: "错误",
      message: `发生未知错误: ${err.message}`,
      type: "error",
    });
    console.error("Unexpected error:", err);
  } finally {
    dialogVisible.value = false; // 无论成功或失败，均关闭对话框
    orderData.value = {
      orderName: "",
      customerId: userStore.userInfo.id.toString(),
      productId: "",
      deliveryDate: "", // 初始化为当前日期
      fileList: [],
    };
  }
};

defineExpose({ dialogVisible, acceptParams });
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
