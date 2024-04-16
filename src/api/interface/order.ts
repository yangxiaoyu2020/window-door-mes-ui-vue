// 工厂模块

import { UploadFile } from "element-plus";
import { ReqPage, ReqPart, ResPart } from ".";
import { OrderStatus, OrderSteps } from "@/enums/order/OrderStatus";


export namespace Order {
    export interface ReqOrderParams extends ReqPage {
        status: number;
    }

    export interface ReqOrderItem {
        orderId: number|undefined;
    }

    export interface ReqTaskSteps {
        userId: number;
    }

    export interface UpdateOrder {
        orderId: number;

    }

    export interface ResOrderList {
        id: number; // Long 对应为 number
        orderName: string;
        customerId: number; // Integer 对应为 number
        productId: string;
        status: string;
        prepaymentAmount: number; // BigDecimal 对应为 number
        totalAmount: number; // BigDecimal 对应为 number
        deliveryDate: string; // Date 对应为 Date 对象
        creationDate: string; // Timestamp 对应为 ISO 8601 日期字符串
        lastUpdate: string; // Timestamp 对应为 ISO 8601 日期字符串
        orderHistories: OrderHistory[];
        attachments: ResFile[];
    }

    // 定义响应接口
    type OrderStepsMap = {
        [K in OrderSteps]: ResOrderList[];
    };
    
    // 使用映射类型定义响应接口
    export interface ResAllTaskList{
        orderTaskMap: OrderStepsMap
    }

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
        taskStatus: OrderSteps;
    }



    export interface ReqCreateOrder {
        orderName: string;
        customerId: string;
        productId: string;
        deliveryDate: string; // Ensure deliveryDate is a Date object
        fileList: UploadFile[];
    }
    export interface ResOrder {
        status: number;
      }
}