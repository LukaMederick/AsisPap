import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('schedules');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('schedules', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('schedules', id, payload);
  }

  remove(id: string) {
    return this.api.remove('schedules', id);
  }
}
