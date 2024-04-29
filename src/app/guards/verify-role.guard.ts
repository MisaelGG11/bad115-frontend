import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const verifyRoleGuard: CanActivateFn = (route, state) => {
  const router = new Router();
  const access_token = localStorage.getItem('access_token');
  if (access_token) {
    return true;
  } else {
    router.navigate(['/forbidden']);
    return false;
  }
};
