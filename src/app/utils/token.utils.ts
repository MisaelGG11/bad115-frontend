import { jwtDecode } from 'jwt-decode';
import { UserData } from '../interfaces/user';

// Decodifica un token
export function decoderToken(token: any): UserData {
  return jwtDecode<UserData>(token);
}

// Verifica expiración de token
export function hasExpiredToken(token: string) {
  const { exp } = decoderToken(token);

  const currentData = new Date().getTime();

  if (exp <= currentData) {
    return true;
  }

  return false;
}
