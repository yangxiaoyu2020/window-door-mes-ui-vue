/* eslint-disable */
import { ElNotification } from "element-plus";

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * 
 * 示例用法：
 * 
 * ```typescript
 * useDownload(apiFunction, 'myFile', {}, true, '.xlsx', {
 *   title: "Custom Title",
 *   message: "Custom message",
 *   type: "success",
 *   duration: 5000
 * });
 * ```
 * 
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 * @param {Object} notifyOptions 通知选项 (默认 {})
 * @param {Object} apiOptions API 选项 (默认 {})
 */
export const useDownload = async (
  api: (param: any, options?: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = ".xlsx",
  notifyOptions: any = {},
  apiOptions: any = {}
) => {

  if (isNotify) {
    ElNotification({
      title: "温馨提示",
      message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
      type: "info",
      duration: 3000,
    });
  }

  try {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 每块大小
    let start = 0;
    let end = CHUNK_SIZE;
    let isDownloading = true;
    const chunks: Blob[] = [];

    while (isDownloading) {
      const res = await api({ ...params, range: `bytes=${start}-${end}` }, apiOptions);
      const chunk = new Blob([res]);
      chunks.push(chunk);
      start = end + 1;
      end = start + CHUNK_SIZE;

      // 如果返回的数据长度小于 CHUNK_SIZE，则表示已经到文件末尾
      if (res.size < CHUNK_SIZE) {
        isDownloading = false;
      }
    }

    const blob = new Blob(chunks);
    if ("msSaveOrOpenBlob" in navigator) {
      (navigator as any).msSaveOrOpenBlob(blob, tempName + fileType);
    } else {
      const blobUrl = window.URL.createObjectURL(blob);
      const exportFile = document.createElement("a");
      exportFile.style.display = "none";
      exportFile.download = `${tempName}${fileType}`;
      exportFile.href = blobUrl;
      document.body.appendChild(exportFile);
      exportFile.click();
      document.body.removeChild(exportFile);
      window.URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.error(error);
    ElNotification({...notifyOptions})
  }
};
