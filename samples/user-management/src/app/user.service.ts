import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersURL = 'api/users';

  constructor(  
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  getUsers(): Observable<User[]> {
    this.log('已经获取到用户列表！');
    return this.http.get<User[]>(this.usersURL)
      .pipe(
        tap(Users => this.log('fetched Users')),
        catchError(this.handleError('getUsers', []))
      );
  }

  getUser(id: number): Observable<User> {
    this.log(`已经获取到用户 id=${id}`);

    const url = `${this.usersURL}/${id}`;
    return this.http.get<User>(url)
      .pipe(
        tap(_ => this.log(`fetched user id=${id}`)),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
