import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser, User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;

  private http = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user/all`);
  }

  public getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/get-user`, {
      params: { username }
    });
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/add`, user);
  }

  public loginUser(user: LoginUser): Observable<string | null> {
    const data = {
      username: user.username,
      password: user.password
    };

    return this.http.post<string | null>(`${this.apiUrl}/user/login`, data, {
      withCredentials: true
    });
  }

  public logoutUser(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/user/logout`, {
      withCredentials: true
    });
  }

  public getCurrentUsername(): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(
      `${this.apiUrl}/user/get-current-username`,
      {
        withCredentials: true
      }
    );
  }

  public getAnnouncements(username: string): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(
      `${this.apiUrl}/user/get-announcements`,
      {
        params: { username }
      }
    );
  }

  public addAnnouncement(
    announcement: Omit<Announcement, 'datePosted'>
  ): Observable<Announcement> {
    return this.http.post<Announcement>(
      `${this.apiUrl}/user/add-announcement`,
      announcement
    );
  }
}
