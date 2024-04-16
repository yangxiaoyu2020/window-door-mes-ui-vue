import http from '@/api';
import { TEMP_SERVER } from '@/api/config';


export interface ReqFileUrl  {
    fileUrl?: string;
  }

export interface ResFileUrl {
    fileTempUrl?:string;
    expire?: number
}


export const getPresignedUrl = (fileUrl: ReqFileUrl) => {

    return http.get<ResFileUrl>(TEMP_SERVER + `/presignedurl`, fileUrl);
};


export const downloadFileAndCreateObjectURL = async (url: string): Promise<string> => {
  
  const response = await fetch(url);
  const blob = await response.blob();
  const objectURL = URL.createObjectURL(blob);
  
  // Cache the object URL  
  return objectURL;
};
