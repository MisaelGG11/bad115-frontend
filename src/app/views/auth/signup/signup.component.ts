import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomInputComponent } from '../../../components/inputs/custom-input/custom-input.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CustomInputComponent],
  templateUrl: './signup.component.html',
  styles: ``,
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', Validators.required),
      firstName: new FormControl<string>('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl<string>('', Validators.required),
      middleName: new FormControl<string>(''),
      secondLastName: new FormControl<string>(''),
      birthDay: new FormControl<Date>(new Date(), Validators.required),
      gender: new FormControl<string>('', Validators.required),
    });
  }

  async submit() {
    console.log(this.form.value);
    console.log(this.form.get('firstName'));
    console.log(this.form.errors);
  }
}
