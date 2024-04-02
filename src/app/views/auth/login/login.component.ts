import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { login, logout } from '../../../store/auth.actions';
import { Session } from '../../../interfaces/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  private store = inject(Store);
  private authService = inject(AuthService);
  session$: Observable<Session>;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl(''),
      password: new FormControl('')
    });
    this.session$ = this.store.select('session')
  }

  loginStore(){
    this.store.dispatch(login())
  }

  submit() {
    const response = this.authService.login(this.form.value.email, this.form.value.password);
    this.loginStore()
    console.log(this.session$);
  }
}
