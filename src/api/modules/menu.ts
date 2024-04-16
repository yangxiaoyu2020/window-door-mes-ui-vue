import http from '@/api';
import { Menu } from '@/api/interface/menu';
import { MEUN_SERVER } from '../config';

export const getMeunUserList = (params: Menu.ReqUserMenuParams) => {

    return http.get<number[]>(MEUN_SERVER + `/user`, params);
};


export const getMeunList = () => {

    return http.get<Menu.ResMenuList[]>(MEUN_SERVER + `/all`);
};