// 工厂模块

import { MyFile, ReqPage } from ".";
import { Material } from "./material";
import { User } from "./user";


export namespace Production {
    export interface ReqProductions extends ReqPage {
        status: number;
    }

    export interface ReqOrderParams extends ReqPage {
        status?: number;
    }

    
    export interface ReqTemplates extends ReqPage {
        status?: number;
    }

    export interface ReqSteps extends ReqPage {
        status?: number;
    }

    export interface ReqTemplate {
        id: number;
    }

    export interface ReqProduction {
        id: string|undefined;
    }

    export interface ReqCreateProduction {
        id: string;
        details: JSON;
    }

    export interface ReqUpdateProduction {
        id: string;
        details: JSON;
    }
    export interface ReqCreateTemplate {
        id: string;
        name: string;
        steps: ProductionStep[];
    }

    export interface ReqCreateStep {
        name: string;
        createdBy: User.UserInfo
        description?: string;
        customFields?: { [key: string]: CustomField };
      }
    

    


    // Response 

    export interface ResProductionList {
        id: number;
        name: string;
        createTime: number;
        updateTime: number;
        createdBy: User.UserInfo;
        status: number;
        processNow: number;
        steps: ProductionStep[];
    }
    export interface ResProductionOrderList {
        id: number;
        orderId: number;
    }

    export interface ResTemplateStep {
        id: number;
        name: string;
        createTime: number;
        updateTime: number;
        createdBy: User.UserInfo;
        customFields: CustomField[];
    }


      

      


    export interface ResProduction {
        id: string;
        name: string;
        createTime: number;
        updateTime: number;
        status: number;
        processNow: number;
        details?: ProductionDetails[];
    }

    export interface ResTemplate {
        id: string;
        name: string;
        steps: ProductionStep[];
        createTime: number;
        createdBy: string;
    }


    export interface ResStatus {
        status: number;
    }



    // common

    export interface ProductionStep {
        stepId: number;
        stepName: string;
        description?: string;  // 可选字段
        approvalId?: number;
    }


    export interface ProductionDetails {
        MeasurementResults: Material.MeasurementResults;
        quantity?: number; // 数量
        files?: MyFile.FileInfo[]; // DWG文件的地址或路径
      
        materials?: Materials[]; // 材料的id
      
        specialRequirement: SpecialRequirement; // 特殊要求
        
        [key: string]: any; // 允许用户添加自定义字段
       
        
    }

    export interface CustomField {
        label: string;
        value?: any;
        required: boolean;
      }

    interface Materials {
        number: number;
        materialId: number;
        [key: string]: any; // 允许用户添加自定义字段
    }
    interface SpecialRequirement {
        description: string; // 特殊要求的描述
        priority?: 'high' | 'medium' | 'low'; // 优先级（可选）
        additionalInstructions?: string; // 其他指示（可选）
        [key: string]: any; // 允许用户添加自定义字段
      }

    
}