import { InternalAxiosRequestConfig } from "axios";

// 请求响应参数（不包含data）
export interface Result {
    code: string;
    msg: string;
  }
  
  // 请求响应参数（包含data）
  export interface ResultData<T = any> extends Result {
    data: T;
  }
  
  // 分页响应参数
  export interface ResPage<T> {
    list: T[];
    pageNum: number;
    pageSize: number;
    total: number;
  }
  
  // 分页请求参数
  export interface ReqPage {
    pageNum: number;
    pageSize: number;
  }

  export interface ReqPart {
    index: number;
  }

    // 分页响应参数
  export interface ResPart<T> {
    list: T[];
    index: number;
    end: boolean;
  }

  export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    loading?: boolean;
    cancel?: boolean;
    contentType?: string;
  }
  
  // 文件上传模块
  export namespace Upload {
    export interface ResFileUrl {
      fileUrl: string;
    }
  }
  

  
  // 登录模块
  export namespace Login {
    export interface ReqLoginForm {
      username: string;
      password: string;
    }
    export interface ReqLogout {
      userId: number;
    }
    export interface ReqParams {
      userId: number;
    }
    export interface ResLogin {
      token: string;
      username: string;
      userId: number;
      avatar: string;
    }

    export interface ResAuthButtons {
      [key: string]: string[];
    }
  }
  
 