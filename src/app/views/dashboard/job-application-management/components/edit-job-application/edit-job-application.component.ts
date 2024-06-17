import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { JobService } from '../../../../../services/job.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from '../../../../../components/inputs/textarea/textarea.component';
import { SelectComponent } from '../../../../../components/inputs/select/select.component';
import { updateJobApplicationDto } from '../../../../../services/interfaces/job.dto';

@Component({
  selector: 'app-edit-job-application',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    CommonModule,
    TextareaComponent,
    SelectComponent,
  ],
  templateUrl: './edit-job-application.component.html',
  styles: ``,
})
export class EditJobApplicationComponent {
  private jobService = inject(JobService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() jobApplicationId = '';
  statusOptions: Array<{
    label: string;
    value: string | { name: string };
  }> = [
    { label: 'Aplicada', value: 'Aplicada' },
    { label: 'En Proceso', value: 'En_Proceso' },
    { label: 'Entrevista final', value: 'Entrevista_final' },
    { label: 'Contratado', value: 'Contratado' },
    { label: 'Descartado', value: 'Descartado' },
  ];
  form: FormGroup;
  jobApplication: any;
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      recomendation: [''],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobApplicationId'] && !changes['jobApplicationId'].isFirstChange()) {
      const { data } = await this.jobApplicationRequest.refetch();
      this.form.patchValue({
        status: data?.status,
        recomendation: data?.recomendation,
      });
    }
  }

  jobApplicationRequest = injectQuery(() => ({
    queryKey: [
      'job-applications',
      {
        jobApplicationId: this.jobApplicationId,
      },
    ],
    queryFn: async () => await this.jobService.getJobApplication(this.jobApplicationId),
    enabled: !!this.jobApplicationId,
  }));

  editJobApplicationMutation = injectMutation(() => ({
    mutationFn: async (jobApplication: updateJobApplicationDto) =>
      this.jobService.updateJobApplication(this.jobApplicationId, jobApplication),
    onSuccess: async () => {
      toast.success('Aplicación de empleo actualizada', { duration: 3000 });
      await this.queryClient.invalidateQueries({
        queryKey: ['job-applications'],
      });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    await this.editJobApplicationMutation.mutateAsync(this.form.value);
    this.visible.set(false);
  }
}
