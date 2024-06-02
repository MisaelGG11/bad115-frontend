import { createReducer, on } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';
import { decoderToken } from '../utils/token.utils';
import { login, logout, setPerson, resetState } from './auth.actions';
import { Person } from '../interfaces/person.interface';
import { LOCAL_STORAGE } from '../utils/constants.utils';

export const initialState: Session = initStore();

function initStore() {
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  if (token) {
    const userInfo = decoderToken(token);
    const person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) as string);
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
    const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    const userInfo = decoderToken(token);
    return {
      ...state,
      token: token,
      user: userInfo,
    };
  }),
  on(logout, (state) => {
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.PERSON);
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
  on(resetState, () => {
    return initStore();
  }),
);
