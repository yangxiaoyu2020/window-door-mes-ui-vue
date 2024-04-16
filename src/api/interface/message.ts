export namespace Message {
    export interface ReqMessageParams {
      chatId: string;
    }
    export interface ReqParams {
        userId: string;
    }

    export interface CreateMessageParams {
        chatId: string;
        content: string;
        sender: string;
      }
  
    export interface ChatResponse {
        id: string;
        sender: string;
        messages: Message.MessageResponse[];
    }
    export interface MessageResponse {
        id?: string;
        content: string;
        timestamp?: string;
        unread?: boolean;
        sender: string;
        attachment?: {
            fileName: string;
            type: string;
            size: string;
        };
    }

    export interface MessageProps {
        id?: string;
        content: string;
        timestamp?: string;
        unread?: boolean;
        sender: UserProps | "You";
        attachment?: {
            fileName: string;
            type: string;
            size: string;
        };
    }
  
    export interface ChatProps {
        id: string;
        sender: UserProps;
        messages: Message.MessageProps[];
    }
    export interface UserProps {
        userId: string;
        name: string;
        username: string;
        phoneNum: string;
        avatar?: string;
        online: boolean;
    };
}
  






// export type UserProps = {
//     name: string;
//     username: string;
//     avatar: string;
//     online: boolean;
// };
  
// export type MessageProps = {
//   id: string;
//   content: string;
//   timestamp: string;
//   unread?: boolean;
//   sender: UserProps | 'You';
//   attachment?: {
//     fileName: string;
//     type: string;
//     size: string;
//   };
// };

// export type ChatProps = {
//   id: string;
//   sender: UserProps;
//   messages: MessageProps[];
// };
