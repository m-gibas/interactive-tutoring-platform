import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Client } from '@stomp/stompjs';
import { catchError, EMPTY, Subject, switchAll, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService2 {
  private apiUrl = environment.apiBaseUrl;

  private socket$!: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.pipe(
    switchAll(),
    catchError((e) => {
      throw e;
    })
  );

  messages: Message[] = [];

  public connect(): void {
    console.log('dziala');

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: (error) => console.log(error)
        }),
        catchError((_) => EMPTY)
      );
      this.messagesSubject$.next(messages);
    }
  }

  private getNewWebSocket() {
    // chyba, że to zły adres
    return webSocket(`ws://${this.apiUrl}/ws`);
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
    console.log('socket', msg);
  }

  close() {
    this.socket$.complete();
  }
}
