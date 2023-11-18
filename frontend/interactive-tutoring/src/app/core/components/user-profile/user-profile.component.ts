import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription, switchMap, take } from 'rxjs';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { Announcement } from '../../models/announcement.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, RouterModule, MatTooltipModule],
  templateUrl: './user-profile.component.html'
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  username!: string;
  currentUser!: string;
  userData!: User;
  userAnnouncements: Announcement[] = [];
  userProfile: UserProfile = {
    username: '',
    name: '',
    surname: '',
    about: ''
  };
  private routeSub!: Subscription;

  get isCurrentUser(): boolean {
    return this.username === this.currentUser;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.getData();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private getData(): void {
    this.userService
      ?.getAnnouncementsForUser(this.username)
      .pipe(take(1))
      .subscribe((userAnnouncements) => {
        this.userAnnouncements = userAnnouncements;
      });

    this.userService
      .getCurrentUsername()
      .pipe(take(1))
      .subscribe((user) => {
        this.currentUser = user.username;
      });

    this.userService
      .getUserProfile(this.username)
      .pipe(take(1))
      .subscribe((userProfile) => {
        if (userProfile) this.userProfile = userProfile;
        else
          this.userProfile = {
            username: '',
            name: '',
            surname: '',
            about: ''
          };
      });
  }

  changeAnnouncementAvailability(id: number, availability: boolean) {
    this.userService
      .changeAnnouncementAvailability(id, !availability)
      .pipe(
        take(1),
        switchMap(() => this.userService.getAnnouncementsForUser(this.username))
      )
      .subscribe((userAnnouncements) => {
        this.userAnnouncements = userAnnouncements;
      });
  }
}
