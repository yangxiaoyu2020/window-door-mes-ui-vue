import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config/";



export const loginRouter:RouteRecordRaw[] = [
    {
        path: "/",
        redirect: HOME_URL
    },
    {
        path: LOGIN_URL,
        name: "login",
        component: () => import("@/views/login/index.vue"),
        children: []
    },
    {
        path: "/layout",
        name: "layout",
        component: () => import("@/layout/index.vue"),
        redirect: HOME_URL,
        children: []
      }

]