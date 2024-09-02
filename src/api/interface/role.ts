import { ReqPage, ReqPart } from ".";


export namespace Role {

    export interface ReqRoleParams extends ReqPart {
        keyWord?: string;
        username?: string;
        id?: string;
        status?: number;
      }

      export interface ReqUserByRoleParams extends ReqPart {
        keyWord?: string;
        roleId: number;
      }

      export interface ReqCreateRole {
        roleName: string;
        description: string;
        canRead: boolean;
        canWrite: boolean;
        canDelete: boolean;
        canApproval: boolean;
        approvalPriority: number;
      }


      export interface ResRole {
        id: number;
        roleName: string;
        description: string;
        canRead: boolean;
        canWrite: boolean;
        canDelete: boolean;
        canApproval: boolean;
        approvalPriority: number;
      }

}