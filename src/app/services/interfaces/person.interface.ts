import { Person } from '../../interfaces/person';

export interface UpdatePersonDto extends Partial<Person> {
  id: string;
}
