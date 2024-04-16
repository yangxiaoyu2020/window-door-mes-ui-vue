import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type {App} from "vue";
// pinia persist 持久化 本地保存方案

// pinia persist
export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export function usePinia(app: App) {
    app.use(pinia);
}
