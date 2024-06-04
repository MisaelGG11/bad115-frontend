import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { login, setCompany, setPerson } from '../../../store/auth.actions';
import { Session, UserData, UserDataCompany } from '../../../interfaces/user.interface';
import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { PersonService } from '../../../services/person.service';
import { LOCAL_STORAGE } from '../../../utils/constants.utils';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent {
  private router = inject(Router);
  private store = inject(Store);
  private personService = inject(PersonService);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  session$: Observable<Session>;
  sessionValue: Session | undefined;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue = session;
    });

    if (this.sessionValue?.token) {
      this.router.navigate(['/dashboard']);
    }
  }
  async loginStore() {
    this.store.dispatch(login());

    if (this.sessionValue?.user) {
      if (this.isPersonUser(this.sessionValue.user)) {
        const { data } = await this.personService.getPerson(this.sessionValue.user.personId);
        this.store.dispatch(setPerson(data));
        localStorage.setItem(LOCAL_STORAGE.PERSON, JSON.stringify(data));
      } else if (this.isCompanyUser(this.sessionValue.user)) {
        const company = await this.companyService.getCompany(this.sessionValue.user.companyId);
        this.store.dispatch(setCompany(company));
        localStorage.setItem(LOCAL_STORAGE.COMPANY, JSON.stringify(company));
      }
    }
  }

  private isPersonUser(user: UserData | UserDataCompany): user is UserData {
    return (user as UserData).personId !== undefined;
  }

  private isCompanyUser(user: UserData | UserDataCompany): user is UserDataCompany {
    return (user as UserDataCompany).companyId !== undefined;
  }

  async submit() {
    if (this.form.valid) {
      const response = await this.authService.login(this.form.value);
      if (response.status === 201 || response.status === 200) {
        await this.loginStore();
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
