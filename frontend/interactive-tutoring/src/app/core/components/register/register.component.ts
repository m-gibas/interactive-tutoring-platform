import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  // poprawić to na backu, że zwraca mi tablicę błędów i wtedy będę mógł wyświetlić konkretne błędy pod danym polem
  errorMessage: string = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  createAccount() {
    this.userService.addUser(this.form.getRawValue()).subscribe({
      next: (res: User) => {
        console.log(res);
        this.router.navigateByUrl('/login');
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error.message;
        console.log(err);
        // alert(err.message);
      }
    });
  }
}
