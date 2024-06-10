import { Component, inject, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { LanguageService } from '../../../../../../../services/language.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Language } from '../../../../../../../interfaces/language.interface';
import { DialogModule } from 'primeng/dialog';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-language',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, CustomInputComponent, ButtonModule],
  templateUrl: './edit-language.component.html',
})
export class EditLanguageComponent implements OnChanges {
  private languageService = inject(LanguageService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() readOnly = signal(false);
  @Input() selectedLanguage!: Language;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      language: ['', Validators.required],
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedLanguage'] && !changes['selectedLanguage'].isFirstChange()) {
      this.form.patchValue({
        language: this.selectedLanguage.language,
      });
      await this.languageRequest.refetch();
    }
  }

  languageRequest = injectQuery(() => ({
    queryKey: ['languages', { languageId: this.selectedLanguage.id }],
    queryFn: async () => {
      const response = await this.languageService.findOne(this.selectedLanguage.id);

      this.form.patchValue({
        language: response.language,
      });

      return response;
    },
  }));

  editLanguageMutation = injectMutation(() => ({
    mutationFn: async () =>
      await this.languageService.update(this.selectedLanguage.id, this.form.value.language),
    onSuccess: async () => {
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

    await this.editLanguageMutation.mutateAsync();
    this.visible.set(false);
  }
}
