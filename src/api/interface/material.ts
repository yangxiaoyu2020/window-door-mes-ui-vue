import { UploadFile } from "element-plus";
import { MyFile, ReqPage } from ".";

export namespace Material {

  export interface ReqMaterials extends ReqPage {
    status: number;
  }
  
  export interface ReqCreateMaterials {
    name: string;
    unit: string;
    specification: string;
    type: string;
    model: string;
    imageFiles?: UploadFile[];
    dwgFiles?: UploadFile[];
  }

  export interface ReqUpdateMaterials {
    id: number;
    name: number;
    description: string;
    imageFiles?: UploadFile[];
    dwgFiles?: UploadFile[];
  }



  export interface Materials {
    id: number;
    name: string;
    specification: string;
    type: string;
    model: string;
    images: MyFile.FileInfo[];
    quantity: number;
    unit: string;
  }

  export interface MaterialInfo {
    id: number;
    name: string;
    files: MyFile.FileInfo[];
    description?: string;
    details: MaterialDetails
  }


  export interface MaterialDetails {
    type?: string; // 材料类型（例如铝、PVC等，用户可自定义）
    grade?: string; // 材料等级（可选，用户可自定义）
    supplier?: string; // 供应商（可选，用户可自定义）
    thickness?: number; // 厚度（可选）
    finish?: finish; // 表面处理（可选，用户可自定义）
    [key: string]: any; // 允许用户添加自定义字段
  }

    // 测量结果的接口，支持自定义字段
  export interface MeasurementResults {
    [key: string]: number; // 测量结果的详细数据（用户可自定义字段名称）
  }

  // 特殊要求的接口，支持自定义字段


  export interface finish {
    color?: string; // 颜色
    coatingType?: string; // 涂层类型（用户可自定义）
    texture?: string; // 纹理（可选，用户可自定义）
    glossLevel?: string; // 光泽度（可选，用户可自定义）
    [key: string]: any | undefined; // 允许用户添加自定义字段
  };
}