import { Component } from '@angular/core';
import { AddressFormComponent } from '../profile/components/address-form/address-form.component';
import { DocumentsFormComponent } from '../profile/components/documents-form/documents-form.component';
import { ProfileFormComponent } from '../profile/components/profile-form/profile-form.component';
import { SharedModule } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { RecognitionTypeComponent } from './components/recognition-type/recognition-type.component';
import { CatalogTechnicalSkillComponent } from './components/catalog-technical-skill/catalog-technical-skill.component';
import { TechnicalSkillComponent } from './components/technical-skill/technical-skill.component';
import { LanguagesComponent } from './components/languages/languages.component';

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
    CatalogTechnicalSkillComponent,
    TechnicalSkillComponent,
    LanguagesComponent,
  ],
  templateUrl: './catalog-management.component.html',
  styles: [],
})
export class CatalogManagementComponent {}
