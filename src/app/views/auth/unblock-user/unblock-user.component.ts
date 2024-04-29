import {Component, inject} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomInputComponent} from "../../../components/inputs/custom-input/custom-input.component";
import {Router, RouterModule} from "@angular/router";
import {toast} from "ngx-sonner";


@Component({
  selector: 'app-unblock-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    RouterModule
  ],
  templateUrl: './unblock-user.component.html',
  styles: ``
})
export class UnblockUserComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  async submit() {
    if (this.form.valid) {
      const response = await this.authService.unblockUser(this.form.value);
      if (response.status === 201) {
        toast.success('Solicitud enviada correctamente', {
          description: 'Recibirás un correo cuando tu cuenta este desbloqueada',
          duration: 4500,
        });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500)
      }
    }
  }

}
