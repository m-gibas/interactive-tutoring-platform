import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-edit-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-profile.component.html'
})
export class EditUserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  userProfileForm = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    about: ['']
  });
  userProfile!: UserProfile;

  ngOnInit(): void {
    // this.userProfileForm = this.formBuilder.group({
    //   name: [this.userProfile.name, Validators.required],
    //   surname: [this.userProfile.surname, Validators.required],
    //   about: [this.userProfile.about]
    // });

    // pobrac dane z backu i dać
    // cos w stylu userProfileForm.patch(res)
    console.log('patch form data TODO');
  }

  updateUserProfile(): void {
    if (this.userProfileForm.valid) {
      // const updatedProfile: UserProfile = this.userProfileForm.value;
      // // Call your user service to update the user profile
      // this.userService.updateUserProfile(updatedProfile).subscribe(
      //   () => {
      //     // Handle success
      //     console.log('User profile updated successfully');
      //   },
      //   error => {
      //     // Handle error
      //     console.error('Error updating user profile', error);
      //   }
      // );
      console.log('update TODO');
    }
  }
}
