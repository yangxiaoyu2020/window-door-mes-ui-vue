<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="850px"
    :title="drawerProps.title"
  >
    <el-form
      ref="ruleFormRef"
      label-width="300px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item :label="$t('orderList.orderName')" prop="">
        <el-input
          v-model="drawerProps.row!.orderName"
          placeholder="请填写客户地址"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderList.deliveryDate')" prop="">
        <div v-if="!drawerProps.isView">
          <el-date-picker
            v-model="drawerProps.row!.deliveryDate"
            dateType="time"
            value-format="x"
            placeholder="Pick a date"
          />
        </div>
        <div v-else-if="drawerProps.isView">
          <TimeZoneConverter
            :inputTime="drawerProps.row!.deliveryDate"
          ></TimeZoneConverter>
        </div>
      </el-form-item>
      <el-form-item :label="$t('orderList.creationDate')" prop="">
        <TimeZoneConverter :inputTime="drawerProps.row!.deliveryDate"></TimeZoneConverter>
      </el-form-item>
      <el-form-item :label="$t('orderList.lastUpdate')" prop="">
        <TimeZoneConverter :inputTime="drawerProps.row!.deliveryDate"></TimeZoneConverter>
      </el-form-item>
      <el-form-item :label="$t('orderList.prepaymentAmount')" prop="">
        <el-input
          v-model="drawerProps.row!.prepaymentAmount"
          placeholder="请填写备注"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('orderList.status')" prop="">
        <el-input
          v-model="drawerProps.row!.status"
          placeholder="请填写备注"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- Attachments Section -->
    <div>
      <h3>Attachments</h3>
      <div v-if="drawerProps.row.attachments && drawerProps.row.attachments.length">
        <div v-for="(attachment, index) in drawerProps.row.attachments" :key="index">
          <template v-if="isImage(attachment.fileName)">
            <img
              :src="attachmentUrls[index]"
              style="width: 100px; height: auto"
              alt="Attachment Image"
            />
            <el-text> {{ attachment.fileName }}</el-text>
          </template>
          <template v-else>
            <i class="el-icon-document"></i> {{ attachment.fileName }}
          </template>
        </div>
      </div>
      <div v-else>No attachments available.</div>
    </div>

    <!-- Order Histories Section -->
    <div>
      <h3>Order Histories</h3>
      <div v-if="drawerProps.row.orderHistories && drawerProps.row.orderHistories.length">
        <div v-for="history in drawerProps.row.orderHistories" :key="history.actionDate">
          <p>
            <strong>{{ history.userName }}</strong> {{ formatDate(history.actionDate) }}
          </p>
          <p>{{ history.notes }}</p>
        </div>
      </div>
      <div v-else>No order histories available.</div>
    </div>

    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button @click="exportPDF()"> 导出PDF </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">
        确定
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="tsx" name="Drawer">
/* eslint-disable */
import { ref, reactive, watchEffect } from "vue";
import { Order } from "@/api/interface/order";
import { ElMessage, FormInstance } from "element-plus";
import { ReqFileUrl, getPresignedUrl } from "@/api/modules/tempUrl";
import TimeZoneConverter from "@/components/FormattedTime/index.vue";

import { useUrlCacheStore } from "@/stores/modules/urlCache";
import { useDownload } from "@/hook/useDownload";
import { downloadOrder } from "@/api/modules/orders";

const rules = reactive({
  orderId: [{ required: true, message: "请填写订单号" }],
  address: [{ required: true, message: "请填写客户地址" }],
  explanation: [{ required: true, message: "请填写备注" }],
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Order.ResOrderList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// Reactive array to store the attachment URLs
const attachmentUrls = ref<string[]>([]);

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {},
});

// Fetch URLs whenever the attachments change

const isImage = (fileName: string) => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName);
};

const getAttachmentUrl = async (fileUrl: string) => {
  const urlCacheStore = useUrlCacheStore();
  const cachedUrl = urlCacheStore.getUrl(fileUrl);

  if (cachedUrl) {
    return cachedUrl;
  }

  const req: ReqFileUrl = {
    fileUrl: fileUrl,
  };
  const response = await getPresignedUrl(req);
  const fileTempUrl = response.data.fileTempUrl || "default-url";
  const expire = response.data.expire ? response.data.expire : Date.now() + 3600 * 1000; // Default to 1 hour if no expire provided

  urlCacheStore.setUrl(fileUrl, fileTempUrl, expire);

  return fileTempUrl;
};
watchEffect(async () => {
  if (drawerProps.value.row.attachments) {
    const urls = await Promise.all(
      drawerProps.value.row.attachments.map((attachment) =>
        getAttachmentUrl(attachment.fileUrl)
      )
    );
    attachmentUrls.value = urls;
  }
});

const formatDate = (timestamp: string) => {
  const date = new Date(parseInt(timestamp, 10));
  return date.toLocaleString();
};
// export const useDownload = async (
//   api: (param: any, options?: any) => Promise<any>,
//   tempName: string,
//   params: any = {},
//   isNotify: boolean = true,
//   fileType: string = ".xlsx",
//   notifyOptions: any = {},
//   apiOptions: any = {}
const exportPDF = async () => {
  const params: Order.ReqOrderItem = {
    orderId: drawerProps.value.row.id,
  };

  useDownload(downloadOrder, "Order" + drawerProps.value.row.id, params, true, ".pdf", {
    title: "Downloading",
    message: "Custom message",
    type: "error",
    duration: 5000,
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
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
  acceptParams,
});
</script>
