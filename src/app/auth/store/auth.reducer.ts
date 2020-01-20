import { User } from '../user.model';
import * as actions from './auth.actions';
import { ActionsSubject } from '@ngrx/store';

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false,
};

export function authReducer(state = initialState, action: actions.AuthActions) {
    switch (action.type) {
       case actions.AUTHENTICATE_SUCCESS:
        
        const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
        return {...state,
            authError: null,
            user,
            loading: false,
        };
    case actions.LOGIN_START:
    case actions.SIGNUP_START:
        return {...state,
                authError: null,
                loading: true
            };
    case actions.AUTHENTICATE_FAILED:
        return {...state,
                user: null,
                authError: action.payload,
                loading: false,
            };
    case actions.LOGOUT:
        return {...state,
                 user: null
             };
    case actions.CLEAR_ERROR:
        return {...state,
                    authError: null
                };
    default:
     return state;    
    }
    
}