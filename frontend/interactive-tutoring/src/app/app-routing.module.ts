import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './core/components/chat/chat.component';
import { UsersComponent } from './core/components/users/users.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { LogoutComponent } from './core/components/logout/logout.component';
import { AnnouncementsComponent } from './core/components/announcements/announcements.component';
import { AddAnnouncementComponent } from './core/components/announcements/add-announcement/add-announcement.component';
import { UserProfileComponent } from './core/components/user-profile/user-profile.component';
import { EditUserProfileComponent } from './core/components/edit-user-profile/edit-user-profile.component';
import { DescriptionComponent } from './core/components/main-page/description/description.component';

const routes: Routes = [
  { path: '', component: DescriptionComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:username', component: UserProfileComponent },
  { path: 'edit-user-profile/:username', component: EditUserProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'add-announcement', component: AddAnnouncementComponent }
  // { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
