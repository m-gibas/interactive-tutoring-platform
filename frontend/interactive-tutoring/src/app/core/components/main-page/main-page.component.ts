import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, filter, take } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  protected currentUser!: string;

  currUser!: Observable<string>;

  ngOnInit(): void {
    this.currUser = this.userService.getCurrentUsername();

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((res) => {
        if (location.pathname === '/') {
          this.userService
            .getCurrentUsername()
            .pipe(take(1))
            .subscribe((user) => {
              this.currentUser = user.username;
              // return true;
            });
        }
      });
  }
}
