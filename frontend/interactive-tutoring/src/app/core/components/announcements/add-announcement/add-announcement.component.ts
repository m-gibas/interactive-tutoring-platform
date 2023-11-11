import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { of, switchMap, take } from 'rxjs';
import { Announcement, Subjects } from 'src/app/core/models/announcement.model';

@Component({
  selector: 'app-add-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-announcement.component.html'
})
export class AddAnnouncementComponent implements OnInit {
  @Input() currentUser = '';

  private userService = inject(UserService);

  private userData!: User;

  newAnnouncement!: Announcement;

  ngOnInit(): void {
    // this.newAnnouncement = {
    //   username: this.currentUser,
    //   subject: Subjects.Programming,
    //   text: 'test7',
    //   price: 20
    // };
    // this.userService.addAnnouncement(this.newAnnouncement).subscribe({
    //   next: (result) => {
    //     console.log('Announcement added successfully:', result);
    //   },
    //   error: (error) => {
    //     console.error('Error adding announcement:', error);
    //   }
    // });

    console.log();

    // same dane, poniżej całe dodawanie
    // this.userService
    //   ?.getUser(this.currentUser)
    //   .pipe(take(1))
    //   .subscribe((res) => {
    //     this.userData = res;
    //   });
    // this.userService
    //   ?.getUser(this.currentUser)
    //   .pipe(
    //     switchMap((userData) => {
    //       this.userData = userData;
    //       this.newAnnouncement.user = userData;
    //       console.log('this.newAnnouncement', this.newAnnouncement);
    //       // return this.userService.addAnnouncement(this.newAnnouncement);
    //       return of(null);
    //     })
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       console.log('Announcement added successfully:', result);
    //     },
    //     error: (error) => {
    //       console.error('Error adding announcement:', error);
    //     }
    //   });
  }
}
