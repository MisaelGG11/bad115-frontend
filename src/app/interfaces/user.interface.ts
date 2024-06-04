import { Company } from './company.interface';
import { Person } from './person.interface';

export interface UserData {
  email: string;
  userId: string;
  candidateId: string;
  recruiterId: string;
  personId: string;
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
}

export interface UserDataCompany {
  email: string;
  userId: string;
  companyId: string;
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
}

export interface Session {
  user: UserData | UserDataCompany | null;
  token: string | null;
  person: Person | null;
  company: Company | null;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  codename: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  avatar: string | null;
  person: Person;
  company: string | null;
  roles: Role[];
}
