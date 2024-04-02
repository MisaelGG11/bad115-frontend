import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';

import { sessionReducer } from './session.reducer';

export const reducers: ActionReducerMap<any> = {
  session: sessionReducer,
};

export const metaReducers: MetaReducer<any>[] = !isDevMode() ? [] : [];