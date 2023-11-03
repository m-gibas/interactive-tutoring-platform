import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, AsyncPipe],
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  private userService = inject(UserService);

  private cdr = inject(ChangeDetectorRef);

  protected currentUser!: string;

  currUser!: Observable<string>;

  ngOnInit(): void {
    this.currUser = this.userService.getCurrentUsername();

    this.userService
      .getCurrentUsername()
      // .pipe(take(1))
      .subscribe((user) => {
        console.log('curr user: ', user);
        this.currentUser = user.username;
        // nie działa :(( nie odświeża sie
        console.log(this.currUser);

        this.cdr.detectChanges();
        // return true;
      });
  }
}
