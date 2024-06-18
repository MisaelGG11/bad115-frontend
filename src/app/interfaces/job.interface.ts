import { Company } from './company.interface';
import { Address, Person } from './person.interface';

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

export interface JobApplicationCandidate {
  id: string;
  status: string;
  cv: string;
  percentage: number;
  recomendation: string;
  jobPosition: JobPosition;
  candidate: {
    id: string;
    person: Person;
  };
  meeting: Meeting[];
  createdAt: string;
}

export interface JobApplicationJobPosition extends JobApplicationCandidate {
  jobPosition: JobPosition;
}

export interface Meeting {
  id: string;
  link: string;
  executionDate: string;
  jobApplicationId: string;
}
