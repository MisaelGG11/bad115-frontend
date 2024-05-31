import { Component, Input, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { AuthService } from '../../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { UpdateUnlockRequestDto } from '../../../../../services/interfaces/person.dto';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataTableUnlockRequest } from '../unblock-users-list/unlock-request-list.component';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';

@Component({
  selector: 'app-unlock-request-resolution',
  standalone: true,
  imports: [ButtonModule, DialogModule, CommonModule, ReactiveFormsModule, TextareaComponent],
  templateUrl: './unlock-request-resolution.component.html',
  styles: ``,
})
export class UnlockRequestResolutionComponent {
  private authService = inject(AuthService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() unlockRequest!: DataTableUnlockRequest;
  @Input() status!: string;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      reason: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['unlockRequest'] && !changes['unlockRequest'].isFirstChange()) {
      this.form.patchValue({
        status: this.status,
      });
    }
    if (changes['status'] && !changes['status'].isFirstChange()) {
      this.form.patchValue({
        status: this.status,
      });
    }
  }

  updateStateUnlockRequestMutation = injectMutation(() => ({
    mutationFn: async (unlockRequestDto: UpdateUnlockRequestDto) =>
      this.authService.updateUnlockRequest(this.unlockRequest.id, unlockRequestDto),
    onSuccess: async () => {
      if (this.form.value.status === 'APPROVED') toast.success('Solicitud aprobada');
      if (this.form.value.status === 'REJECTED') toast.success('Solicitud rechazada');
      await this.queryClient.invalidateQueries({
        queryKey: ['unlock-requests'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.updateStateUnlockRequestMutation.mutateAsync(this.form.value);
    this.visible.set(false);
  }
}
