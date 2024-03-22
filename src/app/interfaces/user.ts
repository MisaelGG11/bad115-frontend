export interface UserData  {
  email: string;
  sub: string;
  permissions: string[];
  roles: string[];
  iat: number;
  exp: number;
};
