import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_FAILED = '[Auth] Login Failed';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const SIGNUP = '[Auth] Signup';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login'
export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {email: string, userId: string; token: string; expirationDate: Date}){

    }
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}){

    }
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string, password: string}){

    }
}

export class AuthenticateFailed implements Action {
    readonly type = AUTHENTICATE_FAILED;

    constructor(public payload: string){

    }
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = AuthenticateSuccess 
    | Logout 
    | LoginStart 
    | AuthenticateFailed 
    | SignupStart 
    | ClearError 
    | AutoLogin;