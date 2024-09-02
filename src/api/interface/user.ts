import { ReqPage, ReqPart } from ".";

 // 员工管理模块
 // eslint-disable-next-line @typescript-eslint/no-namespace
 export namespace User {
    export interface ReqUserParams extends ReqPage {
      username?: string;
      id?: string;
      status?: number;
    }

    export interface ReqUserScollParams extends ReqPart {
        keyWord?: string;
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
        id: number;
        username: string;
        fullName: string;
        phoneNumber: string;
        avatar: string;
        roleName: string;
    }

    export interface UserInfo{
        id: number;
        username: string;
        fullName: string;
        phoneNumber: string;
        avatar: string;
    }



    export interface ResCreate {
        message: string
    }

    export interface ResUpload {
        message: string
    }

}