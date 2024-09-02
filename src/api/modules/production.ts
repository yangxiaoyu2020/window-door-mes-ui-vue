import { PRODUCTION_SERVER } from "@/api/config";
import { Production } from "@/api/interface/production";
import { ResPage } from "@/api/interface";

import http from "@/api";



// 获取工程列表
export const getProductions = (params: Production.ReqProductions) => {
    return http.get<ResPage<Production.ResProductionList>>(PRODUCTION_SERVER + `/list`, params);
};

export const getProduction = (params: Production.ReqProduction) => {
    return http.get<Production.ResProduction>(PRODUCTION_SERVER + `/index`, params);
}


export const getTemplates = (params: Production.ReqTemplates) => {
    return http.get<ResPage<Production.ResTemplate>>(PRODUCTION_SERVER + `/listTemplates`, params);
};

export const getTemplateSteps = (params: Production.ReqSteps) => {
    return http.get<ResPage<Production.ResTemplateStep>>(PRODUCTION_SERVER + `/steps`, params);
};

export const getTemplate = (params: Production.ReqTemplate) => {
    return http.get<Production.ResTemplate>(PRODUCTION_SERVER + `/template`, params);
};

export const createTemplate = (params: Production.ReqTemplate) => {
    return http.post<Production.ResStatus>(PRODUCTION_SERVER + `/template`, params);
};


export const createProduction = (params: Production.ReqCreateProduction) => {
    return http.post<Production.ResStatus>(PRODUCTION_SERVER + `/create`, params);
}

export const createProductionStep = (params: Production.ReqCreateStep) => {
    return http.post<Production.ResStatus>(PRODUCTION_SERVER + `/step/create`, params);
}



export const updateProduction = (params: Production.ReqUpdateProduction) => {
    return http.post<Production.ResStatus>(PRODUCTION_SERVER + `/update`, params);
}
