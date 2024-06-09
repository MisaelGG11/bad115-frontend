import { Component, inject, Input, signal } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../../../services/candidate.service';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { CreateRecommendationDto } from '../../../../../services/interfaces/candidate.dto';

@Component({
  selector: 'app-create-recommendation',
  standalone: true,
  imports: [ReactiveFormsModule, TextareaComponent, SelectComponent, ButtonModule, DialogModule],
  templateUrl: './create-recommendation.component.html',
  styles: ``,
})
export class CreateRecommendationComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() candidateId: string = '';
  form: FormGroup;
  recommendationsTypesOptions: Array<{ label: string; value: string }> = [
    { label: 'Laboral', value: 'Laboral' },
    { label: 'Personal', value: 'Personal' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['', [Validators.required]],
      recomendation: ['', [Validators.required]],
    });
  }

  createRecommendationMutation = injectMutation(() => ({
    mutationFn: async (recommendationDto: CreateRecommendationDto) =>
      await this.candidateService.createRecommendation(
        this.candidateId,
        this.person.userId,
        recommendationDto,
      ),
    onSuccess: async () => {
      toast.success('Recomendación creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['candidates'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.createRecommendationMutation.mutateAsync(this.form.value);
  }
}
