import { Injectable } from '@angular/core';
import network, { axiosConfiguration } from '../config/network.service';
import { Person } from '../interfaces/person';
import { PaginatedResponse } from '../interfaces/pagination';
import { UpdatePersonDto } from './interfaces/person.interface';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private axiosInstance = axios.create(axiosConfiguration);

  constructor() {}

  async getPeople(): Promise<PaginatedResponse<Person>> {
    const response = await network.post<PaginatedResponse<Person>>('/persons');

    return response.data;
  }

  async getPerson(personId: string) {
    return this.axiosInstance.get<Person>(`/persons/${personId}`);
  }

  async update(person: UpdatePersonDto) {
    return this.axiosInstance.put<Person>(`/persons/${person.id}`, person);
  }
}
