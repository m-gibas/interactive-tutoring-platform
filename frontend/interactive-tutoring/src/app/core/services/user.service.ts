import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginUser, User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;

  private http = inject(HttpClient);

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user/all`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/add`, user);
  }

  // public loginUser(user: User): Observable<any> {
  //   return this.http.post(
  //     `${this.apiUrl}/user/login`,
  //     {
  //       params: { username: user.username, password: user.password }
  //     },
  //     {
  //       withCredentials: true
  //     }
  //   );
  // }

  public loginUser(user: LoginUser): Observable<any> {
    // trochę to przerobić i typ zwracany poprawić
    // albo inne metody przerobić na ten styl
    const url = `${this.apiUrl}/user/login`;
    const data = {
      username: user.username,
      password: user.password
    };

    return this.http.post(url, data, {
      withCredentials: true
    });
  }

  public logoutUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/logout`, {
      withCredentials: true
    });
  }

  public getCurrentUsername(): Observable<any> {
    return this.http.get<string>(`${this.apiUrl}/user/get-current-username`, {
      withCredentials: true
    });
  }
}
