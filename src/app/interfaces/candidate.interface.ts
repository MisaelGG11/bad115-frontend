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

export interface AcademicKnowledge {
  id: string;
  candidateId: string;
  name: string;
  type: string;
  initDate: Date;
  finishDate: Date;
  organizationName: string;
}
