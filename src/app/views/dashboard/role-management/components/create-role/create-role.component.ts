import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './create-role.component.html',
  styles: [],
})
export class CreateRoleComponent {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  createRoleMutation = injectMutation(() => ({
    mutationFn: async (name: string) => this.userService.createRole(name),
    onSuccess: async () => {
      toast.success('Rol creado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['roles'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createRoleMutation.mutateAsync(this.form.value.name);
    this.visible.set(false);
  }
}
