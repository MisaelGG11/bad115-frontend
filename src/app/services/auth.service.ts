import { Injectable } from '@angular/core';
import network from '../config/network.service';
import {
  LoginDto,
  LoginResponse,
  RefreshResponse,
  SignupDto,
  UnlockedUserDto,
} from './interfaces/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  async login(loginDto: LoginDto) {
    return await network.post<LoginResponse>('/auth/login', loginDto);
  }

  async refreshToken(refreshToken: string) {
    return await network.post<RefreshResponse>('/refresh-token', { refreshToken });
  }

  async getUserData() {
    return await network.get('/user-data');
  }

  async unblockUser(unlockUserDto: UnlockedUserDto) {
    return await network.post<void>('/auth/unlock-users', unlockUserDto);
  }

  async signup(signupDto: SignupDto) {
    return await network.post<void>('/auth/signup', signupDto);
  }
}
