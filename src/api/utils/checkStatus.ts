import { ElMessage } from "element-plus";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (httpStatus: number) => {
  switch (httpStatus) {
    case 400:
      ElMessage.error(("http.errorMessage.Message400"));
      break;
    case 401:
      ElMessage.error(("http.errorMessage.Message401"));
      break;
    case 403:
      ElMessage.error(("http.errorMessage.Message403"));
      break;
    case 404:
      ElMessage.error(("http.errorMessage.Message404"));
      break;
    case 500:
      ElMessage.error(("http.errorMessage.Message500"));
      break;
    default:
      ElMessage.error(("http.errorMessage.defaultMessage"));
  }
};


