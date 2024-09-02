import http from '@/api';
import { MESResponse, ResPage, ResPart } from '@/api/interface';
import { Role } from '@/api/interface/role';
import { ROLE_SERVER } from '@/api/config';


export const getRoleList = (params: Role.ReqRoleParams) => {

    return http.get<ResPart<Role.ResRole>>(ROLE_SERVER + `/roles`, params);
};


export const getUsersByRole = (params: Role.ReqUserByRoleParams) => {

    return http.get<ResPart<Role.ResRole>>(ROLE_SERVER + `/users`, params);
};


export const createRole = (params: Role.ReqCreateRole) => {

    return http.post<MESResponse.CreateResponse>(ROLE_SERVER + `/create`, params);
};