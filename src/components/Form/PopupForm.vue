<!-- PopupForm.vue -->
<template>
  <div class="popup-form" v-if="show">
    <form @submit.prevent="submitForm">
      <input type="text" v-model="formData.name" placeholder="Name" />
      <input type="email" v-model="formData.email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
    <el-button @click="show = false">取消</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, getCurrentInstance, nextTick } from "vue";

const show = ref(false);

const formData = ref({
  name: "",
  email: "",
});

const submitForm = () => {
  console.log(formData.value);
  formData.value = {
    name: "",
    email: "",
  };
};


</script>

<style>
@import url(./index.scss);
</style>
