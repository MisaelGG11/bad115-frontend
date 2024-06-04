import { createReducer, on } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';
import { decoderToken } from '../utils/token.utils';
import { login, logout, setPerson, setCompany, resetState } from './auth.actions';
import { Person } from '../interfaces/person.interface';
import { LOCAL_STORAGE } from '../utils/constants.utils';

export const initialState: Session = initStore();

function initStore() {
  const token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  if (token) {
    const userInfo = decoderToken(token);
    const person: Person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) as string);
    const company = JSON.parse(localStorage.getItem(LOCAL_STORAGE.COMPANY) as string);
    return {
      token: token,
      user: userInfo,
      person: person,
      company: company,
    };
  } else
    return {
      user: null,
      person: null,
      token: '',
      company: null,
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
    localStorage.removeItem(LOCAL_STORAGE.COMPANY);
    return {
      ...state,
      token: '',
      user: null,
      person: null,
      company: null,
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
  on(setCompany, (state, { company }) => {
    return {
      ...state,
      company: company,
    };
  }),
);
