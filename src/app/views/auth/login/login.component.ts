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
import { login, setPerson } from '../../../store/auth.actions';
import { Session } from '../../../interfaces/user';
import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { PersonService } from '../../../services/person.service';

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
  private person = inject(PersonService);
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
    const { data } = await this.person.getPerson(this.sessionValue?.user?.personId ?? '');
    this.store.dispatch(setPerson(data));
    localStorage.setItem('person', JSON.stringify(data));
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
