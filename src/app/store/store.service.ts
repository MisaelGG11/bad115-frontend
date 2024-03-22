import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})

export class StoreService {
  private readonly _store = new BehaviorSubject<any>(null);
  readonly store$: Observable<any> = this._store.asObservable();

  constructor() {
    this.initStore();
  }

  private initStore() {
    this._store.next({
      user: null,
      accesToken: null,
      login: async () => {},
      logout: () => {},
    });
  }

  updateStore(data: any) {
    this._store.next(data);
  }
}
