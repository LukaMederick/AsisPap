import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('roles');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('roles', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('roles', id, payload);
  }

  remove(id: string) {
    return this.api.remove('roles', id);
  }
}
