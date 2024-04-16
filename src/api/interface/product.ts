// Product Module

import { UploadFile } from "element-plus";
import { ReqPage } from ".";


export namespace Product {
    export interface ReqProductParams extends ReqPage {
        userId: string
    }
    
    export interface ReqCreateProduct {
        productId: string;
        productName: string;
        fileList: UploadFile[];
    }

    export interface ReqProduct {
        id: string;
        productName: string;
        file: UploadFile;
    }

    export interface ResProductList {
        id: string;
        productName: string;
        productId: string;
        createTime: string;
        updateTime: string;
        fileInfo: ResFile[];
    }

    export interface ResFile {
        fileName: string;
        fileUrl: string;
    }

    export interface ReqFile {
        fileName: string;
        fileUrl: string;
    }

    export interface ResStatus {
        status: number;
    }
}