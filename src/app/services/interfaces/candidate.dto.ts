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
  recognitionTypeId: string;
}

export interface UpdateRecognitionDto extends Partial<CreateRecognitionDto> {}

export interface CreatePublicationDto {
  name: string;
  place: string;
  type: string;
  candidateId: string;
  edition: string;
  isbn: string;
}

export interface UpdatePublicationDto extends Partial<CreatePublicationDto> {}

export interface CreateParticipationDto {
  date: Date;
  place: string;
  country: string;
  eventHost: string;
  participationTypeId: string;
}

export interface UpdateParticipationDto extends Partial<CreateParticipationDto> {}

export interface CreateTestDto {
  result: string;
  mimeTypeFile: string;
  testTypeId: string;
}

export interface UpdateTestDto extends Partial<CreateTestDto> {}

export interface CreateAcademicKnowledgeDto {
  name: string;
  type: string;
  initDate: Date;
  finishDate: Date;
  organizationName: string;
}

export interface UpdateAcademicKnowledgeDto extends Partial<CreateAcademicKnowledgeDto> {}

export interface CreateRecommendationDto {
  type: string;
  recommendation: string;
}

export interface UpdateRecommendationDto extends Partial<CreateRecommendationDto> {}

export interface CreateLanguageSkillDto {
  skill: string;
  level: string;
  languageTypeId: string;
}

export interface UpdateLanguageSkillDto extends Partial<CreateLanguageSkillDto> {}

export interface CreateTechnicalSkillDto {
  technicalSkill: string;
  technicalSkillTypeId: string;
}

export interface UpdateTechnicalSkillsDto extends Partial<CreateTechnicalSkillDto> {}
