import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { JobService } from '../../../../../../../services/job.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Requirement } from '../../../../../../../interfaces/job.interface';
import { RequirementDto } from '../../../../../../../services/interfaces/job.dto';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-requirements',
  standalone: true,
  imports: [DialogModule, ButtonModule, CustomInputComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-requirements.component.html',
  styles: ``,
})
export class EditRequirementsComponent {
  private jobService = inject(JobService);
  @Input() visible = signal(false);
  @Input() jobPositionId: string = '';
  @Input() jobPositionRequirements: Requirement[] = [];
  form: FormGroup;
  queryClient = injectQueryClient();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      requirements: this.fb.array([]),
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobPositionRequirements']) {
      console.log(this.jobPositionRequirements);
      this.form.setControl('requirements', this.fb.array([]));
      this.jobPositionRequirements.forEach((req: Requirement) => {
        const requirementFormGroup = this.fb.group({
          description: [req.description, Validators.required],
        });
        this.requirements.push(requirementFormGroup);
      });
    }
  }

  get requirements(): FormArray {
    return this.form.get('requirements') as FormArray;
  }

  addRequirement(event: Event) {
    const requirementFormGroup = this.fb.group({
      description: ['', Validators.required],
    });
    this.requirements.push(requirementFormGroup);
    event.preventDefault();
  }

  removeRequirement(event: Event, index: number) {
    this.requirements.removeAt(index);
    event.preventDefault();
  }

  editJobPositionRequirementsMutation = injectMutation(() => ({
    mutationFn: async (input: RequirementDto) =>
      await this.jobService.updateRequirements(this.jobPositionId, input),
    onSuccess: async () => {
      toast.success('Habilidades técnicas actualizadas', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['job-positions'] });
      this.form.reset();
    },
  }));

  submit() {
    this.form.markAllAsTouched();

    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    this.editJobPositionRequirementsMutation.mutateAsync(this.form.value);
  }
}
