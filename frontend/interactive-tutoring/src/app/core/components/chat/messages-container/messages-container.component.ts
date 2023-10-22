import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs';
import { Message } from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { UserService } from 'src/app/core/services/user.service';
import { WebSocketIoService } from 'src/app/core/services/web-socket-io.service';
import { WebSocketService2 } from 'src/app/core/services/web-socket-rxjs.service';
// import { WebSocketService } from 'src/app/core/services/web-socket.service';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html'
})
export class MessagesContainerComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() firstUsername: string = '';
  @Input() secondUsername = '';

  private chatService = inject(ChatService);
  private userService = inject(UserService);
  // protected webSocketService = inject(WebSocketService);
  // protected webSocketService2 = inject(WebSocketService2);
  protected webSocketServiceIo = inject(WebSocketIoService);
  private fb = inject(FormBuilder);

  messages$!: Observable<Message[]>;
  room: string = '';
  message: string = '';
  messages: string[] = [];
  liveData$!: Observable<Message[]>;
  refreshToken$ = new BehaviorSubject(undefined);

  newMessageForm = this.fb.nonNullable.group({
    message: ['', Validators.required]
  });

  currentUsername$!: Subscription;

  ngOnInit(): void {
    // this.webSocketServiceIo.connect();
    // this.webSocketService.connect();

    // this.liveData$ = this.webSocketService2.messages$.pipe(
    //   map((rows: any) => rows.data),
    //   catchError((error) => {
    //     throw error;
    //   }),
    //   tap({
    //     error: (error) => console.log('[Live component] Error:', error),
    //     complete: () => console.log('[Live component] Connection Closed')
    //   })
    // );

    // to nie działa
    // this.liveData$.subscribe((res) => console.log('data', res));
    // this.webSocketService2.messages$.subscribe((res) => {
    //   console.log('2', res);
    // });

    // this.webSocketServiceIo.onReceivedMessage().subscribe((message: any) => {
    //   console.log('message', message);

    //   this.messages.push(message);
    // });
    this.webSocketServiceIo.onNewMessage().subscribe((message: any) => {
      console.log('message', message);

      this.messages.push(message);
    });

    this.currentUsername$ = this.userService
      .getCurrentUsername()
      .subscribe((res) => {
        this.firstUsername = res.username;

        this.messages$ = this.setMessagesObservable();
      });
  }

  ngOnDestroy(): void {
    this.currentUsername$.unsubscribe();
    // this.webSocketService.disconnect();
    this.webSocketServiceIo.disconnect();
  }

  ngOnChanges(): void {
    this.messages$ = this.setMessagesObservable();

    // this.liveData$ = this.webSocketService2.messages$.pipe(
    //   map((rows: any) => rows.data),
    //   catchError((error) => {
    //     throw error;
    //   }),
    //   tap({
    //     error: (error) => console.log('[Live component] Error:', error),
    //     complete: () => console.log('[Live component] Connection Closed')
    //   })
    // );

    // this.liveData$.subscribe((res) => console.log('data', res));
  }

  setMessagesObservable(): Observable<Message[]> {
    return this.refreshToken$.pipe(
      switchMap((_) => {
        return this.chatService.getAllMessagesForFirstUser(
          this.firstUsername,
          this.secondUsername
        );
      })
    );
  }

  sendMessage(): void {
    console.log(this.newMessageForm.value.message);
    const newMessage: Message = {
      firstUserUsername: this.firstUsername,
      secondUserUsername: this.secondUsername,
      message: this.newMessageForm.value.message!
    };

    // this.webSocketService2.sendMessage(newMessage);
    // this.webSocketService.sendMessage('/app/send-message', newMessage.message);

    // this.webSocketServiceIo.sendMessage(newMessage);

    this.newMessageForm.reset();

    this.chatService.addMessage(newMessage).subscribe({
      next: () => {
        this.refreshToken$.next(undefined);
      },
      error: (err) => {
        alert(err.message);
      }
    });
  }

  connect() {
    this.webSocketServiceIo.connect(this.room);
  }

  sendMessageSocket() {
    // this.webSocketServiceIo.sendMessage(this.room, this.message);
    console.log('messages', this.messages);

    this.message = '';
  }

  disconnect() {
    this.webSocketServiceIo.disconnect();
  }
}
