import http from '@/api';
import { ResPage } from '@/api/interface';
import { Product } from '@/api/interface/product';
import { PRODUCT_SERVER } from '@/api/config';


export const getProductList = (params: Product.ReqProductParams) => {

    return http.get<ResPage<Product.ResProductList>>(PRODUCT_SERVER + `/list`, params);
};

 
export const createProduct = (data: FormData) => {
    const url = `${PRODUCT_SERVER}/create`;
    return http.post<Product.ResStatus>(url, data, { contentType: 'multipart/form-data' });
  };

export const download = (data: Product.ReqFile) => {
    return http.download(PRODUCT_SERVER + `/download`, data)
}

export const convertToFormData = (data: Product.ReqCreateProduct): FormData => {
    const formData = new FormData();
    formData.append('productName', data.productName);
    formData.append('productId', data.productId);
    data.fileList.forEach((file) => {
        if (file.raw) {
            formData.append('fileList', file.raw, file.name); // 直接添加 raw 文件
          }
    });
  
    return formData;
  };


