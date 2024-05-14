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
}

export interface Address {
  id: string;
  street: string;
  numberHouse: string;
  country: Country;
  department: Department;
  municipality: Municipality;
}

interface Country {
  id: string;
  name: string;
  areaCode: string;
}

interface Department {
  id: string;
  name: string;
}

interface Municipality {
  id: string;
  name: string;
  departmentId: string;
}
