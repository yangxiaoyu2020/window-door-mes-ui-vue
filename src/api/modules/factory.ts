import { FACTORY_SERVER } from "@/api/config";
import { Factory } from "@/api/interface/factory";
import { ResPage } from "@/api/interface";

import http from "@/api";



// 获取用户列表
export const getFactoryList = (params: Factory.ReqFactoryParams) => {
    return http.post<ResPage<Factory.ResFactoryList>>(FACTORY_SERVER + `/list`, params);
};