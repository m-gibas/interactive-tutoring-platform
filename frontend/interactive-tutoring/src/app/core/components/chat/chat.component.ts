import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent {
  private chatService = inject(ChatService);

  messages$!: Observable<Message[]>;

  ngOnInit(): void {
    this.messages$ = this.chatService.getMessages('ddsada');
  }
}
