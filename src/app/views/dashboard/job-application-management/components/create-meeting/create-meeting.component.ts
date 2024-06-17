import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { JobService } from '../../../../../services/job.service';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../../../../../components/inputs/custom-input/custom-input.component';
import { CalendarComponent } from '../../../../../components/inputs/calendar/calendar.component';
import { validateMeetingTime } from '../../../../../validators/meeting-time.validators';
import { CreateMeetingDto } from '../../../../../services/interfaces/job.dto';
import { VisualizeJobApplicationComponent } from '../visualize-job-application/visualize-job-application.component';

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CommonModule,
    CustomInputComponent,
    CalendarComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './create-meeting.component.html',
  styles: ``,
})
export class CreateMeetingComponent {
  private jobService = inject(JobService);
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() jobApplicationId: string = '';
  form: FormGroup;
  userService: any;
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        link: ['', Validators.required],
        executionDate: [null, Validators.required],
      },
      {
        validators: [validateMeetingTime],
      },
    );
  }

  createMeetingMutation = injectMutation(() => ({
    mutationFn: async (meeting: CreateMeetingDto) =>
      this.jobService.createMeeting(this.jobApplicationId, meeting),
    onSuccess: async () => {
      toast.success('Reunión creada', { duration: 3000 });
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

    await this.createMeetingMutation.mutateAsync(this.form.value);
    this.visible.set(false);
  }
}
