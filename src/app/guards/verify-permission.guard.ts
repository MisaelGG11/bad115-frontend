import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Session } from '../interfaces/user.interface';

export const verifyPermissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store);
  let sessionValue!: Session;
  let permissions: string[] = [];

  store.select('session').subscribe((session) => {
    sessionValue = session;
    permissions = sessionValue?.user?.permissions ?? [];
  });
  if (permissions.includes(route.data['permission'])) {
    return true;
  }
  router.navigate(['/forbidden']);
  return false;
};
