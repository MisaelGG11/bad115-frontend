import { Component, Input, signal } from '@angular/core';
import { JobApplicationJobPosition } from '../../../../../interfaces/job.interface';
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualize-candidate-application',
  standalone: true,
  imports: [DialogModule, RouterLink, CommonModule],
  templateUrl: './visualize-candidate-application.component.html',
  styles: ``,
})
export class VisualizeCandidateApplicationComponent {
  @Input() visible = signal(false);
  @Input() jobApplication: JobApplicationJobPosition | null = null;

  getModality(modality: string | undefined) {
    //ON_SITE, REMOTE, HYBRID
    switch (modality) {
      case 'ON_SITE':
        return 'Presencial';
      case 'REMOTE':
        return 'Remoto';
      case 'HYBRID':
        return 'Híbrido';
      default:
        return '';
    }
  }

  getLevelExperience(level: string | undefined) {
    //LESS_ONE_YEAR, ONE_TO_THREE_YEARS, THREE_TO_FIVE_YEARS, MORE_FIVE_YEARS
    switch (level) {
      case 'LESS_ONE_YEAR':
        return 'Menos de un año';
      case 'ONE_TO_THREE_YEARS':
        return 'De 1 a 3 años';
      case 'THREE_TO_FIVE_YEARS':
        return 'De 3 a 5 años';
      case 'MORE_FIVE_YEARS':
        return 'Más de 5 años';
      default:
        return '';
    }
  }

  getContractType(contractType: string | undefined) {
    // INTERNSHIP, TEMPORARY, CONTRACTOR, PERMANENT, VOLUNTEER, BY_PROJECT
    switch (contractType) {
      case 'INTERNSHIP':
        return 'Pasantía';
      case 'TEMPORARY':
        return 'Temporal';
      case 'CONTRACTOR':
        return 'Contratista';
      case 'PERMANENT':
        return 'Permanente';
      case 'VOLUNTEER':
        return 'Voluntario';
      case 'BY_PROJECT':
        return 'Por proyecto';
      default:
        return '';
    }
  }

  getWorkday(workday: string | undefined) {
    // FULL_TIME, PART_TIME, INTERMITTENT
    switch (workday) {
      case 'FULL_TIME':
        return 'Tiempo completo';
      case 'PART_TIME':
        return 'Medio tiempo';
      case 'INTERMITTENT':
        return 'Intermitente';
      default:
        return '';
    }
  }
}
