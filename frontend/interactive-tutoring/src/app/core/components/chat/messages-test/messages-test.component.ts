import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/core/models/message.model';
import { WebSocketIoService } from 'src/app/core/services/web-socket-io.service';

@Component({
  selector: 'app-messages-test',
  templateUrl: './messages-test.component.html'
})
export class MessagesTestComponent implements OnInit {
  room: string = 'a';
  message!: string;
  messages: any[] = [];

  constructor(private socketService: WebSocketIoService) {}

  ngOnInit(): void {
    console.log('onInit', this.socketService.onNewMessage);

    // this.socketService.onNewMessage().subscribe((message: any) => {
    //   console.log('a tu dziala?', message);

    //   this.messages.push(message);
    // });
  }

  connect() {
    this.socketService.connect(this.room);
    this.socketService.onNewMessage().subscribe((message: any) => {
      console.log('a tu dziala?', message);

      this.messages.push(message);
    });
  }

  sendMessage() {
    this.socketService.sendMessage({
      firstUserUsername: 'maks1',
      secondUserUsername: 'maks2',
      message: this.message,
      room: this.room
    } as Message);
    this.message = '';
  }

  disconnect() {
    this.socketService.disconnect();
  }
}
