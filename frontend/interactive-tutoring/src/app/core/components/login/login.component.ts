import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, NgIf]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  @Output() emitValue: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';

  errorToShow: { username?: boolean; password?: boolean } = {};

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    this.userService
      .loginUser(this.form.getRawValue())
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.form.reset();
          this.router.navigateByUrl('/');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error;

          this.errorToShow.username = this.errorMessage.includes('username');
          this.errorToShow.password = this.errorMessage.includes('Password');
        }
      });
  }
}
