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
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessagesIoSocketComponent } from './core/components/chat/messages-io-socket/messages-io-socket.component';
import { SocketService } from './core/services/web-socket.service';

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    ChatComponent,
    MessagesContainerComponent,
    MessagesIoSocketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule {}
