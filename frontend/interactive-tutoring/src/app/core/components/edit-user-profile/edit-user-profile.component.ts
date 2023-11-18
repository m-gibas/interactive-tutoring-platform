import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user-profile.model';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-user-profile.component.html'
})
export class EditUserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  username!: string;
  currentUser!: string;
  userProfile!: UserProfile;
  userProfileForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    about: ['', Validators.required]
  });

  get isCurrentUser(): boolean {
    return this.username === this.currentUser;
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') ?? '';

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
        this.userProfile = userProfile;

        this.userProfileForm.patchValue(userProfile);
      });
  }

  updateUserProfile(): void {
    if (this.userProfileForm.valid) {
      const updatedProfile: UserProfile = {
        username: this.username,
        ...(this.userProfileForm.value as Omit<UserProfile, 'username'>)
      };

      this.userService
        .updateUserProfile(updatedProfile)
        .pipe(take(1))
        .subscribe((res) => {
          console.log('User profile updated successfully: ', res);

          this.showSuccessSnackbar('Profile updated successfully!');
        });
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
