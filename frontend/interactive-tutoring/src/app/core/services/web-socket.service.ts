import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Observer } from 'rxjs';

import * as io from 'socket.io-client';
import { Message } from '../models/message.model';

@Injectable()
export class SocketService {
  private socket!: io.Socket;

  constructor() {
    // this.socket = io.connect('http://localhost:8085', {
    //   withCredentials: true,
    //   transports: ['websocket']
    // });

    this.socket?.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket?.on('connect_error', (event: any) => {
      console.log(`Error: could not connect to WS errormsg: ${event}`);
    });

    this.socket?.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }

  connected(room: string) {
    this.socket = io.connect('http://localhost:8085', {
      withCredentials: true,
      transports: ['websocket'],
      query: { room }
    });

    // this.socket.on('connect', () => {
    //   console.log('connected');

    //   this.socket.on('tableModel', (data) => {
    //     const tableModels = JSON.parse(data);
    //   });
    // });
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
