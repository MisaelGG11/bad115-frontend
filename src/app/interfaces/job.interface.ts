import { Company } from './company.interface';
import { Address } from './person.interface';

export interface Category {
  id: string;
  name: string;
}

export interface TechnicalSkill {
  id: string;
  name: string;
}

export interface LanguageSkill {
  id: string;
  skill: string;
  level: string;
  candidateId: string;
  language: Language;
}

export interface Language {
  id: string;
  language: string;
}

export interface Requirement {
  id: string;
  description: string;
}

export interface JobPosition {
  id: string;
  name: string;
  salaryRange: string;
  modality: string;
  description: string;
  experiencesLevel: string;
  contractType: string;
  status: string;
  closeTime: string;
  workday: string;
  jobApplicationCount: number;
  company: Company;
  address: Address;
  technicalSkills: TechnicalSkill[];
  languageSkills: LanguageSkill[];
  requirements: Requirement[];
  createdAt: string;
}
