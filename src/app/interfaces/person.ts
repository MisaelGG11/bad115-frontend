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
}

export enum GenderEnum {
  M = 'M',
  F = 'F',
}
