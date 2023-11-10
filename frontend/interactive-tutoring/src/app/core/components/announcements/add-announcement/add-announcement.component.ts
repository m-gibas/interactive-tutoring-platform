import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { of, switchMap, take } from 'rxjs';
import { Announcement } from 'src/app/core/models/announcement';

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
    //   subject: 'anything',
    //   text: 'test4',
    //   price: 15
    // };
    // this.userService.addAnnouncement(this.newAnnouncement).subscribe({
    //   next: (result) => {
    //     console.log('Announcement added successfully:', result);
    //   },
    //   error: (error) => {
    //     console.error('Error adding announcement:', error);
    //   }
    // });
  }
}
