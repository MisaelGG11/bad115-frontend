import { Injectable } from '@angular/core';
import network from '../config/network.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async login(email: string, password: string) {
    return await network.post('/auth/login', { email, password })
  }

  async refreshToken(refreshToken: string) {
    return await network.post('/refresh-token', { refreshToken })
  }

  async getUserData() {
    return await network.get('/user-data')
  }
}
