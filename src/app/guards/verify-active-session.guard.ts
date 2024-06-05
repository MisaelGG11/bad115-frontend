import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';
import { hasExpiredToken } from '../utils/token.utils';

export const verifyActiveSession: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  let sessionValue!: Session;
  let validateAccess = false;

  store.select('session').subscribe((session) => {
    sessionValue = session;
  });
  if (sessionValue?.user) {
    if (sessionValue.token && hasExpiredToken(sessionValue.token)) {
      console.log('Token expired');
      router.navigate(['/forbidden']);
      validateAccess = false;
    } else {
      validateAccess = true;
    }
    validateAccess = true;
  } else {
    router.navigate(['/forbidden']);
    validateAccess = false;
  }

  return validateAccess;
};
