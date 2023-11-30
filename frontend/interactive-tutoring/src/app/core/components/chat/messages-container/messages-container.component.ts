import {
  AfterViewChecked,
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
import { NgIf, NgFor, AsyncPipe, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe
  ]
})
export class MessagesContainerComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked
{
  @ViewChild('allMessages') private allMessagesContainer!: ElementRef;

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
    // this.connect();

    this.subscriptions$.add(
      this.setMessagesObservable().subscribe((res) => {
        this.messages = [...res];

        this.scrollToBottom();

        this.cdr.detectChanges();
      })
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
    this.disconnect();
  }

  ngOnChanges(): void {
    // this.disconnect();
    this.connect();

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
    const newMessage: Message = {
      firstUserUsername: this.firstUsername,
      secondUserUsername: this.secondUsername,
      message: this.newMessageForm.value.message!,
      room: this.generateUniqueRoomName(this.firstUsername, this.secondUsername)
    };

    this.newMessageForm.reset();

    this.chatService.addMessage(newMessage).subscribe({
      next: () => {
        this.socketService.sendMessage({ ...newMessage });
      },
      error: (err) => {
        alert(err.message);
      }
    });
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

  private scrollToBottom(): void {
    try {
      this.allMessagesContainer.nativeElement.scrollTop =
        this.allMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
