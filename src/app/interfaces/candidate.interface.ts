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
  name: string;
}

export interface RecognitionTypeCatalog extends RecognitionType {
  id: string;
}
