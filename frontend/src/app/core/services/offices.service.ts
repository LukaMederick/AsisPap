import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class OfficesService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('offices');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('offices', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('offices', id, payload);
  }

  remove(id: string) {
    return this.api.remove('offices', id);
  }
}
