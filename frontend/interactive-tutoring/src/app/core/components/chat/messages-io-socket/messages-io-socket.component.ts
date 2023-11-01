import { Component } from '@angular/core';
import { Message } from 'src/app/core/models/message.model';
import { SocketService } from 'src/app/core/services/web-socket.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages-io-socket',
  templateUrl: './messages-io-socket.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor]
})
export class MessagesIoSocketComponent {
  room: string = '';
  message!: string;
  messages: any[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.socketService.connected();
    // this.socketService.onNewMessage().subscribe((message: any) => {
    //   console.log('a tu dziala?', message);
    //   this.messages.push(message);
    // });
  }

  connect() {
    this.socketService.connected(this.room);

    this.socketService.onNewMessage().subscribe((message: Message) => {
      console.log('a tu dziala?', message);

      this.messages.push(message.message);
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
