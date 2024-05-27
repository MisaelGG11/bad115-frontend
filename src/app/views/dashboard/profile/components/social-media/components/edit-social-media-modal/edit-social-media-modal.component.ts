import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CustomInputComponent } from '../../../../../../../components/inputs/custom-input/custom-input.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQueryClient,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { PersonService } from '../../../../../../../services/person.service';
import { UpdateSocialMediaDto } from '../../../../../../../services/interfaces/person.dto';
import { SocialMediaType } from '../../../../../../../interfaces/person.interface';
import { toast } from 'ngx-sonner';
import { StyleClassModule } from 'primeng/styleclass';
import { SelectComponent } from '../../../../../../../components/inputs/select/select.component';

@Component({
  selector: 'app-edit-social-media-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CalendarModule,
    CustomInputComponent,
    InputTextareaModule,
    CommonModule,
    StyleClassModule,
    SelectComponent,
  ],
  templateUrl: './edit-social-media-modal.component.html',
  styles: ``,
})
export class EditSocialMediaModalComponent {
  private personService = inject(PersonService);
  private person = JSON.parse(localStorage.getItem('person') ?? '');
  private queryClient = injectQueryClient();
  @Input() visible = signal(false);
  @Input() socialMediaId = '';
  form: FormGroup;
  socialMediaTypesOptions: Array<{ label: string; value: string | { name: string } }> = [];
  today = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nickname: ['', [Validators.required]],
      typeSocialNetworkId: ['', [Validators.required]],
      url: ['', [Validators.required]],
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['socialMediaId'] && !changes['socialMediaId'].isFirstChange()) {
      await this.socialMediaTypesRequest.refetch();
      const { data } = await this.socialMediaRequest.refetch();
      this.form.patchValue({
        ...data,
        typeSocialNetworkId: data?.typeSocialNetwork.id,
      });
      console.log(this.form.value);
    }
  }

  socialMediaRequest = injectQuery(() => ({
    queryKey: [
      'socialMedia',
      {
        personId: this.person.id,
        socialMediaId: this.socialMediaId,
      },
    ],
    queryFn: async () =>
      await this.personService.getSocialMedia(this.person.id, this.socialMediaId),
    enabled: !!this.socialMediaId,
  }));

  socialMediaTypesRequest = injectQuery(() => ({
    queryKey: ['socialMediaType'],
    queryFn: async () => {
      const data = await this.personService.geSocialMediaTypes();
      this.addSocialMediaTypesOptions(data);
      return data;
    },
  }));

  addSocialMediaTypesOptions(types: SocialMediaType[]) {
    this.socialMediaTypesOptions = types.map((type) => ({
      label: type.name,
      value: type.id,
    }));
  }

  editSocialMediaMutation = injectMutation(() => ({
    mutationFn: async (updateSocialMediaDto: UpdateSocialMediaDto) =>
      await this.personService.updateSocialMedia(
        this.person.id,
        this.socialMediaId,
        updateSocialMediaDto,
      ),
    onSuccess: async () => {
      toast.success('Red social actualizada', { duration: 3000 });
      this.visible.set(false);
      await this.queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
      this.form.reset();
    },
  }));

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    await this.editSocialMediaMutation.mutateAsync(this.form.value);
  }

  getFormControl(name: string) {
    return this.form.get(name) as FormControl;
  }
}
