import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Enviroment from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL: string = Enviroment.environment.API_URL_BASE;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,
    private router: Router) { }


  /**
   * This will set the account status CONFIRMED as true and UNCONFIRMED as false.
   * @param --(accountStatusConfirmation: boolean)
   * @returns --none
   */
  public setAuthStatus(authenticated: boolean): void {
    this.isAuthenticated.next(authenticated);
  }

  /**
   * This will give the authStatus as retrun by a boolean value.
   * @param --none
   * @returns --(boolean)
   */
  public getAuthStatus(): boolean {
    return this.isAuthenticated.value;
  }

  /**
   * This will help to get idToken from session Storage
   * @parameter --none
   * @returns --(idToken: strng)
   */
  public getToken(): string {
    const jwtToken = sessionStorage.getItem('JwtToken');
    if (jwtToken) {
      return jwtToken;
    }
  }

  /**
   * This will checked the user logged in or not as well as set the status.
   * @parameter --none
   * @returns --(boolean)
   */

  public isLoggedIn(): boolean {
    const jwtToken = sessionStorage.getItem('JwtToken');
    if (jwtToken) {
      this.setAuthStatus(!!jwtToken);
      return this.getAuthStatus();
    }
  }

  /**
   * Called to log out the user
   * @parameter none
   */
  public logout(): void {
    this.setAuthStatus(false);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * This will help to create a user.
   * @param user(Object(name,email,pwd,phone,address)) 
   * @returns Observable<any>
   */
  public signUp(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/create`, user)
    .pipe(catchError(this.handleError));
  }

  /**
   * This will help to logged.
   * @param user(Object(email,pwd)) 
   * @returns Observable<any>
   */
  public login(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, user)
    .pipe(catchError(this.handleError));
  }

  /**
   * This will confirm the email by call backend api.
   * @param token 
   * @returns Observable<any>
   */
  public confirmEmail(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/confirmemail`, {token: token})
    .pipe(catchError(this.handleError));
  }

  /**
   * This will fetch all users by calling backend api.
   * @param user() 
   * @returns Observable<any>
   */
  public getAllUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/get-users`)
    .pipe(catchError(this.handleError));
  }

  /**
   * This will fetch all emails by calling backend api.
   * @param user() 
   * @returns Observable<any>
   */
  public getEmail(email: string): Observable<any> {
    return this.http.get(`${this.API_URL}/get-email/${email}`)
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    if (errorResponse instanceof ErrorEvent) {
        console.log('Client Side Error : ', errorResponse);
    } else {
        console.log('Server Side Error : ', errorResponse);
    }

    if (errorResponse.status === 401) {
      return throwError('Email or password in incurrect.')
    }

    if (errorResponse.status === 404) {
      return throwError('No user found')
    }
    return throwError('Someting went wrong!.')
}
}
