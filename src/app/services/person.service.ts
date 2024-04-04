import { Injectable } from '@angular/core';
import network from '../config/network.service'

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor() { }

  async getPeople() {
    return await network.post('/persons')
  }

  async getPerson(personId: string) {
    return await network.get(`/persons/${personId}`)
  }
}
