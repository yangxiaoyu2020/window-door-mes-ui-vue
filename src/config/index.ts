// Global default configuration options

// Homepage URL (default)
export const HOME_URL = "/home/index";

// Login page URL (default)
export const LOGIN_URL = "/login";

export const BASE_URL = process.env.VUE_APP_API_BASE_URL;

export const WEBSOCKET_SERVER = "/ws";


// Error page URL
export const ERROR_401_URL = "/401"

export const ERROR_403_URL = "/403"

export const ERROR_404_URL = "/404"

export const ERROR_500_URL = "/500"


import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  easing: "ease", // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});

export default NProgress;