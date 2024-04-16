import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from './interface/message';
import { BASE_URL, WEBSOCKET_SERVER } from "@/config";


class WebSocketService {
    private stompClient: Client| null = null;
  
    private initializeWebSocketConnection() {
       
    return new Promise<void>((resolve, reject) => {
        const socket = new SockJS(`${BASE_URL}${WEBSOCKET_SERVER}`);
        const stompConfig: StompConfig = {
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => resolve(),
            onStompError: (error) => {
            console.error('Connection error: ', error);
            reject(error);
            }
        };
        this.stompClient = new Client(stompConfig);
        this.stompClient.activate();
        });
    }
  
    public async connect(roomId: string, onMessageReceived: (message: Message.MessageResponse) => void) {
      if (!this.stompClient || !this.stompClient.connected) {
        await this.initializeWebSocketConnection();
      }
      this.stompClient?.subscribe(`/topic/messages/${roomId}`, (message: any) => {
        onMessageReceived(JSON.parse(message.body));
      });
      
    }
  
    public sendMessage(roomId: string, message: Message.CreateMessageParams) {
        if (this.stompClient && this.stompClient.connected) {
          this.stompClient.publish({ destination: `/app/chat/${roomId}`, body: JSON.stringify(message) });
        }
      }
  
    public async connectUserStatus(userId: string, onStatusChange: (status: any) => void) {
        if (!this.stompClient || !this.stompClient.connected) {
          await this.initializeWebSocketConnection();
        }
        else {
            this.stompClient.publish({ destination: `/app/status/${userId}`, body: JSON.stringify({ online: true }) });
            this.stompClient?.subscribe(`/topic/status/${userId}`, (status: IMessage) => {
            onStatusChange(JSON.parse(status.body));
            });
        }
      }
  
    public sendUserStatus(userId: string, status: any) {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.publish({ destination: `/app/status/${userId}`, body: JSON.stringify(status) });
    }
    }
  }
  

export default new WebSocketService();
