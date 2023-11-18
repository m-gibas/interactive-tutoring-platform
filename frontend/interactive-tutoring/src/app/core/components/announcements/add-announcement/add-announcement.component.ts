import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { take } from 'rxjs';
import { Announcement, Subjects } from 'src/app/core/models/announcement.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-announcement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add-announcement.component.html'
})
export class AddAnnouncementComponent implements OnInit {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private activeRoute = inject(ActivatedRoute);

  subjects = Object.values(Subjects);
  currentUser = '';

  announcementForm = this.fb.nonNullable.group({
    subject: ['', Validators.required],
    text: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.activeRoute.queryParams.pipe(take(1)).subscribe((queryParams) => {
      this.currentUser = queryParams['currentUser'] ?? '';
    });
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
