import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Message } from '../models/message.model';
import { tap } from 'rxjs';

@Injectable()
export class WebSocketIoService {
  constructor(private socket: Socket) {}

  connect(room: string) {
    this.socket.ioSocket.io.opts.query = { room };
    console.log(this.socket);

    this.socket.connect();
    // this.socket.emit('join', { room });

    console.log('connect test');

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.fromEvent('connect').subscribe(() => {
      console.log('Connected to WebSocket server');
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  sendMessage(message: Message) {
    console.log('WEBSOCKETIO', message);

    this.socket.emit('send_message', message, (ack: any) => {
      if (ack instanceof Error) {
        console.error('Error sending message:', ack);
      } else {
        console.log('Message sent successfully');
      }
    });
  }

  onNewMessage() {
    console.log('nowa wiadomosc');

    return this.socket.fromEvent('get_message').pipe(
      tap((res) => {
        console.log('dziala?', res);
      })
    );
  }

  // addUser(message: any) {
  //   this.socket.emit('add-user', message);
  // }

  // onReceivedMessage() {
  //   return this.socket.fromEvent('topic/public');
  // }
}
