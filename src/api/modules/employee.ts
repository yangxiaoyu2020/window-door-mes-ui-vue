import http from '@/api';
import { ResPage } from '@/api/interface';
import { EMPLOYEE_SERVER } from '@/api/config';
import { Employee } from '../interface/employee';


export const getEmployeeList = (params: Employee.ReqEmployeeParams) => {
    return http.post<ResPage<Employee.ResEmployeeList>>(EMPLOYEE_SERVER + `/list`, params);
};

export const getEmployeeItem = (params: Employee.ReqEmployeeItemParams) => {
    return http.post<Employee.ResEmployeeDetail>(EMPLOYEE_SERVER + `/item`, params);
};

export const getEmployeeDepartment = (params?: Employee.ReqEmployeeParams) => {
    return http.get<Employee.ResEmployeeDepartment[]>(EMPLOYEE_SERVER + `/deployment`, params);
};


export const createEmployee = (params: Employee.ResEmployeeDetail) => {
    return http.post<Employee.ResEmployee>(EMPLOYEE_SERVER + `/create`, params)
}

export const updateEmployee = (params: Employee.ResEmployeeDetail) => {
    return http.put<Employee.ResEmployee>(EMPLOYEE_SERVER   + `/update`, params)
}

export const deleteEmployee = (params: Employee.ReqEmployeeParams) => {
    return http.delete<Employee.ResEmployee>(EMPLOYEE_SERVER   + `/delete`, params)
}


export const getEmployeeStatus = () => {
    return http.get<Employee.ResEmployeeStatus[]>(EMPLOYEE_SERVER   + `/status`)
}

