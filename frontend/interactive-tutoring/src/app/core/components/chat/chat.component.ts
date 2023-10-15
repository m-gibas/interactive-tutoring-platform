import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  private userService = inject(UserService);

  selectedUsername = '';

  users$!: Observable<User[]>;

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }
}
