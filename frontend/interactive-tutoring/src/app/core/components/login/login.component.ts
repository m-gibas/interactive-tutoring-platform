import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  @Output() emitValue: EventEmitter<any> = new EventEmitter();

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  createAccount() {
    this.userService.addUser(this.form.getRawValue()).subscribe({
      next: (res: User) => {
        console.log(res);
        this.form.reset();
        this.emitValue.emit('OK');
      },
      error: (err: HttpErrorResponse) => {
        alert(err.message);
      }
    });
  }

  login() {
    this.userService.loginUser(this.form.getRawValue()).subscribe({
      next: (res: User) => {
        console.log(res);
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        alert(err.message);
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
