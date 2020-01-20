import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (resData: any) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.userId, resData.idToken, expirationDate );
    localStorage.setItem('userData',JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: resData.email,
        userId: resData.localId,
        token: resData.idToken,
        expirationDate: expirationDate,
    });
}

const handleError = (msg: any) => {
    let errorMsg = 'An unknown error occurred';
    if (!msg.error || !msg.error.error) {
        return of(new AuthActions.AuthenticateFailed(errorMsg));
    }
    switch (msg.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMsg = 'This email already exists';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMsg = 'Invalid email address';
            break;
        case 'INVALID_PASSWORD':
            errorMsg = 'Invalid password';
            break;
        default:
            errorMsg = 'An unknown error occurred';
            break;
    }
return of(new AuthActions.AuthenticateFailed(errorMsg));   //of returns an observable
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
            { email: signupAction.payload.email, password: signupAction.payload.password, returnSecureToken: true })
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }), 
                map(resData => {
                   return handleAuthentication(resData);
                }),
                catchError(msg => {
                  return handleError(msg);
            })
           );
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => { //SwitchMap must return an observable
            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true })
            .pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }), 
                map(resData => {
                    return handleAuthentication(resData);
                }),
                catchError(msg => {
                    return handleError(msg);
            })
           );
        })
    );
    
    @Effect({dispatch: false}) //this is an effect that will not yield an
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
        this.router.navigate(['/']);
    }))

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {

    }

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/']);
    }))

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return { type: 'DUMMYACTION'};
        }

        if (userData._token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);
            return new AuthActions.AuthenticateSuccess({ email: userData.email, userId: userData.id, token: userData._token, expirationDate: new Date(userData._tokenExpirationDate) })
        }

        return { type: 'DUMMYACTION'};
}))
}