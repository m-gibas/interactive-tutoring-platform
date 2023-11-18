import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  users$!: Observable<User[]>;
  recentChatters$!: Observable<string[]>;

  orderedChatters$!: Observable<any>;
  orderedChatters!: any;

  selectedUsername = '';
  currentUser = '';

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();

    // this.userService
    //   .getCurrentUsername()
    //   .pipe(take(1))
    //   .subscribe((user) => {
    //     this.currentUser = user.username;
    //   });

    this.activeRoute.queryParams.subscribe((queryParams) => {
      console.log('queryParams chat', queryParams);
      this.currentUser = queryParams['currentUser'];

      this.recentChatters$ = this.chatService.getRecentChatters(
        this.currentUser
      );

      this.recentChatters$.subscribe((res) => {
        this.orderedChatters = res;
      });

      // this.users$.subscribe((res) => {
      //   res.forEach((item) => this.orderedChatters.push(item.username));

      //   console.log('this.orderedChatters', this.orderedChatters);
      // });
      this.users$.subscribe((res) => {
        res.forEach((item) => {
          const username = item.username;
          // Check if the username is not already in orderedChatters
          if (!this.orderedChatters.includes(username)) {
            this.orderedChatters.push(username);
          }
        });

        console.log('this.orderedChatters', this.orderedChatters);
      });
    });
  }
}
