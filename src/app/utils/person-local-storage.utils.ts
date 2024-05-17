import { Person } from '../interfaces/person.interface';

export const getPersonLocalStorage = (): Person => {
  return JSON.parse(localStorage.getItem('person') || '{}');
};
