import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginUser, User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  @Output() emitValue: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  login() {
    this.userService.loginUser(this.form.getRawValue()).subscribe({
      next: (res: LoginUser) => {
        console.log(res);
        this.router.navigateByUrl('/');
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error;
        console.log(err);
        // alert(err.message);
      }
    });
    //   account
    //     .createEmailSession(
    //       this.form.controls.email.value,
    //       this.form.controls.password.value
    //     )
    //     .then(
    //       (res) => {
    //         console.log('Login', res);
    //         this.form.reset();
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
  }
}
