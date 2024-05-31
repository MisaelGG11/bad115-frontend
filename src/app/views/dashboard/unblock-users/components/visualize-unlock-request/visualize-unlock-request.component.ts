import { Component, Input, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataTableUnlockRequest } from '../unblock-users-list/unlock-request-list.component';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';

@Component({
  selector: 'app-visualize-unlock-request',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    TextareaComponent,
    CustomInputComponent,
  ],
  templateUrl: './visualize-unlock-request.component.html',
  styles: ``,
})
export class VisualizeUnlockRequestComponent {
  @Input() visible = signal(false);
  @Input() unlockRequest!: DataTableUnlockRequest;
  @Input() status!: string;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      lastName: [''],
      email: [''],
      reason: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    console.log(this.status);
    if (changes['unlockRequest'] && !changes['unlockRequest'].isFirstChange()) {
      this.form.patchValue({
        name: this.unlockRequest.name,
        lastName: this.unlockRequest.lastName,
        email: this.unlockRequest.email,
        reason: this.unlockRequest.reason ? this.unlockRequest.reason : '',
      });
    }
  }
}
