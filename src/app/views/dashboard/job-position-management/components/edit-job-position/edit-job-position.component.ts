import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { Company } from '../../../../../interfaces/company.interface';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { JobService } from '../../../../../services/job.service';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import {
  contractOptionsJobPosition,
  experienceOptionsJobPosition,
  modalityOptionsJobPosition,
  workDayOptionsJobPosition,
} from '../../../../../utils/job-position.utils';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { addDays } from 'date-fns';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AddressService } from '../../../../../services/address.service';
import { Country, Department, Municipality } from '../../../../../interfaces/person.interface';

@Component({
  selector: 'app-edit-job-position',
  standalone: true,
  imports: [
    DialogModule,
    CustomInputComponent,
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    CalendarComponent,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './edit-job-position.component.html',
  styles: ``,
})
export class EditJobPositionComponent implements OnChanges {
  private jobService = inject(JobService);
  private addressService = inject(AddressService);
  @Input() visible = signal(false);
  @Input() jobPositionId = '';
  queryClient = injectQueryClient();
  person = getPersonLocalStorage();
  form: FormGroup;
  companiesOptions: Array<{ label: string; value: string }> = [];
  today = new Date();
  tomorrow = addDays(new Date(), 1);
  countriesOptions: Array<{ label: string; value: { id: string; name: string } }> = [];
  departmentsOptions: Array<{ label: string; value: string }> = [];
  municipalitiesOptions: Array<{ label: string; value: string }> = [];
  jobPositionHasAddress = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      salaryRange: ['', Validators.required],
      modality: ['', Validators.required],
      contractType: ['', Validators.required],
      experiencesLevel: ['', Validators.required],
      workday: ['', Validators.required],
      description: ['', Validators.required],
      closeTime: ['', Validators.required],
      companyId: ['', Validators.required],
      street: [''],
      numberHouse: [''],
      country: [null],
      countryId: [''],
      countryName: [''],
      departmentId: [''],
      municipalityId: [''],
    });

    this.form.get('country')?.valueChanges.subscribe((value) => {
      this.form.get('countryId')?.setValue(value.id);
      this.form.get('countryName')?.setValue(value.name);
      if (value.name === 'El Salvador') {
        this.form.get('departmentId')?.setValidators([Validators.required]);
        this.form.get('municipalityId')?.setValidators([Validators.required]);

        this.departmentsRequest.refetch();
      } else {
        this.form.get('departmentId')?.setValidators([]);
        this.form.get('municipalityId')?.setValidators([]);
      }
      this.form.get('departmentId')?.updateValueAndValidity();
      this.form.get('municipalityId')?.updateValueAndValidity();
    });

    this.form.get('departmentId')?.valueChanges.subscribe(() => {
      this.municipalitiesRequest.refetch();
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    await Promise.all([this.jobPositionRequest.refetch(), this.countriesRequest.refetch()]);
    await this.departmentsRequest.refetch();
    await this.municipalitiesRequest.refetch();
  }

  jobPositionRequest = injectQuery(() => ({
    queryKey: ['job-position', this.jobPositionId],
    queryFn: async () => {
      const response = await this.jobService.getJobPosition(this.jobPositionId);

      this.jobPositionHasAddress = response.address !== null;

      this.form.patchValue({
        name: response.name,
        salaryRange: response.salaryRange,
        modality: response.modality,
        contractType: response.contractType,
        experiencesLevel: response.experiencesLevel,
        workday: response.workday,
        description: response.description,
        closeTime: new Date(response.closeTime),
        companyId: response.company.id,
        street: response?.address.street,
        numberHouse: response?.address.numberHouse,
        country: {
          id: response?.address.country.id,
          name: response?.address.country.name,
        },
        countryId: response?.address.country.id,
        countryName: response?.address.country.name,
        departmentId: response?.address.department?.id,
        municipalityId: response?.address.municipality?.id,
      });

      return response;
    },
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
      label: company.name,
      value: company.id,
    }));
  }

  editJobPositionMutation = injectMutation(() => ({
    mutationFn: async () => {
      console.log(this.form.value);
      if (this.jobPositionHasAddress) {
        await Promise.all([
          this.jobService.updateJobPosition(this.jobPositionId, this.form.value),
          this.jobService.updateAddressJobPosition(
            this.jobPositionId,
            this.jobPositionRequest?.data()?.address.id ?? ' ',
            {
              countryId: this.form.get('country')?.value?.id,
              departmentId: this.form.get('departmentId')?.value,
              municipalityId: this.form.get('municipalityId')?.value,
              street: this.form.get('street')?.value,
              numberHouse: this.form.get('numberHouse')?.value,
              countryName: this.form.get('country')?.value?.name,
            },
          ),
        ]);
      } else {
        await this.jobService.updateJobPosition(this.jobPositionId, this.form.value);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        this.queryClient.invalidateQueries({ queryKey: ['job-positions-candidates'] }),
        this.queryClient.invalidateQueries({ queryKey: ['job-position'] }),
      ]);
      this.visible.set(false);
    },
  }));

  countriesRequest = injectQuery(() => ({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await this.addressService.getCountries();
      this.addCountriesOptions(data);
      return data;
    },
  }));

  departmentsRequest = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: async () => {
      if (this.form.get('country')?.value.name !== 'El Salvador') {
        return [];
      }
      const { data } = await this.addressService.getDepartments();
      this.addDepartmentsOptions(data);
      return data;
    },
  }));

  municipalitiesRequest = injectQuery(() => ({
    queryKey: ['municipalities'],
    queryFn: async () => {
      const departmentId = this.form.get('departmentId')?.value;
      if (departmentId) {
        const { data } = await this.addressService.getMunicipalitiesByDepartment(departmentId);
        this.addMunicipalitiesOptions(data);
        return data;
      }
      return [];
    },
  }));

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: {
        id: country.id,
        name: country.name,
      },
    }));
  }

  addDepartmentsOptions(departments: Department[]) {
    this.departmentsOptions = departments.map((department) => ({
      label: department.name,
      value: department.id,
    }));
  }

  addMunicipalitiesOptions(municipalities: Municipality[]) {
    this.municipalitiesOptions = municipalities.map((municipality) => ({
      label: municipality.name,
      value: municipality.id,
    }));
  }

  protected readonly workDayOptions = workDayOptionsJobPosition;
  protected readonly modalityOptions = modalityOptionsJobPosition;
  protected readonly experienceOptions = experienceOptionsJobPosition;
  protected readonly contractOptions = contractOptionsJobPosition;

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editJobPositionMutation.mutateAsync(this.form.value);
  }
}
