import { Component, inject, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CompanyService } from '../../../services/company.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../components/inputs/select/select.component';
import { TextareaComponent } from '../../../components/inputs/textarea/textarea.component';
import { CalendarModule } from 'primeng/calendar';
import { toast } from 'ngx-sonner';
import { LOCAL_STORAGE } from '../../../utils/constants.utils';
import { Company } from '../../../interfaces/company.interface';
import { UpdateCompanyDto } from '../../../services/interfaces/company.dto';
import { setCompany } from '../../../store/auth.actions';
import { Store } from '@ngrx/store';
import { getCompanyLocalStorage } from '../../../utils/local-storage.utils';
import { phoneRegex } from '../../../utils/regex.utils';
import { Country } from '../../../interfaces/person.interface';
import { AddressService } from '../../../services/address.service';

@Component({
  selector: 'app-profile-company',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    DropdownModule,
    CustomInputComponent,
    SelectComponent,
    TextareaComponent,
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: './profile-company.component.html',
  styles: [],
})
export class ProfileCompanyComponent implements OnInit {
  private companyService = inject(CompanyService);
  private addressService = inject(AddressService);
  private store = inject(Store);
  queryClient = injectQueryClient();
  company = getCompanyLocalStorage();
  form: FormGroup;
  sizeOptions: Array<{ label: string; value: string }> = [];
  countriesOptions: Array<{ label: string; value: string }> = [];

  constructor(private readonly fb: FormBuilder) {
    this.sizeOptions = [
      { label: 'Microempresa', value: 'micro' },
      { label: 'Pequeña Empresa', value: 'small' },
      { label: 'Mediana Empresa', value: 'medium' },
      { label: 'Gran Empresa', value: 'large' },
    ];

    this.form = this.fb.group({
      name: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      size: new FormControl<string>('', Validators.required),
      countryId: new FormControl<string>('', Validators.required),
      description: new FormControl<string>(''),
      website: new FormControl<string>(''),
      phone: new FormControl<string>('', Validators.pattern(phoneRegex)),
      type: new FormControl<string>(''),
      assignedRecruiter: new FormControl<number>(0),
    });
  }

  async ngOnInit() {
    await this.companyRequest.refetch();
  }

  countriesRequest = injectQuery(() => ({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data } = await this.addressService.getCountries();
      this.addCountriesOptions(data);
      return data;
    },
  }));

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  }

  updateCompanyMutation = injectMutation(() => ({
    mutationFn: async (updateCompanyDto: UpdateCompanyDto) => {
      await this.companyService.updateCompany(this.company.id, updateCompanyDto);
    },
    onSuccess: async () => {
      toast.success('Perfil de la empresa actualizado', { duration: 3000 });
      await this.queryClient.invalidateQueries({ queryKey: ['companies'] });
      await this.updateSession();
    },
  }));

  companyRequest = injectQuery(() => ({
    queryKey: ['companies', { companyId: this.company?.id }],
    queryFn: async (): Promise<Company> => {
      const company = await this.companyService.getCompany(this.company.id);
      this.form.patchValue({ ...company, countryId: company.country.id });
      return company;
    },
  }));

  async submit() {
    console.log(this.form);
    if (this.form.valid) {
      await this.updateCompanyMutation.mutateAsync(this.form.value);
    }
  }

  async updateSession() {
    const company = await this.companyService.getCompany(this.company?.id ?? '');
    this.store.dispatch(setCompany(company));
    localStorage.setItem(LOCAL_STORAGE.COMPANY, JSON.stringify(company));
  }
}
