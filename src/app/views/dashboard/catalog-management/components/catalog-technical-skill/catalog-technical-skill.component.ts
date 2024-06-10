import { Component, inject, signal } from '@angular/core';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { PERMISSIONS } from '../../../../../utils/constants.utils';
import { ButtonModule } from 'primeng/button';
import { CatalogTechnicalSkillListComponent } from './components/catalog-technical-skill-list/catalog-technical-skill-list.component';

@Component({
  selector: 'app-catalog-technical-skill',
  standalone: true,
  imports: [ButtonModule, CatalogTechnicalSkillListComponent],
  templateUrl: './catalog-technical-skill.component.html',
})
export class CatalogTechnicalSkillComponent {
  private global = inject(GlobalFunctionsService);
  showAddModal = signal(false);

  onClickCreate() {
    this.showAddModal.set(true);
  }

  canCreate() {
    return this.global.verifyPermission(PERMISSIONS.CREATE_CATALOG);
  }
}
