import { Login } from "@/api/interface/index";
import { LOGIN_SERVER, MEUN_SERVER } from "@/api/config";

import http from "@/api";

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (data: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(LOGIN_SERVER + `/login`, data, { loading: false }); 
};

// 用户退出登录
export const logoutApi = (data: Login.ReqLogout) => {
  return http.post(LOGIN_SERVER + `/logout`, data, { loading: false });
};

// 获取菜单列表
export const getAuthMenuListApi = (params: Login.ReqParams) => {
  return http.get<Menu.MenuOptions[]>(MEUN_SERVER + `/list`, params, { loading: false });
};

// 获取按钮权限
export const getAuthButtonListApi = (params: Login.ReqParams) => {
  return http.get<Login.ResAuthButtons>(MEUN_SERVER + `/buttons/list`, params, { loading: false });
};