import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { JobService } from '../../../../../../../services/job.service';
import { TechnicalSkill } from '../../../../../../../interfaces/technical-skill.interface';
import { TechnicalSkillDto } from '../../../../../../../services/interfaces/job.dto';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-technical-skills',
  standalone: true,
  imports: [DialogModule, ButtonModule, SelectComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-technical-skills.component.html',
  styles: ``,
})
export class EditTechnicalSkillsComponent {
  private jobService = inject(JobService);
  @Input() visible = signal(false);
  @Input() jobPositionId: string = '';
  @Input() jobPositionTechnicalSkills: any = [];
  form: FormGroup;
  technicalSkillsOptions: Array<{ label: string; value: any }> = [];
  queryClient = injectQueryClient();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      technicalSkills: this.fb.array([]),
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['jobPositionTechnicalSkills']) {
      console.log(this.jobPositionTechnicalSkills);
      this.form.setControl('technicalSkills', this.fb.array([]));
      this.jobPositionTechnicalSkills.forEach((tech: any) => {
        const technicalSkillFormGroup = this.fb.group({
          technicalSkillId: [tech.technicalSkill.id, Validators.required],
        });
        this.technicalSkills.push(technicalSkillFormGroup);
      });
    }
  }

  technicalSkillsRequest = injectQuery(() => ({
    queryKey: ['technical-skills'],
    queryFn: async () => {
      const { data } = await this.jobService.getTechnicalSkills();
      this.addTechnicalSkills(data);
      return data;
    },
  }));

  addTechnicalSkills(techincialSkills: TechnicalSkill[]) {
    this.technicalSkillsOptions = techincialSkills.map((techincialSkill: TechnicalSkill) => ({
      label: techincialSkill.name,
      value: techincialSkill.id,
    }));
  }

  get technicalSkills(): FormArray {
    return this.form.get('technicalSkills') as FormArray;
  }

  addTechnicalSkill(event: Event) {
    const technicalSkillFormGroup = this.fb.group({
      technicalSkillId: ['', Validators.required],
    });
    this.technicalSkills.push(technicalSkillFormGroup);
    event.preventDefault();
  }

  removeTechnicalSkill(event: Event, index: number) {
    this.technicalSkills.removeAt(index);
    event.preventDefault();
  }

  editJobPositionTechnicalSkillsMutation = injectMutation(() => ({
    mutationFn: async (input: TechnicalSkillDto) =>
      await this.jobService.updateTechnicalSkills(this.jobPositionId, input),
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
    this.editJobPositionTechnicalSkillsMutation.mutateAsync(this.form.value);
  }
}
