import { APPROVAL_SERVER } from "@/api/config";
import { Approval } from "@/api/interface/approval";
import { MESResponse, ResPage, ResPart } from "@/api/interface";

import http from "@/api";


export const createStep = (params: Approval.ReqCreateStep) => {
    return http.post<MESResponse.CreateResponse>(APPROVAL_SERVER + `/step`, params);
};



export const getSteps = (params: Approval.ReqApprovalSteps) => {
    return http.get<ResPage<Approval.ResStep>>(APPROVAL_SERVER + `/steps`, params);
};

export const getScrollSteps = (params: Approval.ReqPartSteps) => {
    return http.get<ResPart<Approval.ResStep>>(APPROVAL_SERVER + `/steps/scroll`, params);
};

export const createApproval = (params: Approval.ReqCreateApproval) => {
    return http.post<MESResponse.CreateResponse>(APPROVAL_SERVER + `/process`, params);
};

export const getScrollApproval = (params: Approval.ReqPartApprovals) => {
    return http.get<ResPart<Approval.ResStep>>(APPROVAL_SERVER + `/process/scroll`, params);
};

export const getApprovals = (params: Approval.ReqApprovals) => {
    return http.get<ResPage<Approval.ResApproval>>(APPROVAL_SERVER + `/process`, params);
};

export const getProcessTypes = (params: Approval.ReqProcessType) => {
    return http.get<ResPart<Approval.ProcessType>>(APPROVAL_SERVER + `/process/scroll`, params);
};
