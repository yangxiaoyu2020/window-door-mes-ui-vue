<template>
  <div class="draggable-container">
    <!-- Optional header slot -->
    <slot name="header"></slot>

    <VueDraggable
      class="flex flex-col gap-2 p-4 w-300px h-600px bg-gray-500/5 rounded overflow-auto"
      v-model="list"
      :animation="150"
      ghostClass="ghost"
      group="people"
      @update="handleUpdate"
      @add="handleAdd"
      @remove="handleRemove"
      style="flex: 1 1 auto"
    >
      <el-card v-for="item in list" :key="item.id" class="cursor-move mb-2">
        <template #header>
          <div class="text-lg">{{ item.name }}</div>
        </template>
      </el-card>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import axios from "axios";

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  apiUrl: {
    type: String,
    required: true,
  },
});

function handleUpdate() {
  axios
    .post(`${props.apiUrl}/update`, { list: props.list })
    .then((response) => {
      console.log("List updated:", response.data);
    })
    .catch((error) => {
      console.error("Error updating list:", error);
    });
}

function handleAdd(event) {
  axios
    .post(`${props.apiUrl}/add`, { item: event.item })
    .then((response) => {
      console.log("Item added:", response.data);
    })
    .catch((error) => {
      console.error("Error adding item:", error);
    });
}

function handleRemove(event) {
  axios
    .post(`${props.apiUrl}/remove`, { item: event.item })
    .then((response) => {
      console.log("Item removed:", response.data);
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
}
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
}

.w-300px {
  width: 300px;
}

.h-600px {
  height: 600px;
}

.bg-gray-500\/5 {
  background-color: rgba(107, 114, 128, 0.05);
}

.rounded {
  border-radius: 0.25rem;
}

.overflow-auto {
  overflow: auto;
}

.cursor-move {
  cursor: move;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.el-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
