import { Component, signal } from '@angular/core';
import { UnlockRequestListComponent } from './components/unblock-users-list/unlock-request-list.component';

@Component({
  selector: 'app-unblock-users',
  standalone: true,
  imports: [UnlockRequestListComponent],
  templateUrl: './unblock-users.component.html',
  styles: ``,
})
export class UnblockUsersComponent {}
