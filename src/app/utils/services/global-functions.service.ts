import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Session } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionsService {
  private store = inject(Store);
  sessionValue!: Session;
  permissions: WritableSignal<string[]> = signal([]);

  constructor() {
    this.store.select('session').subscribe((session) => {
      this.sessionValue = session;
      this.permissions.set(session.user.permissions);
    });
  }

  verifyPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }
}
