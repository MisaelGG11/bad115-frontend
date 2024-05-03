import { createReducer, on } from '@ngrx/store';
import { Session } from '../interfaces/user';
import { decoderToken } from '../utils/token.utils';
import { login, logout, setPerson } from './auth.actions';
import network from '../config/network.service';
import { Person } from '../interfaces/person';
import { PersonService } from '../services/person.service';

export const initialState: Session = initStore();

function initStore() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const userInfo = decoderToken(token);
    const person: Person = JSON.parse(localStorage.getItem('person') as string);
    return {
      token: token,
      user: userInfo,
      person: person,
    };
  } else
    return {
      user: null,
      person: null,
      token: '',
    };
}

export const sessionReducer = createReducer(
  initialState,
  on(login, (state) => {
    const token = localStorage.getItem('access_token');
    const userInfo = decoderToken(token);
    return {
      ...state,
      token: token,
      user: userInfo,
    };
  }),
  on(logout, (state) => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('person');
    return {
      ...state,
      token: '',
      user: null,
      person: null,
    };
  }),
  on(setPerson, (state, { person }) => {
    return {
      ...state,
      person: person,
    };
  }),
);
