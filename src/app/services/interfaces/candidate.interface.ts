export interface CreateLaborExperienceDto {
  name: string;
  organizationName: string;
  initDate: Date;
  finishDate: Date;
  functionPerformed: string;
  currentJob: boolean;
  organizationContact: {
    phone: string;
    email: string;
  };
}

export interface UpdateLaborExperienceDto extends Partial<CreateLaborExperienceDto> {}

export interface CreateCertificationDto {
  name: string;
  organizationName: string;
  type: string;
  code: string;
  initDate: Date;
  finishDate: Date;
}
