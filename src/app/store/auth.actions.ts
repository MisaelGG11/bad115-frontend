import { createAction } from '@ngrx/store';
import { Person } from '../interfaces/person.interface';
import { Company } from '../interfaces/company.interface';

export const login = createAction('[Session] login');
export const logout = createAction('[Session] logout');
export const setPerson = createAction('[Session] setPerson', (person: Person) => ({ person }));
export const setCompany = createAction('[Session] setCompany', (company: Company) => ({ company }));
export const resetState = createAction('[Session] resetState');
