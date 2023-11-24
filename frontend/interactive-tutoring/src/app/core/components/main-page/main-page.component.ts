import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { filter, take } from 'rxjs';
import { SocketService } from '../../services/web-socket.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, AsyncPipe, MatSnackBarModule],
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private socketService = inject(SocketService);
  private snackBar = inject(MatSnackBar);

  protected currentUser!: string;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((res) => {
        // if (location.pathname === '/') {
        this.userService
          .getCurrentUsername()
          .pipe(take(1))
          .subscribe((user) => {
            this.currentUser = user.username;
            // return true;
          });
        // }
      });

    this.socketService.connected('global');

    this.socketService.onNewUnreadMessage().subscribe((newMessage: Message) => {
      if (newMessage.secondUserUsername === this.currentUser)
        this.showSuccessSnackbar(
          `Got new message from ${newMessage.firstUserUsername}!`
        );
    });
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      panelClass: ['success-snackbar']
    });
  }
}
