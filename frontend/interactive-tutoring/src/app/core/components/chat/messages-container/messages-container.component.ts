import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, switchMap } from 'rxjs';
import { Message } from 'src/app/core/models/message.model';
import { ChatService } from 'src/app/core/services/chat.service';
import { SocketService } from 'src/app/core/services/web-socket.service';
import { NgIf, NgFor, AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule, AsyncPipe]
})
export class MessagesContainerComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() firstUsername = '';
  @Input() secondUsername = '';

  private chatService = inject(ChatService);
  private socketService = inject(SocketService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  messages$!: Observable<Message[]>;
  private subscriptions$ = new Subscription();
  message: string = '';
  messages: Message[] = [];
  liveData$!: Observable<Message[]>;
  refreshToken$ = new BehaviorSubject(undefined);

  newMessageForm = this.fb.nonNullable.group({
    message: ['', Validators.required]
  });

  ngOnInit(): void {
    this.connect();

    this.subscriptions$.add(
      this.setMessagesObservable().subscribe((res) => {
        this.messages = [...res];

        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

  ngOnChanges(): void {
    this.subscriptions$.add(
      this.setMessagesObservable().subscribe((res) => {
        this.messages = [...res];
        this.cdr.detectChanges();
      })
    );
  }

  setMessagesObservable(): Observable<Message[]> {
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

  connect() {
    console.log(
      this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
    );

    this.socketService.connected(
      this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
    );

    this.socketService.onNewMessage().subscribe((message: Message) => {
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
