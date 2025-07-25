import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../../../services/job.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DatePipe, CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../../../components/spinner/spinner.component';
import { EditRequirementsComponent } from './components/edit-requirements/edit-requirements.component';
import { EditTechnicalSkillsComponent } from './components/edit-technical-skills/edit-technical-skills.component';
import { EditLanguageSkillsComponent } from './components/edit-language-skills/edit-language-skills.component';
import { Company } from '../../../../../interfaces/company.interface';
import {
  getCompanyLocalStorage,
  getPersonLocalStorage,
} from '../../../../../utils/local-storage.utils';
import { CreateJobApplicationComponent } from '../create-job-application/create-job-application.component';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import { ROLES } from '../../../../../utils/constants.utils';

@Component({
  selector: 'app-visualize-job-position',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    SpinnerComponent,
    EditRequirementsComponent,
    EditTechnicalSkillsComponent,
    EditLanguageSkillsComponent,
    CreateJobApplicationComponent,
  ],
  templateUrl: './visualize-job-position.component.html',
  styles: ``,
})
export class VisualizeJobPositionComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private global = inject(GlobalFunctionsService);
  private jobService = inject(JobService);
  @Input() jobPositionId = this.route.snapshot.params['jobPositionId'];
  roles = this.global.getRoles();
  showApplyJobModal = signal(false);
  showEditTechnicalSkillsModal = signal(false);
  showEditLanguageSkillsModal = signal(false);
  showEditRequirementsModal = signal(false);
  companiesOptions: Array<{ name: string; id: string }> = [];
  companyRecruiter = false;
  companyJobPosition = '';
  person = getPersonLocalStorage();
  job!: any;
  jobAddress: string = '';
  private company: Company = getCompanyLocalStorage();
  showAddJobPositionButton = Object.keys(this.company).length === 0;

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobPositionId'] && !changes['jobPositionId'].isFirstChange()) {
      await this.jobPositionRequest.refetch();
    }
  }

  jobPositionRequest = injectQuery(() => ({
    queryKey: ['job-positions', { jobPositionId: this.jobPositionId }],
    queryFn: async () => {
      this.job = await this.jobService.getJobPosition(this.jobPositionId);
      this.companyJobPosition = this.job.company.id;
      if (this.companiesOptions.length > 0) {
        console.log(this.companyJobPosition);
        console.log(this.companiesOptions);
        this.companyRecruiter = this.companiesOptions.some(
          (company) => company.id === this.companyJobPosition,
        );
        console.log(this.companyRecruiter);
      }
      this.jobAddress = [
        this.job?.address?.street,
        this.job?.address?.numberHouse,
        this.job?.address?.municipality?.name,
        this.job?.address?.department?.name,
        this.job?.address?.country?.name,
      ]
        .filter(Boolean)
        .join(', ');
      return this.job;
    },
    enabled: !!this.jobPositionId,
  }));

  companiesRequest = injectQuery(() => ({
    queryKey: ['recruiter-companies'],
    queryFn: async () => {
      const { data } = await this.jobService.getRecruiterCompanies(this.person.recruiterId);
      this.addCompanies(data);
      return data;
    },
  }));

  addCompanies(companies: Company[]) {
    this.companiesOptions = companies.map((company) => ({
      name: company.name,
      id: company.id,
    }));
  }

  showApplyJobDialog() {
    this.showApplyJobModal.set(true);
  }

  showEditTechnicalSkillsDialog() {
    this.showEditTechnicalSkillsModal.set(true);
  }

  showEditRequirementsDialog() {
    this.showEditRequirementsModal.set(true);
  }

  showEditLanguageSkillsDialog() {
    this.showEditLanguageSkillsModal.set(true);
  }

  goToApplications() {
    this.router.navigate([`dashboard/red-talenthub/empleos/${this.jobPositionId}/aplicaciones`]);
  }

  canApply() {
    return this.roles.includes(ROLES.USER);
  }

  getModality(modality: string) {
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

  getLevelExperience(level: string) {
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

  getContractType(contractType: string) {
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

  getWorkday(workday: string) {
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
