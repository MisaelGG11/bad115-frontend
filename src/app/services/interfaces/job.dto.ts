export interface CreateJobPositionDto {
  name: string;
  salaryRange: string;
  modality: string;
  description: string;
  contractType: string;
  experiencesLevel: string;
  workday: string;
  companyId: string;
  closeTime: string;
  address: AddressDto;
  requirements: RequirementDto[];
  languageSkills: LanguageSkillDto[];
  technicalSkills: TechnicalSkillDto[];
}

export interface CreateJobApplicationDto {
  jobPositionId: string;
  candidateId: string;
  mimeTypeFile?: string;
}

export interface JobApplication {
  id: string;
  cv: string;
  status: string;
  recomendation?: string;
  jobPositionId: string;
  candidateId: string;
}

export interface AddressDto {
  street: string;
  numberHouse: string;
  countryId: string;
  countryName: string;
  departmentId: string;
  municipalityId: string;
}

export interface RequirementDto {
  description: string;
}

export interface LanguageSkillDto {
  skill: string;
  level: string;
  languageId: string;
}

export interface TechnicalSkillDto {
  technicalSkillId: string;
}
