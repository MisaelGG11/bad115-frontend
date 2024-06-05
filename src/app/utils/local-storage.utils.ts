import { Company } from '../interfaces/company.interface';
import { Person } from '../interfaces/person.interface';

export const getPersonLocalStorage = (): Person => {
  return JSON.parse(localStorage.getItem('person') || '{}');
};

export const getCompanyLocalStorage = (): Company => {
  return JSON.parse(localStorage.getItem('company') || '{}');
};
