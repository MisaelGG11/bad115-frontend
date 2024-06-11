import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { AddressService } from '../../../../../services/address.service';
import { Country, Department, Municipality } from '../../../../../interfaces/person.interface';
import { CommonModule, Location } from '@angular/common';
import { JobService } from '../../../../../services/job.service';
import { TechnicalSkill } from '../../../../../interfaces/job.interface';
import { addDays } from 'date-fns';
import { toast } from 'ngx-sonner';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import { Company } from '../../../../../interfaces/company.interface';
import { CreateJobPositionDto } from '../../../../../services/interfaces/job.dto';

@Component({
  selector: 'app-create-job-position',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    TooltipModule,
    ReactiveFormsModule,
    CommonModule,
    CustomInputComponent,
    SelectComponent,
    TextareaComponent,
    CalendarComponent,
  ],
  templateUrl: './create-job-position.component.html',
  styles: ``,
})
export class CreateJobPositionComponent {
  private location = inject(Location);
  private addressService = inject(AddressService);
  private jobService = inject(JobService);
  person = getPersonLocalStorage();
  form: FormGroup;
  modalityOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Presencial', value: 'ON_SITE' },
    { label: 'Remoto', value: 'REMOTE' },
    { label: 'Hibrido', value: 'HYBRID' },
  ];
  contractOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Practicante', value: 'INTERNSHIP' },
    { label: 'Temporal', value: 'TEMPORARY' },
    { label: 'Contratista', value: 'CONTRACTOR' },
    { label: 'Permanente', value: 'PERMANENT' },
    { label: 'Voluntario', value: 'VOLUNTEER' },
    { label: 'Por proyecto', value: 'BY_PROJECT' },
  ];
  experienceOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Menos de 1 año', value: 'LESS_ONE_YEAR' },
    { label: '1 a 3 años', value: 'ONE_TO_THREE_YEARS' },
    { label: '3 a 5 años', value: 'THREE_TO_FIVE_YEARS' },
    { label: 'Más de 5 años', value: 'MORE_FIVE_YEARS' },
  ];
  workDayOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Tiempo completo', value: 'FULL_TIME' },
    { label: 'Medio tiempo', value: 'PART_TIME' },
    { label: 'Intermitente', value: 'INTERMITTENT' },
  ];
  languageLevelOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'A1', value: 'A1' },
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' },
    { label: 'B2', value: 'B2' },
    { label: 'C1', value: 'C1' },
    { label: 'C2', value: 'C2' },
  ];
  skillsOptions: Array<{ label: string; value: string | { name: string } }> = [
    { label: 'Escucha', value: 'Escucha' },
    { label: 'Lectura', value: 'Lectura' },
    { label: 'Escritura', value: 'Escritura' },
    { label: 'Conversación', value: 'Conversación' },
  ];
  today = new Date();
  tomorrow = addDays(new Date(), 1);
  companyId: string = '385bbe66-ec1d-4639-831b-8499fb939cd8';
  countriesOptions: Array<{ label: string; value: { id: string; name: string } }> = [];
  departmentsOptions: Array<{ label: string; value: string }> = [];
  municipalitiesOptions: Array<{ label: string; value: string }> = [];
  categoriesOptions: Array<{ label: string; value: string }> = [];
  technicalSkillsOptions: Array<{ label: string; value: any }> = [];
  languageOptions: Array<{ label: string; value: string }> = [];
  companiesOptions: Array<{ label: string; value: string }> = [];
  queryClient = injectQueryClient();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      salaryRange: ['', Validators.required],
      modality: ['', Validators.required],
      contractType: ['', Validators.required],
      experiencesLevel: ['', Validators.required],
      workday: ['', Validators.required],
      description: ['', Validators.required],
      closeTime: ['', Validators.required],
      companyId: [this.companyId, Validators.required],
      address: [null],
      street: ['', Validators.required],
      numberHouse: ['', Validators.required],
      country: [null, Validators.required],
      countryId: ['', Validators.required],
      countryName: ['', Validators.required],
      departmentId: [''],
      municipalityId: [''],
      requirements: this.fb.array([]),
      languageSkills: this.fb.array([]),
      technicalSkills: this.fb.array([]),
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

  technicalSkillsRequest = injectQuery(() => ({
    queryKey: ['technical-skills'],
    queryFn: async () => {
      const { data } = await this.jobService.getTechnicalSkills();
      this.addTechnicalSkills(data);
      return data;
    },
  }));

  languageRequest = injectQuery(() => ({
    queryKey: ['languages'],
    queryFn: async () => {
      const { data } = await this.jobService.getLanguages();
      this.languageOptions = data.map((language: any) => ({
        label: language.language,
        value: language.id,
      }));
      return data;
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

  addTechnicalSkills(techincialSkills: TechnicalSkill[]) {
    this.technicalSkillsOptions = techincialSkills.map((techincialSkill: TechnicalSkill) => ({
      label: techincialSkill.name,
      value: techincialSkill.id,
    }));
  }

  addCompanies(companies: Company[]) {
    this.companiesOptions = companies.map((company) => ({
      label: company.name,
      value: company.id,
    }));
  }

  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  addRequirement(event: Event) {
    const requirementFormGroup = this.fb.group({
      description: ['', Validators.required],
    });
    this.requirements.push(requirementFormGroup);
    event.preventDefault();
  }

  removeRequirement(event: Event, index: number) {
    this.requirements.removeAt(index);
    event.preventDefault();
  }

  get technicalSkills(): FormArray {
    return this.form.get('technicalSkills') as FormArray;
  }

  addTechnicalSkill(event: Event) {
    const technicalSkillFormGroup = this.fb.group({
      technicalSkillId: ['', Validators.required],
    });
    this.technicalSkills.push(technicalSkillFormGroup);
    event.preventDefault();
  }

  removeTechnicalSkill(event: Event, index: number) {
    this.technicalSkills.removeAt(index);
    event.preventDefault();
  }

  get languageSkills(): FormArray {
    return this.form.get('languageSkills') as FormArray;
  }

  addlanguageSkill(event: Event) {
    const languageSkillFormGroup = this.fb.group({
      languageId: ['', Validators.required],
      level: ['', Validators.required],
      skill: ['', Validators.required],
    });
    this.languageSkills.push(languageSkillFormGroup);
    event.preventDefault();
  }

  removelanguageSkill(event: Event, index: number) {
    this.languageSkills.removeAt(index);
    event.preventDefault();
  }

  createJobPositonMutation = injectMutation(() => ({
    mutationFn: async (input: CreateJobPositionDto) =>
      await this.jobService.createJobPosition(input),
    onSuccess: async () => {
      toast.success('Puesto de trabajo creado', { duration: 3000 });
      this.location.back();
      await this.queryClient.invalidateQueries({ queryKey: ['job-positions'] });
    },
  }));

  goBack() {
    this.location.back();
  }

  submit() {
    this.form.markAllAsTouched();
    this.form.patchValue({
      address: {
        street: this.form.get('street')?.value,
        numberHouse: this.form.get('numberHouse')?.value,
        countryId: this.form.get('countryId')?.value,
        countryName: this.form.get('countryName')?.value,
        departmentId: this.form.get('departmentId')?.value,
        municipalityId: this.form.get('municipalityId')?.value,
      },
    });

    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.createJobPositonMutation.mutateAsync(this.form.value);
  }
}
