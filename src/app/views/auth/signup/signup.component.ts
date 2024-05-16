import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { AuthService } from '../../../services/auth.service';
import { login, setPerson } from '../../../store/auth.actions';
import { PersonService } from '../../../services/person.service';
import { Session } from '../../../interfaces/user.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent, CalendarModule, DropdownModule],
  templateUrl: './signup.component.html',
  styles: ``,
})
export class SignupComponent {
  private authService = inject(AuthService);
  private person = inject(PersonService);
  private router = inject(Router);
  private store = inject(Store);
  session$: Observable<Session>;
  sessionValue: Session | undefined;
  form: FormGroup;
  maxDate: Date = new Date();
  genderOptions: Array<{ label: string; value: string }> = [];

  constructor(private readonly fb: FormBuilder) {
    this.genderOptions = [
      { label: 'Masculino', value: 'M' },
      { label: 'Femenino', value: 'F' },
    ];

    this.form = this.fb.group({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', Validators.required),
      firstName: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl<string>('', Validators.required),
      middleName: new FormControl<string>(''),
      secondLastName: new FormControl<string>(''),
      birthday: new FormControl<Date>(new Date(), Validators.required),
      gender: new FormControl<string>('', Validators.required),
    });

    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.sessionValue = session;
    });
  }

  async loginStore() {
    this.store.dispatch(login());
    const { data } = await this.person.getPerson(this.sessionValue?.user?.personId ?? '');
    this.store.dispatch(setPerson(data));
    localStorage.setItem('person', JSON.stringify(data));
  }

  async submit() {
    if (this.form.valid) {
      const response = await this.authService.signup(this.form.value);

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
