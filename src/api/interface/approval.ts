import { MyFile, ReqPage, ReqPart } from ".";
import { Role } from "./role";
import { User } from "./user";


export namespace Approval {
    export interface ReqApprovals extends ReqPage {
        status: number;
        userId?: number;
    }

    export interface ReqApprovalSteps extends ReqPage {
        status?: number;
    }
    export interface ReqPartSteps extends ReqPart {
        status?: number;
        userId?:number;
    }

    export interface ReqPartApprovals extends ReqPart {
        status?: number;
        userId?:number;
    }

    export interface ReqCreateStep {
        name: string;
        createdBy: number; // 假设 UserDto 已定义
        roleId: number | undefined;
        isMandatory: boolean;
        condition: ReqApprovalCondition;
    }

    export interface ReqCreateApproval {
        name: string;
        createBy: number;
        description: string;
        processType?: number;

        steps: ReqCreateApprovalStep[]; // 绑定的步骤 IDs
    }
    export interface ReqCreateApprovalStep {
        id?: number,
    }

    export interface ReqProcessType extends ReqPart {
        userId?: number
    }

    export interface ProcessType {
        id: number;
        name: string;
    }

    export interface ResStep {
        id: number;
        name: string;
        createdBy: User.UserInfo;
        role: Role.ResRole;
        condition: ResApprovalCondition;
        createTime: number;
        updateTime: number;
        isMandatory: boolean;
    }

    export interface ResApproval {
        id: number;
        name: string;
        description: string;
        processType: ProcessType;
        createBy: User.UserInfo;
        steps: ResStep[]; // 绑定的步骤 IDs
    }

// common

    export interface ReqApprovalCondition {
        type: string;
        userId?: number;
        userIds?: number[];
    }


    export interface  ResApprovalCondition {
        type: string;
        user?: User.UserInfo;
        users?: User.UserInfo[];
    }

}