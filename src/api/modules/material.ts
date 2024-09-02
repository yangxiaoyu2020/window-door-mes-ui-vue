import { Material } from "@/api/interface/material";
import { MATERIAL_SERVER } from "@/api/config";

import http from "@/api";
import { MESResponse, ResPage } from "../interface";





export const getMaterialList = (params: Material.ReqMaterials) => {

    return http.get<ResPage<Material.Materials>>(MATERIAL_SERVER + `/list`, params);
};


export const createMaterial = (params: Material.ReqCreateMaterials) => {

    return http.post<MESResponse.CreateResponse>(MATERIAL_SERVER + `/create`, params);
};

export const updateMaterial = (params: Material.ReqUpdateMaterials) => {

    return http.post<MESResponse.CreateResponse>(MATERIAL_SERVER + `/update`, params);
};