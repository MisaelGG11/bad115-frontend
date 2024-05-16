import { createAction } from '@ngrx/store';
import { Person } from '../interfaces/person.interface';

export const login = createAction('[Session] login');
export const logout = createAction('[Session] logout');
export const setPerson = createAction('[Session] setPerson', (person: Person) => ({ person }));
