import { Component, inject, OnInit, signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import {
  Country,
  Department,
  Municipality,
  Person,
} from '../../../../../interfaces/person.interface';
import { LOCAL_STORAGE } from '../../../../../utils/constants.utils';
import { PersonService } from '../../../../../services/person.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddressService } from '../../../../../services/address.service';
import { PaginatorModule } from 'primeng/paginator';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CreateAddressDto } from '../../../../../services/interfaces/person.interface';
import { toast } from 'ngx-sonner';
import { elSalvadorAddressValidator } from './el-savaldor-address.validator';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    PaginatorModule,
    CustomInputComponent,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './address-form.component.html',
  styles: [],
})
export class AddressFormComponent implements OnInit {
  private personService = inject(PersonService);
  private addressService = inject(AddressService);
  person = JSON.parse(localStorage.getItem(LOCAL_STORAGE.PERSON) ?? '');
  queryClient = injectQueryClient();
  form: FormGroup;
  countriesOptions: Array<{ label: string; value: string }> = [];
  departmentsOptions: Array<{ label: string; value: string }> = [];
  municipalityOptions = signal<Array<{ label: string; value: string }>>([]);
  selectedNameCountry = signal('');
  selectedDepartment = signal<string | null>(null);
  isLoadingMunicipalities = signal(false);

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group(
      {
        street: new FormControl<string>('', [Validators.required, Validators.maxLength(150)]),
        numberHouse: new FormControl<string>('', Validators.required),
        countryId: new FormControl<string>('', Validators.required),
        countryName: new FormControl<string>(''),
        departmentId: new FormControl<string>(''),
        municipalityId: new FormControl<string>(''),
      },
      { validators: elSalvadorAddressValidator },
    );
  }

  async ngOnInit() {
    const { data: personInfo } = await this.personService.getPerson(this.person.id);
    this.selectedDepartment.set(personInfo?.address?.department.id ?? '');
    this.selectedNameCountry = signal('');

    if (personInfo?.address?.department.id) {
      const { data: municipalities } = await this.addressService.getMunicipalitiesByDepartment(
        personInfo?.address?.department.id,
      );
      this.addMunicipalitiesOptions(municipalities);
    }

    this.form.patchValue({
      ...personInfo?.address,
      countryId: personInfo?.address?.country.id ?? '7b35283e-df44-4f97-93fd-34b76b20d674',
      countryName: personInfo?.address?.country.name ?? 'El Salvador',
      departmentId: personInfo?.address?.department.id,
      municipalityId: personInfo?.address?.municipality.id,
    });
  }

  personRequest = injectQuery(() => ({
    queryKey: ['person', this.person?.id],
    queryFn: async (): Promise<Person> => {
      const { data } = await this.personService.getPerson(this.person.id);
      const { address } = data;
      console.log({ address });

      return data;
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
      const { data } = await this.addressService.getDepartments();
      this.addDepartmentsOptions(data);
      return data;
    },
  }));

  addAddressMutation = injectMutation(() => ({
    mutationFn: async (input: CreateAddressDto) =>
      await this.personService.addAddress(this.person.id, input),
  }));

  updateAddressMutation = injectMutation(() => ({
    mutationFn: async (input: CreateAddressDto) =>
      await this.personService.addAddress(this.person.id, input),
    onError: () => {
      toast.error('Error al actualizar la dirección');
    },
  }));

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  }

  addDepartmentsOptions(departments: Department[]) {
    this.departmentsOptions = departments.map((department) => ({
      label: department.name,
      value: department.id,
    }));
  }

  addMunicipalitiesOptions(municipalities: Municipality[]) {
    this.municipalityOptions.set(
      municipalities.map((municipality: Municipality) => ({
        label: municipality.name,
        value: municipality.id,
      })),
    );
  }

  onCountryChange(event: any) {
    const selectedCountryId = event.value;
    const selectedCountryOption = this.countriesOptions.find(
      (option) => option.value === selectedCountryId,
    );
    this.form.patchValue({ countryName: selectedCountryOption?.label });
    this.selectedNameCountry.set(selectedCountryOption?.label ?? '');
  }

  async onDepartmentChange(event: any) {
    this.isLoadingMunicipalities.set(true);
    const selectedDepartmentId = event.value;
    this.selectedDepartment.set(selectedDepartmentId);

    const { data: municipalities } =
      await this.addressService.getMunicipalitiesByDepartment(selectedDepartmentId);
    this.addMunicipalitiesOptions(municipalities);
    this.isLoadingMunicipalities.set(false);
  }

  async submit() {
    if (!this.form.valid) {
      return;
    }

    if (this.personRequest.data()?.address !== null) {
      await this.updateAddressMutation.mutateAsync(this.form.value);
      return;
    }

    await this.addAddressMutation.mutateAsync(this.form.value);
  }
}
