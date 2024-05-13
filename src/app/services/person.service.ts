import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { Person } from '../interfaces/person';
import { PaginatedResponse } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor() {}

  async getPeople(): Promise<PaginatedResponse<Person>> {
    const response = await network.post<PaginatedResponse<Person>>('/persons');

    return response.data;
  }

  async getPerson(personId: string) {
    return await network.get<Person>(`/persons/${personId}`);
  }
}
