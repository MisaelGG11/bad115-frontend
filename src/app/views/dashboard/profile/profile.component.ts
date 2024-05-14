import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TabViewModule, ProfileFormComponent],
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent {}
