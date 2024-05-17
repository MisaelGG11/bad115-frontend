export interface CreateLaborExperience {
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
