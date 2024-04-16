import { Directive, createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from "./App.vue";
import * as Icons from '@element-plus/icons-vue'
import { usePinia } from '@/stores';
import { useI18n } from '@/locals';
import router from "@/router"
import directives from "@/components/Adds/index";



const app = createApp(App);

app.use(usePinia);
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons]);
  });
app.use(directives).use(ElementPlus).use(router).use(useI18n);
app.mount('#app');