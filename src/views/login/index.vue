<template>
  <div class="container">
    <div class="language-selector">
      <LanguageSelector />
    </div>
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from "./components/LoginForm.vue";
import LanguageSelector from "@/locals/components/LanguageSelector.vue";
</script>

<style scoped lang="scss">
@import url("@/style/login.scss");
</style>
