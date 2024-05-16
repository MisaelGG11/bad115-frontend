import { Injectable } from '@angular/core';
import network from '../config/network.service';
import { Person } from '../interfaces/person.interface';
import { PaginatedResponse } from '../interfaces/pagination.interface';
import { CreateAddressDto, UpdatePersonDto } from './interfaces/person.interface';

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
    return network.get<Person>(`/persons/${personId}`);
  }

  async update(updatePersonDto: UpdatePersonDto) {
    return network.put<Person>(`/persons/${updatePersonDto.id}`, updatePersonDto);
  }

  async addAddress(personId: string, createAddressDto: CreateAddressDto) {
    return network.post(`/persons/${personId}/addresses`, createAddressDto);
  }
}
