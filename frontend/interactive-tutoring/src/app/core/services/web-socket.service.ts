// import { Injectable } from '@angular/core';
// import { Message } from '../models/message.model';
// import { environment } from 'src/environments/environment';
// import { Client, Frame, IMessage } from '@stomp/stompjs';
// import * as SockJS from 'sockjs-client';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private apiUrl = environment.apiBaseUrl;
//   private stompClient!: Client;

//   webSocket!: WebSocket;
//   messages: Message[] = [];

//   public connect() {
//     this.webSocket = new WebSocket(`ws://${this.apiUrl}/ws`);
//     // this.stompClient = Stomp.over(this.webSocket);

//     const socket = new SockJS('http://your-server-url/ws');
//     this.stompClient.configure({
//       webSocketFactory: () => socket,
//       connectHeaders: {},
//       debug: (msg) => console.log(msg)
//     });

//     this.stompClient.onConnect = (frame: Frame) => {
//       // Handle the connection when it is established
//       console.log('Connected:', frame);

//       // Subscribe to a topic
//       this.stompClient.subscribe('/topic/public', (message) => {
//         this.handleIncomingMessage(message);
//       });
//     };

//     this.stompClient.onStompError = (frame: Frame) => {
//       // Handle errors
//       console.error('STOMP Error:', frame);
//     };

//     // this.stompClient.configure({
//     //   brokerURL: `ws://${this.apiUrl}/ws`,
//     //   onConnect: () => this.onConnected(),
//     //   onStompError: (error) => this.onError(error)
//     // });

//     this.stompClient.activate();

//     // this.webSocket.onopen = (event) => {
//     //   console.log('Connection successful ', event);
//     // };

//     // this.webSocket.onmessage = (event) => {
//     //   this.messages.push(JSON.parse(event.data));
//     // };

//     // this.webSocket.onclose = (event) => {
//     //   console.log('Connection closed ', event);
//     // };
//   }

//   private handleIncomingMessage(message: IMessage) {
//     // Handle incoming messages here
//     console.log('Received message:', message.body);
//   }

//   sendMessage(destination: string, message: string) {
//     this.stompClient.publish({
//       destination,
//       body: message
//     });
//   }

//   public onConnected() {
//     this.stompClient.subscribe('/topic/public', (message) =>
//       this.onMessageReceived(message)
//     );

//     this.stompClient.publish({
//       destination: 'app/add-user'
//       // body: JSON.stringify({ username: this.username, type: 'JOIN' })
//     });
//   }

//   public onError(err: any) {}

//   // może te metody pozmieniać na private później jak nie są potrzebne
//   onMessageReceived(payload: any) {
//     const message = JSON.parse(payload.body);

//     this.messages.push(message);
//   }

//   // public sendMessage(newMessage: Message) {
//   //   this.webSocket.send(JSON.stringify(newMessage));
//   // }

//   public disconnect() {
//     // this.webSocket.close();
//   }
// }
