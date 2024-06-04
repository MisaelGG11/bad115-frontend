import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { Country } from '../../../interfaces/person.interface';
import { AddressService } from '../../../services/address.service';

import { toast } from 'ngx-sonner';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CalendarComponent } from '../../../components/inputs/calendar/calendar.component';
import { SelectComponent } from '../../../components/inputs/select/select.component';
import { TextareaComponent } from '../../../components/inputs/textarea/textarea.component';

import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { login, setCompany } from '../../../store/auth.actions';
import { Session } from '../../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { phoneRegex } from '../../../utils/regex.utils';
import { CompanyService } from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    CalendarComponent,
    SelectComponent,
    TextareaComponent,
  ],
  templateUrl: './create-company.component.html',
  styles: ``,
})
export class CreateCompanyComponent {
  private companyService = inject(CompanyService);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);
  session$: Observable<Session>;
  sessionValue: Session | undefined;
  form: FormGroup;
  maxDate: Date = new Date();
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
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', Validators.required),
      description: new FormControl<string>(''),
      website: new FormControl<string>(''),
      phone: new FormControl<string>('', Validators.pattern(phoneRegex)),
      type: new FormControl<string>(''),
    });

    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue = session;
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

  addCountriesOptions(countries: Country[]) {
    this.countriesOptions = countries.map((country) => ({
      label: country.name,
      value: country.id,
    }));
  }

  async loginStore() {
    this.store.dispatch(login());
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      for (const control in this.form.controls) {
        if (this.form.controls[control].value === '') {
          this.form.controls[control].setValue(null);
        }
      }
      const response = await this.companyService.createCompany(this.form.value);
      this.store.dispatch(setCompany(response.data));
      localStorage.setItem('company', JSON.stringify(response.data));

      if (response.status === 201 || response.status === 200) {
        await this.authService.login(this.form.value);
        await this.loginStore();

        toast.success('Registro existoso', {
          duration: 4500,
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2500);
      }
    }
  }
}
