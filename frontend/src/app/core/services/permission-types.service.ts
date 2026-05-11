import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class PermissionTypesService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('permission-types');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('permission-types', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('permission-types', id, payload);
  }

  remove(id: string) {
    return this.api.remove('permission-types', id);
  }
}
