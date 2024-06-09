import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CandidateService } from '../../../../../services/candidate.service';
import { toast } from 'ngx-sonner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../../../../../services/interfaces/candidate.dto';
import { Recommendation } from '../../../../../interfaces/candidate.interface';

@Component({
  selector: 'app-edit-recommendation',
  standalone: true,
  imports: [ReactiveFormsModule, TextareaComponent, SelectComponent, ButtonModule, DialogModule],
  templateUrl: './edit-recommendation.component.html',
  styles: ``,
})
export class EditRecommendationComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() candidateId: string = '';
  @Input() recommendation: Recommendation | null = null;
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

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['recommendation']) {
      console.log(this.recommendation);
      this.form.patchValue({
        type: this.recommendation?.type,
        recomendation: this.recommendation?.recomendation,
      });
    }
  }

  editRecommendationMutation = injectMutation(() => ({
    mutationFn: async (recommendationDto: UpdateRecommendationDto) =>
      await this.candidateService.updateRecommendation(
        this.candidateId,
        this.recommendation?.id || '',
        recommendationDto,
      ),
    onSuccess: async () => {
      toast.success('Recomendación actualizada', { duration: 3000 });
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
    await this.editRecommendationMutation.mutateAsync(this.form.value);
  }
}
