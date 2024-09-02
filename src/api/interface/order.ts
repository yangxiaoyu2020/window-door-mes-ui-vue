// 工厂模块

import { UploadFile } from "element-plus";
import { ReqPage, ReqPart, ResPage, ResPart } from ".";
import { User } from "./user";
import { Product } from "./product";


export namespace Order {
    export interface ReqOrderParams extends ReqPage {
        status: number;
    }

    export interface ReqOrderItem {
        orderId: number|undefined;
    }

    export interface ReqTask {
        userId?: number;
        stepIds?: number[];
    }

    export interface ResTask {

    }

    export interface UpdateOrder {
        orderId: number;

    }

    export interface ResOrderList {
        id: number; // Long 对应为 number
        orderName: string;
        customer: User.UserInfo; // Integer 对应为 number
        product: Product.ProductDto;
        status: string;
        prepaymentAmount: number; // BigDecimal 对应为 number
        totalAmount: number; // BigDecimal 对应为 number
        deliveryDate: number; // Date 对应为 Date 对象
        creationDate: number; // Timestamp 对应为 ISO 8601 日期字符串
        lastUpdate: number; // Timestamp 对应为 ISO 8601 日期字符串
        orderHistories: OrderHistory[];
        attachments: ResFile[];
    }

    // 定义响应接口
    

    export interface ResFile {
        fileName: string;
        fileUrl: string;
    }

    export interface LabelSteps {
        label: string;
        value: string;
    }
    

    export interface ResOrderDetails {
        orderId: number; // Long 对应为 number
        orderName: string;
        customerId: number; // Integer 对应为 number
        productId: string;
        status: string;
        prepaymentAmount: number; // BigDecimal 对应为 number
        totalAmount: number; // BigDecimal 对应为 number
        deliveryDate: Date; // Date 对应为 Date 对象
        creationDate: string; // Timestamp 对应为 ISO 8601 日期字符串
        lastUpdate: string; // Timestamp 对应为 ISO 8601 日期字符串
        orderHistory: OrderHistory[];
        attachments: ResFile[];
    }

    export interface OrderHistory {
        status: string ;
        actionDate: string;
        userId: number;
        userName: string;
        notes: string;
    }

    export interface ReqTaskParams  extends ReqPart{
        userId: number;
        status: number;
    }



    export interface ReqCreateOrder {
        orderName: string;
        customerId: string;
        productId: string;
        deliveryDate: string; // Ensure deliveryDate is a Date object
        fileList: UploadFile[];
    }
    export interface ReqOrderSteps extends ReqPage {
        userId: number;
        keyword?: string;
    }
    export interface ReqCreateStep {
        name: string;
        description?: string;
        createdBy: number;
        isMandatory?: boolean;
        needApproval?: boolean;
        approvalId?: number;
    }

    export interface OrderStep {
        id: number;
        name: string;
        description?: string;
        createdBy: User.UserInfo;
        isMandatory?: boolean;
        canBeSkipped?: boolean;
        createTime: string;
        updateTime: string;
    }

    export interface OrderTemplate {
        id: number;
        name: string;
        description?: string;
        createdBy: User.UserInfo;
        steps: TemplateStep[]
    }

    export interface TemplateStep {
        stepId: number;
        stepIndex: number;
        requiresApproval: boolean;
        approvalProcessId?: number;
    }

    export interface ReqOrderTemplate {
        createdBy: number;
        keyword?: string;
    }

    export interface ReqCreateOrderTemplate {
        name: string;
        description?: string;
        createdBy: number;
        steps: TemplateStep[]
    }
}