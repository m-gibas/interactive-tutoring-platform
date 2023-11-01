import { Component, OnInit, inject } from '@angular/core';
import { Observable, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MessagesIoSocketComponent } from './messages-io-socket/messages-io-socket.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  selectedUsername = '';

  users$!: Observable<User[]>;
  // currentUsername$!: Observable<string>;

  currentUser: string = '';

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();

    this.userService
      .getCurrentUsername()
      .pipe(take(1))
      .subscribe((user) => {
        this.currentUser = user.username;
      });

    // a nie moge sprobowac po prostu z cookies wyciąganąć tego? albu tak jak wyżej ^

    // router.events
    //   .pipe(filter((e) => e instanceof NavigationStart))
    //   .subscribe((e) => {
    //     const navigation = router.getCurrentNavigation();
    //     tracingService.trace({ id: navigation.extras.state.tracingId });
    //   });
  }
}
