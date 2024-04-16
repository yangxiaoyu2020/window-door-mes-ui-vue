import { ReqPage } from ".";

 // 员工管理模块
 // eslint-disable-next-line @typescript-eslint/no-namespace
 export namespace User {
    export interface ReqUserParams extends ReqPage {
      username?: string;
      id?: string;
      status?: number;
    }

    export interface ReqUserInfo {
        userId: string;
    }

    export interface UpdateUser {
        fullName?: string;
        phoneNumber?: string;
    }

    export interface ReqUser {
        username: string;
        phoneNumber: string;
        fullname?: string;
        roleName: string;
        menus: number[];
    }

    export interface ResUser {
        username: string;
        fullName: string;
        phoneNumber: string;
        avatar: string;
        userId: number;
        roleName: string;
    }

    export interface UserInfo{
        username: string;
        fullName: string;
        phoneNumber: string;
        avatar: string;
        userId: string;
    }


    export interface ResCreate {
        message: string
    }

    export interface ResUpload {
        message: string
    }

}