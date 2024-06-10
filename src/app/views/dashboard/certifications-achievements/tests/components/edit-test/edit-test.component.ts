import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { CandidateService } from '../../../../../../services/candidate.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestType } from '../../../../../../interfaces/candidate.interface';
import { UpdateTestDto } from '../../../../../../services/interfaces/candidate.dto';
import { toast } from 'ngx-sonner';
import { getPersonLocalStorage } from '../../../../../../utils/local-storage.utils';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CustomInputComponent } from '../../../../../../components/inputs/custom-input/custom-input.component';
import { SelectComponent } from '../../../../../../components/inputs/select/select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { validateFileInput } from '../../../../../../validators/file-input.validators';
import axios from 'axios';

@Component({
  selector: 'app-edit-test',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    CustomInputComponent,
    SelectComponent,
  ],
  templateUrl: './edit-test.component.html',
  styles: ``,
})
export class EditTestComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() testId = '';
  form: FormGroup;
  testsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      testTypeId: ['', Validators.required],
      result: ['', Validators.required],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['testId'] && !changes['testId'].isFirstChange()) {
      await this.testsTypesRequest.refetch();
      const { data } = await this.testRequest.refetch();
      this.form.patchValue({
        testTypeId: data?.testType.id,
        result: data?.result,
      });
    }
  }

  testsTypesRequest = injectQuery(() => ({
    queryKey: ['testType'],
    queryFn: async () => {
      const data = await this.candidateService.getTestTypes();
      this.addTestsTypesOptions(data);
      return data;
    },
  }));

  addTestsTypesOptions(types: TestType[]) {
    this.testsTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  testRequest = injectQuery(() => ({
    queryKey: [
      'tests',
      {
        candidateId: this.person.candidateId,
        testId: this.testId,
      },
    ],
    queryFn: async () => await this.candidateService.getTest(this.person.candidateId, this.testId),
    enabled: !!this.testId,
  }));

  editTestMutation = injectMutation(() => ({
    mutationFn: async (input: UpdateTestDto) =>
      await this.candidateService.updateTest(this.person.candidateId, this.testId, input),
    onSuccess: async () => {
      toast.success('Prueba actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    await this.editTestMutation.mutateAsync(this.form.value);
  }
}
