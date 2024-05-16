import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LaborExperiencesListComponent } from './components/labor-experiences-list/labor-experiences-list.component';

@Component({
  selector: 'app-laboral-experience',
  standalone: true,
  imports: [ButtonModule, LaborExperiencesListComponent],
  templateUrl: './labor-experience.component.html',
  styles: [],
})
export class LaborExperienceComponent {
  constructor() {}

  showAddDialog() {
    console.log('showAddDialog');
  }

  showEditDialog(laborExperienceId: string) {
    console.log('showEditDialog', laborExperienceId);
  }

  showDeleteDialog(laborExperienceId: string) {
    console.log('showDeleteDialog', laborExperienceId);
  }
}
