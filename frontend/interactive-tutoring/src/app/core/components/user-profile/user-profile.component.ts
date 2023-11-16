import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { switchMap, take } from 'rxjs';
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
  UserProfile!: UserProfile;

  get isCurrentUser(): boolean {
    return this.username === this.currentUser;
  }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username') ?? '';

    //  this.userService
    //   ?.getUser(this.currentUser)
    //   .pipe(
    //     switchMap((userData) => {
    //       this.userData = userData;
    //       return this.userService.addAnnouncement(this.newAnnouncement);
    //     })
    //   )

    this.userService
      ?.getAnnouncementsForUser(this.username)
      .pipe(take(1))
      .subscribe((userAnnouncements) => {
        this.userAnnouncements = userAnnouncements;

        console.log(this.userAnnouncements);
      });

    this.userService
      .getCurrentUsername()
      .pipe(
        // take(1),
        switchMap((user) => {
          this.currentUser = user.username;
          return this.userService.getUser(this.currentUser);
        })
      )
      .subscribe((userData) => {
        this.userData = userData;

        console.log('this.currentUser', this.currentUser);
        console.log('this.userData', this.userData);
      });

    // this.userService
    // ?.getUser(this.currentUser)
    // .pipe(
    //   switchMap((userData) => {
    //     this.userData = userData;
    //     return this.userService.addAnnouncement(this.newAnnouncement);
    //   })
    // )

    // this.userService
    //   .getCurrentUsername()
    //   .pipe(take(1))
    //   .subscribe((user) => {
    //     this.currentUser = user.username;
    //   });
  }

  changeAnnouncementAvailability(id: number, availability: boolean) {
    console.log('dziala, ', id, ' !availability ', !availability);
    this.userService
      .changeAnnouncementAvailability(id, !availability)
      .pipe(take(1))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
