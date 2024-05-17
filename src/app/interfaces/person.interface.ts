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
  address: Address | null;
  user: User;
}

export interface User {
  id: string;
  email: string;
  avatar: string;
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
