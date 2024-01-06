import { Component, OnInit, inject } from '@angular/core';
import { Observable, switchMap, take, zip } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { SocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    NgClass,
    MessagesContainerComponent,
    AsyncPipe
  ]
})
export class ChatComponent implements OnInit {
  private userService = inject(UserService);
  private chatService = inject(ChatService);
  private activeRoute = inject(ActivatedRoute);
  private socketService = inject(SocketService);

  users$!: Observable<User[]>;
  recentChatters$!: Observable<string[]>;

  orderedChatters$!: Observable<any>;
  allChatters!: User[];
  orderedChatters!: any;

  selectedUsername = '';
  currentUser = '';
  unreadChats = [''];
  recentChatRoom = '';

  ngOnInit(): void {
    this.orderedObservables();

    this.socketService.connected('global');

    this.socketService.onNewUnreadMessage().subscribe(() => {
      this.orderedObservables();
    });
  }

  orderedObservables(): void {
    zip(
      this.userService.getUsers().pipe(take(1)),
      this.activeRoute.queryParams.pipe(take(1))
    )
      .pipe(
        switchMap((res) => {
          this.allChatters = res[0];
          this.currentUser = res[1]['currentUser'];
          return zip(
            this.chatService.getRecentChatters(this.currentUser).pipe(take(1)),
            this.chatService.getUnreadMessages(this.currentUser).pipe(take(1))
          );
        })
      )
      .subscribe((res) => {
        console.log('recet chatters: ', res[0]);

        this.orderedChatters = res[0];

        this.allChatters.forEach((item) => {
          const username = item.username;
          // Check if the username is not already in orderedChatters
          if (!this.orderedChatters.includes(username)) {
            this.orderedChatters.push(username);
          }
        });

        this.unreadChats = [];
        res[1].forEach((message) => {
          this.unreadChats.push(message.message.firstUserUsername);
        });
      });
  }

  markMessagesAsRead() {
    if (this.recentChatRoom === '')
      this.recentChatRoom = this.generateUniqueRoomName(
        this.currentUser,
        this.selectedUsername
      );
    this.chatService
      .markMessagesAsRead(this.recentChatRoom)
      .pipe(take(1))
      .subscribe(() => this.orderedObservables());

    this.recentChatRoom = this.generateUniqueRoomName(
      this.currentUser,
      this.selectedUsername
    );
    this.chatService
      .markMessagesAsRead(this.recentChatRoom)
      .pipe(take(1))
      .subscribe();
  }

  private generateUniqueRoomName(
    firstUsername: string,
    secondUsername: string
  ): string {
    const sortedUsernames: string[] = [firstUsername, secondUsername].sort();
    return sortedUsernames.join('_');
  }
}
