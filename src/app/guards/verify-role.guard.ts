import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Session } from '../interfaces/user';

export const verifyRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  let sessionValue: Session | undefined;

  store.select('session').subscribe((session) => {
    sessionValue = session;
  })
  const access_token = localStorage.getItem('access_token');
  if(sessionValue?.user) {
    console.log(sessionValue);
    return true;
  } else {
    router.navigate(['/forbidden']);
    return false;
  }
};
