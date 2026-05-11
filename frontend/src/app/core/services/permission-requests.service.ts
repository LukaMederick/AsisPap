import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class PermissionRequestsService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('permission-requests');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('permission-requests', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('permission-requests', id, payload);
  }

  remove(id: string) {
    return this.api.remove('permission-requests', id);
  }
}
