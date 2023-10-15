import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiBaseUrl;

  private http = inject(HttpClient);

  private queryParams = new HttpParams();

  public getMessages(username: string): Observable<Message[]> {
    // this.queryParams = this.queryParams.append('username', username);

    return this.http.get<Message[]>(`${this.apiUrl}/message/all`, {
      params: { username }
    });
    // return this.http.get<Message[]>(
    //   `${this.apiUrl}/message/all`, options:
    //   this.queryParams
    // );
  }

  public getAllMessagesForFirstUser(
    firstUsername: string,
    secondUsername: string
  ): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}/message/all-for-first-user`,
      {
        params: { firstUsername, secondUsername }
      }
    );
  }

  // sendMessage
  public addMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/message/add`, message);
  }
}
