import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './core/components/users/users.component';
import { ChatComponent } from './core/components/chat/chat.component';
import { MessagesContainerComponent } from './core/components/chat/messages-container/messages-container.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, UsersComponent, ChatComponent, MessagesContainerComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
