export interface UserData  {
  email: string;
  userId: string,
  cadidateId: string,
  recruiterId: string,
  personId: string,
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
};

export interface Session {
  user: UserData | null,
  token: string | null
}
