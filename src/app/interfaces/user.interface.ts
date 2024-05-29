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

export interface Session {
  user: UserData | null;
  token: string | null;
  person: Person | null;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  codename: string;
}
