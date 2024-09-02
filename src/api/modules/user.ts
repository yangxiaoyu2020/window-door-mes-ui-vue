import http from '@/api';
import { ResPage, ResPart } from '@/api/interface';
import { User } from '@/api/interface/user';
import { USER_SERVER } from '@/api/config';


export const getUserList = (params: User.ReqUserParams) => {

    return http.get<ResPage<User.ResUser>>(USER_SERVER + `/list`, params);
};

export const getUserScollList = (params: User.ReqUserScollParams) => {

  return http.get<ResPart<User.ResUser>>(USER_SERVER + `/users`, params);
};

export const getUserInfo = (params: User.ReqUserInfo) => {

  return http.get<User.UserInfo>(USER_SERVER + `/item`, params);
};

export const updateUser = (params: User.UpdateUser) => {
    return http.put<User.ResUser>(USER_SERVER + `/update`, params);
}

// export const updatePasswd = (data: User.ReqUpdatePasswd) => {
//     return http.post
// }

export const createUser= (data: User.ReqUser) => {
    const url = `${USER_SERVER}/create`;
    return http.post<User.ResCreate>(url, data);
  };
 
export const uploadUserAvatar = (data: FormData) => {
    const url = `${USER_SERVER}/avatar`;
    return http.post<User.ResUpload>(url, data, { contentType: 'multipart/form-data' });
  };

export const batchCreateUsers = (data: FormData) => {
  const url = `${USER_SERVER}/batchCreate`;
  return http.post<User.ResUpload>(url, data, { contentType: 'multipart/form-data' });
};

  

export const downloadSample = () => {
    return http.download(USER_SERVER + `/downloadsample`)
}



