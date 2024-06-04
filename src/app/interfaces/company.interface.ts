import { User, Country } from './person.interface';

export interface Company {
  id: string;
  name: string;
  size: string;
  countryId: string;
  email: string;
  password: string;
  description: string;
  website: string;
  phone: string;
  type: string;
  logo: string;
  user: User;
  country: Country;
}
