import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MessagesIoSocketComponent } from './messages-io-socket/messages-io-socket.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    MessagesContainerComponent,
    MessagesIoSocketComponent,
    AsyncPipe
  ]
})
export class ChatComponent implements OnInit {
  private userService = inject(UserService);

  selectedUsername = '';

  users$!: Observable<User[]>;
  // currentUsername$!: Observable<string>;

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }
}
