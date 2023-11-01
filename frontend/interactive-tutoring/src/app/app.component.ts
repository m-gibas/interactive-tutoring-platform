import { Component } from '@angular/core';
import { UsersComponent } from './core/components/users/users.component';
import { LoginComponent } from './core/components/login/login.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterLink, RouterOutlet, LoginComponent, UsersComponent]
})
export class AppComponent {
  valueChanged: any;

  title = 'chat';
}
