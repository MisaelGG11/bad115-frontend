import { inject, Injectable } from '@angular/core';
import network from '../config/network.service';
import {
  LoginDto,
  LoginResponse,
  RefreshResponse,
  SignupDto,
  UnlockedUserDto,
} from './interfaces/auth.dto';
import { Store } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  store = inject(Store);
  sessionValue: Session | undefined;
  permissions: string[] = [];

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
    });

    this.permissions = this.sessionValue?.user?.permissions ?? [];
  }

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

  getPermissions() {
    return this.permissions;
  }
}
