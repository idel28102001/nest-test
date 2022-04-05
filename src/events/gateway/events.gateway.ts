import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'http';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('post')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('post', payload);
  }

  @SubscribeMessage('delete')
  handleDelMessage(client: Socket, payload: string): void {
    this.server.emit('delete', payload);
  }

  @SubscribeMessage('change')
  handleChangeMessage(client: Socket, payload: string): void {
    this.server.emit('change', payload);
  }
}
