import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { login, logout } from '../../../store/auth.actions';
import { Session } from '../../../interfaces/user';
import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  private router = inject(Router);
  private store = inject(Store);
  private authService = inject(AuthService);
  session$: Observable<Session>;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
    this.session$ = this.store.select('session')
  }

  loginStore(){
    this.store.dispatch(login())
  }

  async submit() {
    if(this.form.valid){
      const response = await this.authService.login(this.form.value.email, this.form.value.password);
      if(response.status === 201 || response.status === 200){
        this.loginStore()
        this.router.navigate(['/dashboard'])
      }
    }
  }
}
