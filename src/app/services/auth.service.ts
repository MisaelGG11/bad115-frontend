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
import { PaginatedResponse, PaginationParams } from '../interfaces/pagination.interface';
import { UnlockRequest } from '../interfaces/person.interface';
import { UpdateUnlockRequestDto } from './interfaces/person.dto';

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

  async unlockRequests({
    perPage = 10,
    page = 1,
  }: PaginationParams): Promise<PaginatedResponse<UnlockRequest>> {
    const unlockRequests = await network.get<PaginatedResponse<UnlockRequest>>(
      `/admins/unlock-requests?page=${page}&perPage=${perPage}`,
    );

    return unlockRequests.data;
  }

  async updateUnlockRequest(
    unlockRequestId: string,
    unlockRequestDto: UpdateUnlockRequestDto,
  ): Promise<UnlockRequest> {
    const response = await network.put<UnlockRequest>(
      `/admins/unlock-requests/${unlockRequestId}`,
      unlockRequestDto,
    );

    return response.data;
  }

  async signup(signupDto: SignupDto) {
    return await network.post<void>('/auth/signup', signupDto);
  }

  getPermissions() {
    return this.permissions;
  }
}
