import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CatalogTechnicalSkillListComponent } from '../catalog-technical-skill/components/catalog-technical-skill-list/catalog-technical-skill-list.component';
import { CreateCatalogTechnicalComponent } from '../catalog-technical-skill/components/create-catalog-technical/create-catalog-technical.component';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../../../utils/constants.utils';
import { TechnicalSkillListComponent } from './components/technical-skill-list/technical-skill-list.component';

@Component({
  selector: 'app-technical-skill',
  standalone: true,
  imports: [
    ButtonModule,
    CatalogTechnicalSkillListComponent,
    CreateCatalogTechnicalComponent,
    TechnicalSkillListComponent,
  ],
  templateUrl: './technical-skill.component.html',
})
export class TechnicalSkillComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_CATALOG);
  }
}
