import { Component } from '@angular/core';
import { AddressFormComponent } from '../profile/components/address-form/address-form.component';
import { DocumentsFormComponent } from '../profile/components/documents-form/documents-form.component';
import { ProfileFormComponent } from '../profile/components/profile-form/profile-form.component';
import { SharedModule } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { RecognitionTypeComponent } from './components/recognition-type/recognition-type.component';

@Component({
  selector: 'app-catalog-management',
  standalone: true,
  imports: [
    AddressFormComponent,
    DocumentsFormComponent,
    ProfileFormComponent,
    SharedModule,
    TabViewModule,
    RecognitionTypeComponent,
  ],
  templateUrl: './catalog-management.component.html',
  styles: [],
})
export class CatalogManagementComponent {}
