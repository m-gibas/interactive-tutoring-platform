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
import { SocketService } from 'src/app/core/services/web-socket.service';

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
  private socketService = inject(SocketService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  messages$!: Observable<Message[]>;
  private subscriptions$ = new Subscription();
  // room: string = 'a';
  message: string = '';
  messages: Message[] = [];
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
    // this.webSocketServiceIo.onNewMessage().subscribe((message: any) => {
    //   console.log('message', message);

    //   this.messages.push(message);
    // });

    // this.currentUsername$ = this.userService
    //   .getCurrentUsername()
    //   .subscribe((res) => {
    //     console.log('username compoenent: ', res.username);

    //     this.firstUsername = res.username;

    //     // this.messages$ = this.setMessagesObservable();
    //     // this.cdr.detectChanges();
    //     this.setMessagesObservable().subscribe((res) => {
    //       console.log('tu');

    //       this.messages = [...res];
    //       console.log(this.messages);

    //       this.cdr.detectChanges();
    //     });
    //   });

    this.subscriptions$.add(
      this.userService
        .getCurrentUsername()
        .pipe(
          mergeMap((res) => {
            this.firstUsername = res.username;
            this.connect();
            return this.setMessagesObservable();
          })
        )
        .subscribe((res) => {
          this.messages = [...res];

          this.cdr.detectChanges();
        })
    );
  }

  ngOnDestroy(): void {
    // this.currentUsername$.unsubscribe();
    this.subscriptions$.unsubscribe();
  }

  ngOnChanges(): void {
    // this.messages$ = this.setMessagesObservable();
    this.subscriptions$.add(
      this.setMessagesObservable().subscribe((res) => {
        this.messages = [...res];
        this.cdr.detectChanges();
      })
    );

    // this.chatService
    //   .getAllMessagesBetweenUsers(this.firstUsername, this.secondUsername)
    //   .subscribe((res) => {
    //     console.log('tu');

    //     this.messages.push(...res);
    //     console.log(this.messages);

    //     this.cdr.detectChanges();
    //   });

    // stare
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
    // this.chatService
    //   .getAllMessagesBetweenUsers(this.firstUsername, this.secondUsername)
    //   .subscribe((res) => console.log('forUsers: ', res));
    return this.refreshToken$.pipe(
      switchMap((_) => {
        return this.chatService.getAllMessagesBetweenUsers(
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
      message: this.newMessageForm.value.message!,
      room: this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
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

    this.socketService.sendMessage({ ...newMessage });
  }

  // stare useless
  // connect() {
  //   this.webSocketServiceIo.connect(this.room);
  // }

  // sendMessageSocket() {
  //   // this.webSocketServiceIo.sendMessage(this.room, this.message);
  //   console.log('messages', this.messages);

  //   this.message = '';
  // }

  // disconnect() {
  //   this.webSocketServiceIo.disconnect();
  // }

  // nowy socket działający
  connect() {
    console.log(
      this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
    );
    this.socketService.connected(
      this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
    );

    this.socketService.onNewMessage().subscribe((message: Message) => {
      // console.log('a tu dziala?', message);

      // this.messages$ = this.setMessagesObservable();

      this.messages.push(message);
    });
  }

  disconnect() {
    this.socketService.disconnect();
  }

  private generateUniqueRoomName(
    firstUsername: string,
    secondUsername: string
  ): string {
    const sortedUsernames: string[] = [firstUsername, secondUsername].sort();
    return sortedUsernames.join('_');
  }
}
