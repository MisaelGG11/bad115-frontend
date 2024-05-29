import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomInputComponent } from '../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../../services/user.service';
import { Permission } from '../../../../interfaces/user.interface';
import { PermissionDto } from '../../../../services/interfaces/user.dto';

@Component({
  selector: 'app-edit-permission',
  standalone: true,
  imports: [ButtonModule, CustomInputComponent, DialogModule, ReactiveFormsModule],
  templateUrl: './edit-permission.component.html',
  styles: [],
})
export class EditPermissionComponent implements OnChanges {
  private userService = inject(UserService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() readOnly = signal(false);
  @Input() permission!: Permission;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      codename: ['', Validators.required],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['permission'] && !changes['permission'].isFirstChange()) {
      this.form.patchValue({
        name: this.permission.name,
        description: this.permission.description,
        codename: this.permission.codename,
      });
    }
  }

  editPermissionMutation = injectMutation(() => ({
    mutationFn: async (permissionDto: PermissionDto) =>
      this.userService.updatePermission(this.permission.id, permissionDto),
    onSuccess: async () => {
      await this.queryClient.invalidateQueries({
        queryKey: ['permissions'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editPermissionMutation.mutateAsync(this.form.value);
    this.visible.set(false);
  }
}
