import { Company } from './company.interface';

export interface Person {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastName: string;
  birthday: string;
  candidateId: string;
  recruiterId: string;
  userId: string;
  gender: 'F' | 'M';
  phone: string | null;
  address: Address | null;
  user: User;
  documents: Document[] | null;
  privacySettingsId: string;
}

export interface User {
  id: string;
  email: string;
  avatar: string;
}

export interface UserWithPerson extends User {
  person: Person;
}

export interface UserWithCompany extends User {
  company: Company;
}

export interface Address {
  id: string;
  street: string;
  numberHouse: string;
  country: Country;
  department: Department;
  municipality: Municipality;
}

export interface Country {
  id: string;
  name: string;
  areaCode: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Municipality {
  id: string;
  name: string;
  departmentId: string;
}

export interface Document {
  id: string;
  type: DocumentType;
  number: string;
}

export enum DocumentTypeEnum {
  DUI = 'DUI',
  NIT = 'NIT',
  PASSPORT = 'PASSPORT',
  NUP = 'NUP',
}

export type DocumentType = (typeof DocumentTypeEnum)[keyof typeof DocumentTypeEnum];

export interface SocialMedia {
  id: string;
  nickname: string;
  url: string;
  personId: string;
  typeSocialNetwork: SocialMediaType;
}

export interface SocialMediaType {
  id: string;
  name: string;
}

export interface UnlockRequest {
  id: string;
  user: UserWithPerson;
  status: string;
  reason: string | null;
}

export interface Recruiter extends Person {
  user: UserWithCompany;
}

export interface CandidatePerson extends Person {
  user: User;
  socialNetwork: SocialMedia[];
}

export interface Candidate {
  id: string;
  person: CandidatePerson;
}

export interface PrivacySettings {
  id: string;
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
