import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { of, switchMap, take } from 'rxjs';
import { Announcement, Subjects } from 'src/app/core/models/announcement.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-announcement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-announcement.component.html'
})
export class AddAnnouncementComponent implements OnInit {
  @Input() currentUser = '';

  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  private userData!: User;
  subjects = Object.values(Subjects);

  announcementForm = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    text: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

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

  addAnnouncement() {
    if (this.announcementForm.valid) {
      const newAnnouncement = {
        username: this.currentUser,
        ...(this.announcementForm.value as Omit<
          Announcement,
          'datePosted' | 'username'
        >)
      };

      this.userService.addAnnouncement(newAnnouncement).subscribe({
        next: (result) => {
          console.log('Announcement added successfully:', result);

          // popup
          this.showSuccessSnackbar('Announcement added successfully');

          this.announcementForm.reset();
        },
        error: (error) => {
          console.error('Error adding announcement:', error);
        }
      });
    } else {
      alert('Wrong data');
    }
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['success-snackbar']
    });
  }
}
