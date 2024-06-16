import { Component, inject, Input, signal } from '@angular/core';
import { CandidateService } from '../../../../../../services/candidate.service';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestType } from '../../../../../../interfaces/candidate.interface';
import { CreateTestDto } from '../../../../../../services/interfaces/candidate.dto';
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
  selector: 'app-create-test',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    CustomInputComponent,
    SelectComponent,
  ],
  templateUrl: './create-test.component.html',
  styles: ``,
})
export class CreateTestComponent {
  private candidateService = inject(CandidateService);
  private person = getPersonLocalStorage();
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  form: FormGroup;
  testsTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        testTypeId: ['', Validators.required],
        mimeTypeFile: ['application/pdf', Validators.required],
        result: ['', Validators.required],
        file: [null, Validators.required],
      },
      {
        validators: validateFileInput,
      },
    );
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

  createTestMutation = injectMutation(() => ({
    mutationFn: async (input: CreateTestDto) =>
      await this.candidateService.createTest(this.person.candidateId, input),
    onSuccess: async () => {
      toast.success('Prueba creada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['tests'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();

    const blob = new Blob([this.form.value.file], { type: this.form.value.mimeTypeFile });

    if (this.form.invalid) {
      return;
    }
    const test = await this.createTestMutation.mutateAsync(this.form.value);

    await axios.put(test.urlDocs, blob, {
      headers: {
        'Content-Type': this.form.value.mimeTypeFile,
      },
    });
  }
}
