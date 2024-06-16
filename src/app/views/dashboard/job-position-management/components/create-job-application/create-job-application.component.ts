import { Component, inject, Input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateFileInput } from '../../../../../validators/file-input.validators';
import axios from 'axios';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { JobService } from '../../../../../services/job.service';
import { CreateJobApplicationDto } from '../../../../../services/interfaces/job.dto';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';

@Component({
  selector: 'app-create-job-application',
  standalone: true,
  imports: [ButtonModule, DialogModule, CustomInputComponent],
  templateUrl: './create-job-application.component.html',
})
export class CreateJobApplicationComponent {
  private jobService = inject(JobService);
  @Input() visible = signal(true);
  @Input() jobPositionId!: string;
  person = getPersonLocalStorage();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        mimeTypeFile: ['application/pdf', Validators.required],
        file: [null],
      },
      {
        validators: validateFileInput,
      },
    );
  }

  createJobApplicationMutation = injectMutation(() => ({
    mutationFn: async (mimeTypeFile?: string) =>
      await this.jobService.createJobApplication({
        jobPositionId: this.jobPositionId,
        mimeTypeFile: mimeTypeFile,
        candidateId: this.person.candidateId,
      }),
  }));

  async submit() {
    let blob: Blob | null = null;

    if (this.form.value.file) {
      blob = new Blob([this.form.value.file], { type: this.form.value.mimeTypeFile });
    }

    if (this.form.invalid) {
      return;
    }

    const response = await this.createJobApplicationMutation.mutateAsync(
      this.form.value?.mimeTypeFile ?? null,
    );

    if (blob) {
      await axios.put(response.cv, blob, {
        headers: {
          'Content-Type': this.form.value.mimeTypeFile,
        },
      });
    }
  }
}
