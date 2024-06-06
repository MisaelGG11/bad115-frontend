import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { DocumentsFormComponent } from './components/documents-form/documents-form.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { PrivacySettingsComponent } from './components/privacy-settings/privacy-settings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    TabViewModule,
    ProfileFormComponent,
    AddressFormComponent,
    DocumentsFormComponent,
    SocialMediaComponent,
    PrivacySettingsComponent,
  ],
  templateUrl: './profile.component.html',
  styles: [],
})
export class ProfileComponent {}
