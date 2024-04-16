import { ReqPage } from ".";

 // 员工管理模块
 export namespace Employee {
    export interface ReqEmployeeParams extends ReqPage {
      username?: string;
      id?: string;
      status?: number;
    }

    export interface ReqEmployeeItemParams  {
      id?: string;
    }

    export interface ReqDeleteEmployeeParams  {
      id: string;
      username: string;
    }
    export interface ResEmployeeList {
      id: string;
      idCard: string;
      username: string;
      gender: number;
      user: { detail: { age: number } };
      phonenumber: string;
      address: string;
      createTime: string;
      updateTime: string;
      status: number;
      avatar: string;
      photo: any[];
      children?: ResEmployeeList[];
    }
    export interface ResEmployee {
      status: number;
    }
    export interface ResEmployeeStatus {
      employeeLabel: string;
      employeeValue: number;
    }
    export interface ResEmployeeDetail {
      id: string;
      name: string;
      deploymentId:  string;
      role: number;
      children?: ResEmployeeDetail[];
    }

    export interface ResEmployeeDepartment {
      id: string;
      deploymentId:  string;
      children?: ResEmployeeDepartment[];
    }
    export interface ResEmployeeRole {
      id: string;
      name: string;
      children?: ResEmployeeRole[];
    }
  }