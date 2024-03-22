import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, @Inject(AuthService) private authService: AuthService) {
    this.form = this.fb.group({
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  submit() {
    const response = this.authService.login(this.form.value.email, this.form.value.password);
    console.log(response);
  }
}
