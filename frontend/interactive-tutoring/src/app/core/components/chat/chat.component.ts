import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
// import { WebSocketService } from '../../services/web-socket.service';
import { WebSocketService2 } from '../../services/web-socket-rxjs.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit {
  private userService = inject(UserService);
  // protected webSocketService = inject(WebSocketService);
  protected webSocketService = inject(WebSocketService2);

  selectedUsername = '';

  users$!: Observable<User[]>;
  // currentUsername$!: Observable<string>;

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
    // this.webSocketService.openWebSocket();
    this.webSocketService.connect();

    // this.currentUsername$ = this.userService.getCurrentUsername();
  }

  ngOnDestroy(): void {
    // this.webSocketService.closeWebSocket();
    this.webSocketService.close();
  }
}
