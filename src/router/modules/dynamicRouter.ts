import router from "@/router/index";
import { LOGIN_URL } from "@/config";
import { RouteRecordRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { Login } from "@/api/interface";

// 引入 views 文件夹下所有 vue 文件

const modules = importAll(
    require.context('@/views/', true, /\.vue$/)
);

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async (data: Login.ReqParams) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1.获取菜单列表 && 按钮权限列表
    await authStore.getAuthMenuList(data);
    await authStore.getAuthButtonList(data);
    // TODO：之后考虑给每个menu 加上 buttonlist 目前这个没用 

    // 2.判断当前用户有没有菜单权限
    if (!authStore.authMenuListGet.length) {
      ElNotification({
        title: "无权限访问",
        message: "当前账号无任何菜单权限，请联系系统管理员！",
        type: "warning",
        duration: 3000
      });
      userStore.setToken("");
      router.replace(LOGIN_URL);
      return Promise.reject("No permission");
    }

    // 3.添加动态路由
    authStore.flatMenuListGet.forEach(item => {
      item.children && delete item.children;
      if (item.component && typeof item.component == "string") {
        item.component = modules["." + item.component + ".vue"];        
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw);
      } else {
        router.addRoute("layout", item as unknown as RouteRecordRaw);
      }
    });
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登陆页
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};

// 内部方法
function importAll(r: __WebpackModuleApi.RequireContext) {
    const modules: Record<string, any> = {};
    r.keys().forEach(key => (modules[key] = r(key).default));
    return modules;
}