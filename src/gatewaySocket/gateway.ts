import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MyGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  onNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const header = client.handshake.headers['access-token'];
    console.log({ body, header });
  }

  @SubscribeMessage('notification')
  onNewMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    console.log({ body, client: client.handshake.headers });
  }
}
