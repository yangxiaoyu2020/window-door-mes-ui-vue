import type {App} from "vue";
import { I18n, createI18n } from "vue-i18n";
import enMessages from '@/locals/langs/en.json';
import zhMessages from '@/locals/langs/zh.json';
import jpMessages from '@/locals/langs/jp.json';





export const i18n: I18n = createI18n({
    legacy: false,
    locale: "zh",
    messages: {
        en: enMessages,
        zh: zhMessages,
        jp: jpMessages
    }
});

export function useI18n(app: App) {
    app.use(i18n);
}



