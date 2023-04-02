import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public redirectTo: string = '/';
    private endpoint: string = '/users';
    private user: User | undefined = undefined;

    private hasLoginErrors = new BehaviorSubject<boolean>(false);
    public hasLoginErrors$ = this.hasLoginErrors.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    logIn(name: string, password: string) {
        const user: Observable<User> = this.http.post<User>(environment.url + this.endpoint + '/login', {
            name: name,
            password: password
        });

        user.subscribe({
            next: user => {
                this.user = user;
                sessionStorage.setItem('token', btoa(name + ':' + password));
                sessionStorage.setItem('user', JSON.stringify(user));
                // TODO: Save token to cookies

                if(!environment.production) {
                    console.log('user: ', user);
                    console.log('token: ', sessionStorage.getItem('token'))
                }

                this.hasLoginErrors.next(false);
                this.router.navigate([this.redirectTo]);
            },
            error: err => {
                this.hasLoginErrors.next(true);
                console.log(err.message);
            }
        });
    }

    logOut(): void {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return sessionStorage.getItem('token') != null;
    }

    hasAuthority(authority: string): boolean {
        if(this.user == undefined) {
            let userStr = sessionStorage.getItem('user');

            if(userStr == undefined)
                return false;

            this.user = JSON.parse(userStr);
        }

        //return this.user?.authorities.find(elem => elem === authority);
        return true;
        // TODO
    }

  getAuthorizationHeader(): {'Authorization': string} {
    return {
      'Authorization': 'Basic ' + sessionStorage.getItem('token')
    };
  }

  updateUser(user: User) {
    this.http.post(environment.url + this.endpoint + '/update', user, {
      headers: this.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(environment.url + this.endpoint + '/all', {
      headers: this.getAuthorizationHeader(),
      responseType: 'json'
    });
  }

  deleteUser(id: string) {
    this.http.delete(environment.url + this.endpoint + '/delete' + `/${id}`, {
      headers: this.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }

  insertUser(user: User) {
    this.http.post(environment.url + this.endpoint + '/add',user, {
      headers: this.getAuthorizationHeader(),
      responseType: 'json'
    }).subscribe();
  }
}
