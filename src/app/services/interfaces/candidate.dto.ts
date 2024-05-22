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

export interface UpdateCertificationDto extends Partial<CreateCertificationDto> {}

export interface CreateRecognitionDto {
  name: string;
  finishDate: Date;
  recognitionType: {
    name: string;
  };
}

export interface CreatePublicationDto {
  name: string;
  place: string;
  type: string;
  candidateId: string;
  edition: string;
  isbn: string;
}

export interface CreateParticipationDto {
  date: Date;
  place: string;
  country: string;
  eventHost: string;
  participationType: {
    name: string;
  };
}

export interface UpdateParticipationDto extends Partial<CreateParticipationDto> {}

export interface CreateAcademicKnowledgeDto {
  name: string;
  type: string;
  initDate: Date;
  finishDate: Date;
  organizationName: string;
}

export interface UpdateAcademicKnowledgeDto extends Partial<CreateAcademicKnowledgeDto> {}
