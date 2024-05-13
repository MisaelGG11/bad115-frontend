import { Person } from './person';

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
