<template>
  <!-- 列设置 -->
  <el-drawer v-model="drawerVisible" title="列设置" size="450px">
    <div class="table-main">
      <el-table
        :data="colSetting"
        :border="true"
        row-key="prop"
        default-expand-all
        :tree-props="{ children: '_children' }"
      >
        <el-table-column prop="label" align="center" :label="$t('list.colname')" />
        <el-table-column
          v-slot="scope"
          prop="isShow"
          align="center"
          :label="$t('list.showed')"
        >
          <el-switch v-model="scope.row.isShow"></el-switch>
        </el-table-column>
        <el-table-column
          v-slot="scope"
          prop="sortable"
          align="center"
          :label="$t('list.sorted')"
        >
          <el-switch v-model="scope.row.sortable"></el-switch>
        </el-table-column>
        <template #empty>
          <div class="table-empty">
            <img
              src="@/assets/images/nodata.png"
              width="800"
              height="600"
              alt="notData"
            />
            <div>暂无可配置列</div>
          </div>
        </template>
      </el-table>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="ColSetting">
import { ref } from "vue";
import { ColumnProps } from "@/components/table/interface";
import { defineProps, defineExpose } from "vue";

defineProps<{ colSetting: ColumnProps[] }>();

const drawerVisible = ref<boolean>(false);

const openColSetting = () => {
  drawerVisible.value = true;
};

defineExpose({
  openColSetting,
});
</script>

<style scoped lang="scss">
.cursor-move {
  cursor: move;
}
</style>
