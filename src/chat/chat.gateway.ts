import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Observable, from, map } from 'rxjs';

//@WebSocketGateway()
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  //해당 gateway가 실행되면 가장먼저 실행되는 함수
  afterInit(server: any) {
    console.log('서버실행');
  }

  connectedClients: { [socketId: string]: boolean } = {};
  clientNickname: { [socketId: string]: string } = {};
  roomUsers: { [key: string]: string[] } = {};

  //연결이되면 실행되는 함수
  async handleConnection(client: Socket, ip: string): Promise<void> {
    console.log('연결완료');
    //console.log(client);
    console.log(client.id);

    this.chatService.addUserList(client.id);
  }

  //연결이끝나면 실행되는 함수
  handleDisconnect(client: Socket): void {
    console.log('연결종료');
    this.chatService.deleteUserList(client.id);
  }

  @SubscribeMessage('events')
  async handleEvent(@MessageBody() message: string) {
    this.server.emit('message', message);
  }

  @SubscribeMessage('events2')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }
}
