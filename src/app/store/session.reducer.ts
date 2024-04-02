import { createReducer, on } from '@ngrx/store';
import { Session } from '../interfaces/user';
import { decoderToken } from '../utils/token.utils';
import { login, logout } from './auth.actions'

export const initialState: Session = initStore();

function initStore() {
    const token = localStorage.getItem('access_token');
    if(token){
        const userInfo = decoderToken(token)
        return {
            token: token,
            user: userInfo
        }
    } else 
    return {
        user: null,
        token: '',
    };
}

export const sessionReducer = createReducer(
    initialState,
    on(login, (state) => {
        const token = localStorage.getItem('access_token');
        const userInfo = decoderToken(token)
        return {
            ...state,
            token: token,
            user: userInfo
        };
    }),
    on(logout, (state) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return {
            ...state,
            token: '',
            user: null
        };
    })
);