// 工厂模块

import { ReqPage } from ".";


export namespace Factory {
    export interface ReqFactoryParams extends ReqPage {
        username: string;
        status: number;

    }
    export interface ResFactoryList {
        id: string;
        factoryName: string;
        details: string;
        address: string;
        createTime: number;
        updateTime: number;
        status: number;
    }
    export interface ResStatus {
        userLabel: string;
        userValue: number;
    }
}