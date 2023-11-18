import { Component } from '@angular/core';
import { UsersComponent } from './core/components/users/users.component';
import { LoginComponent } from './core/components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from './core/components/main-page/main-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, UsersComponent, MainPageComponent]
})
export class AppComponent {
  valueChanged: any;

  title = 'Tutoring platform';
}
