import { Component, Input, OnChanges, inject } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnChanges {
  @Input() valueChanged: any;

  private userService = inject(UserService);

  users$!: Observable<User[]>;

  ngOnChanges(): void {
    this.users$ = this.userService.getUsers();
  }
}
