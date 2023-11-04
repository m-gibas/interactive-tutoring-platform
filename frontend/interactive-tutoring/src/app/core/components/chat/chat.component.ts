import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MessagesIoSocketComponent } from './messages-io-socket/messages-io-socket.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  private activeRoute = inject(ActivatedRoute);

  selectedUsername = '';

  users$!: Observable<User[]>;

  currentUser: string = '';

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
    });
  }
}
