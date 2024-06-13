import { Candidate, User, UserWithPerson } from './person.interface';

export interface LaboralExperience {
  id: string;
  candidateId: string;
  name: string;
  organizationName: string;
  initDate: Date;
  finishDate: Date;
  currentJob: boolean;
  functionPerformed: string;
  organizationContact: OrganizationContact;
}

export interface OrganizationContact {
  id: string;
  phone: string;
  email: string;
}

export interface Certification {
  id: string;
  name: string;
  organizationName: string;
  type: string;
  code: string;
  initDate: Date;
  finishDate: Date;
}

export interface Recognition {
  id: string;
  name: string;
  finishDate: Date;
  candidateId: string;
  recognitionType: RecognitionType;
}

export interface RecognitionType {
  id: string;
  name: string;
}

export interface Publication {
  id: string;
  name: string;
  place: string;
  type: string;
  candidateId: string;
  edition: string;
  isbn: string;
}

export interface Participation {
  id: string;
  date: Date;
  place: string;
  country: string;
  eventHost: string;
  candidateId: string;
  participationType: ParticipationType;
}
export interface ParticipationType {
  id: string;
  name: string;
}

export interface Test {
  id: string;
  result: string;
  urlDocs: string;
  candidateId: string;
  testType: TestType;
}

export interface TestType {
  id: string;
  name: string;
}

export interface AcademicKnowledge {
  id: string;
  candidateId: string;
  name: string;
  type: string;
  initDate: Date;
  finishDate: Date;
  organizationName: string;
}

export interface Recommendation {
  id: string;
  candidateId: string;
  recomendation: string;
  type: string;
  users: UserWithPerson[];
}

export interface CandidateDetails extends Candidate {
  id: string;
  academicKnowledges: AcademicKnowledge[];
  laboralExperiences: LaboralExperience[];
  certifications: Certification[];
  technicalSkills: any[];
  languageSkills: any[];
  recognitions: Recognition[];
  publications: Publication[];
  participations: Participation[];
  tests: Test[];
  recomendations: Recommendation[];
}

//LanguageSkill
export interface LanguageSkill {
  id: string;
  candidateId: string;
  skill: string;
  level: string;
  language:LanguageSkillType;
}

export interface LanguageSkillType {
  id: string;
  language: string;
}

//TechnicalSkills
export interface TechnicalSkills {
  id: string;
  candidateId: string;
  technicalSkill: TechnicalSkillType;
}

export interface TechnicalSkillType {
  id: string;
  name: string;
 categoryTecnicalSkillId:TechnicalCategoryTypes;
}

export interface TechnicalType {
  id: string;
  name: string;
}
export interface TechnicalCategoryTypes {
  id: string;
  name: string;
}

