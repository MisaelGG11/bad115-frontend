import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Country, Person } from '../../../../../interfaces/person.interface';
import { injectInfiniteQuery, injectQuery } from '@tanstack/angular-query-experimental';

import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from '../../../../../components/spinner/spinner.component';
import {
  getCompanyLocalStorage,
  getPersonLocalStorage,
} from '../../../../../utils/local-storage.utils';
import { Company } from '../../../../../interfaces/company.interface';
import { JobService } from '../../../../../services/job.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from '../../../../../services/address.service';
import { GlobalFunctionsService } from '../../../../../utils/services/global-functions.service';
import {
  contractOptionsJobPosition,
  experienceOptionsJobPosition,
  modalityOptionsJobPosition,
  workDayOptionsJobPosition,
} from '../../../../../utils/job-position.utils';
import { EditJobPositionComponent } from '../edit-job-position/edit-job-position.component';

export interface JobFilters {
  [key: string]: string | null;
  name: string | null;
  countryId: string | null;
  modality: string | null;
  contractType: string | null;
  experiencesLevel: string | null;
  workday: string | null;
  companyId: string | null;
}

@Component({
  selector: 'app-job-position-list',
  standalone: true,
  imports: [
    DropdownModule,
    CardModule,
    RippleModule,
    DatePipe,
    TooltipModule,
    ButtonModule,
    SpinnerComponent,
    ReactiveFormsModule,
    FormsModule,
    EditJobPositionComponent,
  ],
  templateUrl: './job-position-list.component.html',
  styles: ``,
})
export class JobPositionListComponent {
  private global = inject(GlobalFunctionsService);
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private addressService = inject(AddressService);
  private person: Person = getPersonLocalStorage();
  private company: Company = getCompanyLocalStorage();
  @Input() candidatesView = false;
  @Input() selectedJobPositionId = signal('');
  @Output() showDeleteDialog = new EventEmitter<string>();
  @Output() showEditDialog = new EventEmitter<string>();
  @Output() showVisualizePage = new EventEmitter<string>();
  modalityOptions: Array<{ label: string; value: string | { name: string } }> =
    modalityOptionsJobPosition;
  contractOptions: Array<{ label: string; value: string | { name: string } }> =
    contractOptionsJobPosition;
  experienceOptions: Array<{ label: string; value: string | { name: string } }> =
    experienceOptionsJobPosition;
  workDayOptions: Array<{ label: string; value: string | { name: string } }> =
    workDayOptionsJobPosition;
  countriesOptions: Array<{ label: string; value: string }> = [];
  companiesOptions: Array<{ label: string; value: string }> = [];
  filters: any = {
    name: '',
    countryId: null,
    modality: null,
    contractType: null,
    experiencesLevel: null,
    workday: null,
    companyId: this.company ? this.company.id : null,
  };
  roles = this.global.getRoles();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidatesView']) {
      console.log('candidatesView', this.candidatesView);
      this.jobPositionsRequest.refetch();
    }
  }

  countriesRequest = injectQuery(() => ({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await this.addressService.getCountries();
      this.addCountriesOptions(data);
      return data;
    },
  }));

  companiesRequest = injectQuery(() => ({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data } = await this.jobService.getCompanyCatalog();
      this.addCompaniesOptions(data);
      return data;
    },
  }));

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  }

  addCompaniesOptions(companies: Company[]) {
    this.companiesOptions = companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }

  jobPositionsRequest = injectInfiniteQuery(() => {
    const queryFn = ({ pageParam }: { pageParam: number }) => {
      const isCompany = Object.keys(this.company).length > 0;
      const isCandidate = this.route.routeConfig?.path === 'red-talenthub';

      if (isCompany) {
        return this.jobService.getAllJobPositions(
          {
            page: pageParam,
            perPage: 5,
          },
          { ...this.filters, available: 'false' },
        );
      }

      if (isCandidate) {
        return this.jobService.getAllJobPositions(
          {
            page: pageParam,
            perPage: 5,
          },
          { ...this.filters },
        );
      }

      return this.jobService.getJobPositionsRecruiter(this.person.recruiterId, {
        page: pageParam,
        perPage: 5,
      });
    };

    return {
      queryKey: ['job-positions-candidates', this.filters, this.candidatesView],
      queryFn,
      initialPageParam: 1,
      getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
      getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
      maxPages: 3,
    };
  });

  #hasNextPage = this.jobPositionsRequest.hasNextPage;
  #isFetchingNextPage = this.jobPositionsRequest.isFetchingNextPage;

  nextButtonDisabled = computed(() => !this.#hasNextPage() || this.#isFetchingNextPage());
  nextButtonText = computed(() =>
    this.#isFetchingNextPage()
      ? 'Cargando...'
      : this.#hasNextPage()
        ? 'Cargar más'
        : 'No hay más registros',
  );

  onClickShowEditDialog(jobPositionId: string) {
    this.showEditDialog.emit(jobPositionId);
  }

  onClickShowDeleteDialog(jobPositionId: string) {
    this.showDeleteDialog.emit(jobPositionId);
  }

  onClickShowVisualizePage(jobPositionId: string) {
    this.showVisualizePage.emit(jobPositionId);
  }

  async onFilterModality() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterWorkday() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterName() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterExperience() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterContract() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterCountry() {
    await this.jobPositionsRequest.refetch();
  }

  async onFilterCompany() {
    await this.jobPositionsRequest.refetch();
  }

  onClearFilters() {
    this.filters = {
      name: '',
      countryId: null,
      modality: null,
      contractType: null,
      experiencesLevel: null,
      workday: null,
      companyId: this.company ? this.company.id : null,
    };
    this.jobPositionsRequest.refetch();
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
