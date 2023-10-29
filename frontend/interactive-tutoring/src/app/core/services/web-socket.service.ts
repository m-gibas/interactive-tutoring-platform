import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';
import { Message } from '../models/message.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class SocketService {
  private socket!: io.Socket;

  constructor() {
    this.socket?.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket?.on('connect_error', (event: any) => {
      console.error(`Error: could not connect to WS: ${event}`);
    });

    this.socket?.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }

  connected(room: string) {
    this.socket = io.connect(environment.socketUrl, {
      withCredentials: true,
      transports: ['websocket'],
      query: { room }
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

  onNewMessage(): Observable<Message> {
    return new Observable<Message>((observer) => {
      this.socket.on('get_message', (res: Message) => {
        console.log('New message received:', res);
        observer.next(res);
      });
    });
  }
}
