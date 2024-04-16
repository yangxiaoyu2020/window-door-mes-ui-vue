/**
 * @description：请求配置
 */
export const enum HttpStatusEnum  {
  SUCCESS = 200,
  CREATED = 201,
  BADREQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOTFOUND = 404,
  INTERNALSERVERERROR = 500,
}

export const enum HttpConfigEnum {
    TIMEOUT = 5000,
}
  
  /**
   * @description：请求方法
   */
  export const  enum RequestMethodEnum{
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE"
  }
  
  /**
   * @description：常用的 contentTyp 类型
   */
  export const enum ContentTypeEnum {
    // json
    JSON = "application/json;charset=UTF-8",
    // text
    TEXT = "text/plain;charset=UTF-8",
    // form-data 一般配合qs
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    // form-data 上传
    FORM_DATA = "multipart/form-data;charset=UTF-8"
  }