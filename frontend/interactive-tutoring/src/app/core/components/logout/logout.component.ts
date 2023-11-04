import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html'
})
export class LogoutComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  ngOnInit(): void {
    this.userService
      .logoutUser()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          alert(err.message);
          this.router.navigateByUrl('/');
        }
      });
  }
}
