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
import { WebSocketService2 } from './core/services/web-socket-rxjs.service';
// import { WebSocketService } from './core/services/web-socket.service';
import { StompService } from './core/services/stomp.service';
import { WebSocketIoService } from './core/services/web-socket-io.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { MessagesTestComponent } from './core/components/chat/messages-test/messages-test.component';
// import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';

// const config: SocketIoConfig = {
//   url: environment.socketUrl,
//   options: { path: 'ws', transports: ['websocket'] }
// };
const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {}
  // options: { transports: ['websocket'] }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    ChatComponent,
    MessagesContainerComponent,
    MessagesTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    // WebSocketService,
    // WebSocketService2,
    // WrappedSocket,
    WebSocketIoService
    // StompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
