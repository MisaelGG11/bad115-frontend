import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { getPersonLocalStorage } from '../../../../../utils/local-storage.utils';
import { privacySettingsDto } from '../../../../../services/interfaces/person.dto';
import { PersonService } from '../../../../../services/person.service';
import { PrivacySettings } from '../../../../../interfaces/person.interface';

@Component({
  selector: 'app-privacy-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleButtonModule, ButtonModule],
  templateUrl: './privacy-settings.component.html',
  styles: `
    :host ::ng-deep .p-button-icon-left {
      color: white;
    }
  `,
})
export class PrivacySettingsComponent {
  queryClient = injectQueryClient();
  personService = inject(PersonService);
  person = getPersonLocalStorage();
  form: FormGroup;

  formFields = [
    { label: 'Dirección', controlName: 'address' },
    { label: 'Documentos', controlName: 'documents' },
    { label: 'Redes Sociales', controlName: 'socialNetwork' },
    { label: 'Experiencia Laboral', controlName: 'laboralExperiences' },
    { label: 'Educación', controlName: 'academicKnowledges' },
    { label: 'Certificaciones', controlName: 'certifications' },
    { label: 'Habilidades Técnicas', controlName: 'technicalSkills' },
    { label: 'Habilidades de idiomas', controlName: 'languageSkills' },
    { label: 'Reconocimientos', controlName: 'recognitions' },
    { label: 'Publicaciones', controlName: 'publications' },
    { label: 'Participaciones', controlName: 'participations' },
    { label: 'Pruebas', controlName: 'tests' },
    { label: 'Recomendaciones', controlName: 'recomendations' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      address: [false],
      documents: [false],
      socialNetwork: [false],
      laboralExperiences: [false],
      academicKnowledges: [false],
      certifications: [false],
      technicalSkills: [false],
      languageSkills: [false],
      recognitions: [false],
      publications: [false],
      participations: [false],
      tests: [false],
      recomendations: [false],
    });
  }

  async ngOnInit() {
    await this.privacySettingsRequest.refetch();
  }

  updatePrivacySettingsMutation = injectMutation(() => ({
    mutationFn: async (privacySettingsDto: privacySettingsDto) =>
      await this.personService.updatePrivacySettings(
        this.person?.candidateId,
        this.person?.privacySettingsId,
        privacySettingsDto,
      ),
    onSuccess: async () => {
      toast.success('Configuración de perfil actualizada', { duration: 3000 });
      await this.queryClient.invalidateQueries({ queryKey: ['privacy-settings'] });
    },
  }));

  privacySettingsRequest = injectQuery(() => ({
    queryKey: ['privacy-settings', { personId: this.person?.id }],
    queryFn: async (): Promise<PrivacySettings> => {
      const settings = await this.personService.getPrivacySettings(
        this.person?.candidateId,
        this.person?.privacySettingsId,
      );
      this.form.patchValue({ ...settings });
      return settings;
    },
  }));

  async onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      await this.updatePrivacySettingsMutation.mutateAsync(this.form.value);
    }
  }
}
