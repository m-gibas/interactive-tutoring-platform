import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';

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
  private cdr = inject(ChangeDetectorRef);

  users$!: Observable<User[]>;
  recentChatters$!: Observable<string[]>;

  orderedChatters$!: Observable<any>;
  orderedChatters!: any;

  selectedUsername = '';
  currentUser = '';
  unreadChats = [''];

  ngOnInit(): void {
    // this.users$ = this.userService.getUsers();

    // // this.userService
    // //   .getCurrentUsername()
    // //   .pipe(take(1))
    // //   .subscribe((user) => {
    // //     this.currentUser = user.username;
    // //   });

    // this.activeRoute.queryParams.subscribe((queryParams) => {
    //   console.log('queryParams chat', queryParams);
    //   this.currentUser = queryParams['currentUser'];

    //   this.chatService
    //     .getUnreadMessages(this.currentUser)
    //     .subscribe((unreadMessages) => {
    //       console.log('nieprzeczytane wiadomosci: ', unreadMessages);
    //       this.unreadChats = [];

    //       unreadMessages.forEach((message) => {
    //         this.unreadChats.push(message.message.firstUserUsername);
    //       });

    //       // this.cdr.detectChanges();

    //       console.log('this.unreadChats ', this.unreadChats);

    //       // console.log(
    //       //   'some: ',
    //       //   this.unreadChats.some((user) => user === 'maks1')
    //       // );
    //       console.log(
    //         'unread chats includes: ',
    //         this.unreadChats.includes('maks2')
    //       );
    //     });

    //   this.recentChatters$ = this.chatService.getRecentChatters(
    //     this.currentUser
    //   );

    //   this.recentChatters$.subscribe((res) => {
    //     this.orderedChatters = res;
    //   });

    //   // this.users$.subscribe((res) => {
    //   //   res.forEach((item) => this.orderedChatters.push(item.username));

    //   //   console.log('this.orderedChatters', this.orderedChatters);
    //   // });
    //   this.users$.subscribe((res) => {
    //     res.forEach((item) => {
    //       const username = item.username;
    //       // Check if the username is not already in orderedChatters
    //       if (!this.orderedChatters.includes(username)) {
    //         this.orderedChatters.push(username);
    //       }
    //     });

    //     console.log('this.orderedChatters', this.orderedChatters);
    //   });
    // });
    this.activeRoute.queryParams.subscribe((queryParams) => {
      console.log('queryParams chat', queryParams);
      this.currentUser = queryParams['currentUser'];
      this.getData();
    });
  }

  getData() {
    this.chatService
      .getRecentChatters(this.currentUser)
      .pipe(
        switchMap((res) => {
          this.orderedChatters = res;
          return this.userService.getUsers();
        })
      )
      .subscribe((res) => {
        res.forEach((item) => {
          const username = item.username;
          // Check if the username is not already in orderedChatters
          if (!this.orderedChatters.includes(username)) {
            this.orderedChatters.push(username);
          }
        });
      });

    this.chatService
      .getUnreadMessages(this.currentUser)
      .subscribe((unreadMessages) => {
        this.unreadChats = [];

        unreadMessages.forEach((message) => {
          this.unreadChats.push(message.message.firstUserUsername);
        });
      });
  }

  markMessagesAsRead() {
    console.log('markMessagesAsRead ', this.selectedUsername);
    this.chatService
      .markMessagesAsRead(
        this.generateUniqueRoomName(this.currentUser, this.selectedUsername)
      )
      // .markMessagesAsRead(this.currentUser)
      .pipe(take(1))
      .subscribe(() => this.getData());
  }

  private generateUniqueRoomName(
    firstUsername: string,
    secondUsername: string
  ): string {
    const sortedUsernames: string[] = [firstUsername, secondUsername].sort();
    return sortedUsernames.join('_');
  }
}
