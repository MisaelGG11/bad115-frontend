import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';
import { LOCAL_STORAGE } from '../utils/constants.utils';

export const verifyRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  let sessionValue: Session | undefined;

  store.select('session').subscribe((session) => {
    sessionValue = session;
  });
  const access_token = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  if (sessionValue?.user) {
    return true;
  } else {
    router.navigate(['/forbidden']);
    return false;
  }
};
