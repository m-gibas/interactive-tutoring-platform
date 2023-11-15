import { HttpClient } from '@angular/common/http';
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

  public getMessages(username: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/message/all`, {
      params: { username }
    });
  }

  public getRecentChatters(firstUsername: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/message/recent-chatters`, {
      params: { firstUsername }
    });
  }

  public getAllMessagesBetweenUsers(
    firstUsername: string,
    secondUsername: string
  ): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}/message/all-between-users`,
      {
        params: { firstUsername, secondUsername }
      }
    );
  }

  // sendMessage
  public addMessage(message: Message): Observable<Message> {
    console.log('service', message);

    return this.http.post<Message>(`${this.apiUrl}/message/add`, message);
  }
}
