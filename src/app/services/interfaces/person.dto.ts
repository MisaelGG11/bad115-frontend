import { DocumentType, Person } from '../../interfaces/person.interface';

export interface UpdatePersonDto extends Partial<Person> {
  id: string;
}

export interface CreateAddressDto {
  street: string;
  numberHouse: string;
  countryId: string;
  countryName: string;
  departmentId?: string;
  municipalityId?: string;
}

export interface UpsertDocumentDto {
  id?: string;
  number: string;
  type: DocumentType;
}

export interface SocialMediaType {
  id: string;
  name: string;
}
export interface CreateSocialMediaDto {
  nickname: string;
  url: string;
  typeSocialNetwork: string;
}

export interface UpdateSocialMediaDto extends CreateSocialMediaDto {}

export interface UpdateUnlockRequestDto {
  status: string;
  reason: string;
}

export interface privacySettingsDto {
  address: boolean;
  documents: boolean;
  socialNetwork: boolean;
  laboralExperiences: boolean;
  academicKnowledges: boolean;
  certifications: boolean;
  technicalSkills: boolean;
  languageSkills: boolean;
  recognitions: boolean;
  publications: boolean;
  participations: boolean;
  tests: boolean;
  recomendations: boolean;
}
