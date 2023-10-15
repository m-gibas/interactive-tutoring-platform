import { Component, Input, OnChanges, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/chat.service';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html'
})
export class MessagesContainerComponent implements OnChanges {
  @Input() firstUsername = '';
  @Input() secondUsername = '';

  private chatService = inject(ChatService);

  messages$!: Observable<Message[]>;

  ngOnChanges(): void {
    this.messages$ = this.chatService.getAllMessagesForFirstUser(
      this.firstUsername,
      this.secondUsername
    );
  }
}
