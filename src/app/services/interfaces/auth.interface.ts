export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UnlockedUserDto {
  email: string;
}

export interface SignupDto {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  birthDay: Date;
  gender: string;
}
