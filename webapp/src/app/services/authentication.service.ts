import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@ngx-config/core';
import { Store } from '@ngrx/store';
import { AppState } from '../appState';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private url = this.config.getSettings().backend_url;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private store: Store<AppState>
  ) {}

  public loginUser(username: string, password: string) {
    const token = 'Basic ' + window.btoa(username + ':' + password);
    const headers = new HttpHeaders({
      Authorization: token,
      'Content-Type': 'application/json'
    });
    const url = this.url + '/auth';
    return this.http.post(url, {}, { headers: headers }).pipe(map(res => {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      return res;
    }));
  }

  public logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  public isLoggedIn() {
    return (
      localStorage.getItem('token') !== undefined &&
      localStorage.getItem('token') !== null
    );
  }

  public getLoggedInUsername() {
    return localStorage.getItem('username').toLowerCase();
  }

}
