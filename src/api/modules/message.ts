import http from '@/api';
import { ResPage } from '@/api/interface';
import { MESSAGE_SERVER, CHAT_SERVER } from '@/api/config';
import { Message } from '../interface/message';


// API methods
export const createChat = (data: Message.ChatProps) => {
    return http.post<Message.ChatProps>(CHAT_SERVER, data);
  };
  
export const fetchChats = (req: Message.ReqParams) => {
    return http.get<Message.ChatResponse[]>(CHAT_SERVER, req);
};
  
export const fetchMessages = (req: Message.ReqMessageParams) => {
    return http.get<Message.MessageResponse[]>(MESSAGE_SERVER + `/chat`, req);
};
  
export const sendMessage = (req: Message.CreateMessageParams) => {
    return http.post<Message.MessageResponse>(MESSAGE_SERVER, req);
};

export const fetchChatUsers = (req: Message.ReqParams) => {
    return http.get<Message.UserProps[]>(CHAT_SERVER + `/users`, req);

};