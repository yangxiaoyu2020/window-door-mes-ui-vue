
 // 员工管理模块
 export namespace Menu {
    export interface ReqUserMenuParams {
      userId: string|undefined;
    }

    export interface ResMenuList {
        id: string;
        label: string;
        children?: ResMenuList[];
    }

}