import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './core/components/chat/chat.component';
import { UsersComponent } from './core/components/users/users.component';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
