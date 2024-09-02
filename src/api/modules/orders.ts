import http from '@/api';
import { MESResponse, ResPage, ResPart } from '@/api/interface';
import { Order } from '@/api/interface/order';
import { ORDER_SERVER, PDF_SERVER } from '@/api/config';


export const getOrderList = (params: Order.ReqOrderParams) => {

    return http.get<ResPage<Order.ResOrderList>>(ORDER_SERVER + `/list`, params);
};



export const getSteps= (params: Order.ReqOrderSteps) => {

    return http.get<ResPage<Order.OrderStep>>(ORDER_SERVER + `/steps`, params);
};


export const createTemplate= (params: Order.ReqCreateOrderTemplate) => {

    return http.post<MESResponse.CreateResponse>(ORDER_SERVER + `/template`, params);
};

export const getTemplates= (params: Order.ReqOrderTemplate) => {

    return http.get<ResPage<Order.OrderTemplate>>(ORDER_SERVER + `/templates`, params);
};

export const getOrderitem = (params: Order.ReqOrderItem) => {

    return http.get<Order.ResOrderDetails>(ORDER_SERVER + `/item`, params);
};

export const updateOrder = (params: Order.UpdateOrder) => {
    return http.put<MESResponse.UpdateResponse>(ORDER_SERVER + `/update`, params);
}

export const createOrderStep = (params: Order.ReqCreateStep) => {
    return http.post<MESResponse.CreateResponse>(ORDER_SERVER + `/step`, params);
}

export const getOrderSteps = (params: Order.ReqOrderSteps) => {
    return http.get<ResPage<Order.OrderStep>>(ORDER_SERVER + `/update`, params);
}
 
export const createOrder = (data: FormData) => {
    const url = `${ORDER_SERVER}/create`;
    return http.post<MESResponse.CreateResponse>(url, data, { contentType: 'multipart/form-data' });
  };

export const downloadSample = (data: Order.ReqOrderItem) => {
    return http.download(ORDER_SERVER + `/downloadsample`, data)
}

export const downloadOrder= (params: Order.ReqOrderItem) => {
    return http.download(PDF_SERVER + `/order`, params)
}

export const convertToFormData = (data: Order.ReqCreateOrder): FormData => {
    console.log("deliveryDate");
    console.log(data.deliveryDate);
    const formData = new FormData();
    formData.append('orderName', data.orderName);
    formData.append('customerId', data.customerId);
    formData.append('productId', data.productId);
    formData.append('deliveryDate', data.deliveryDate);
  
    // 添加文件列表到 FormData 中
    data.fileList.forEach((file) => {
        if (file.raw) {
            formData.append('fileList', file.raw, file.name); // 直接添加 raw 文件
          }
    });
  
    return formData;
  };


