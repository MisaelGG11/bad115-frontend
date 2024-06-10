import { Component, inject, Input, signal } from '@angular/core';
import { LanguageService } from '../../../../../../../services/language.service';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toast } from 'ngx-sonner';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-language',
  standalone: true,
  imports: [CustomInputComponent, DialogModule, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './create-language.component.html',
})
export class CreateLanguageComponent {
  private languageService = inject(LanguageService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      language: ['', Validators.required],
    });
  }

  createLanguageMutation = injectMutation(() => ({
    mutationFn: async () => this.languageService.create(this.form.value.language),
    onSuccess: async () => {
      toast.success('Idioma creado', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['languages'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.createLanguageMutation.mutateAsync();
    this.visible.set(false);
  }
}
