import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8000)
export class MyGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification')
  onNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const header = client.handshake.headers['access-token'];
    console.log({ body, header });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`${client.id} connect!`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`${client.id} disconnect!`);
  }
}
