import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './core/components/chat/chat.component';
import { UsersComponent } from './core/components/users/users.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { LogoutComponent } from './core/components/logout/logout.component';
import { AnnouncementsComponent } from './core/components/announcements/announcements.component';
import { AddAnnouncementComponent } from './core/components/announcements/add-announcement/add-announcement.component';

const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'users', component: UsersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'add-announcement', component: AddAnnouncementComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
