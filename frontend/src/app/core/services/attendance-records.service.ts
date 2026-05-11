import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class AttendanceRecordsService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('attendance-records');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('attendance-records', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('attendance-records', id, payload);
  }

  remove(id: string) {
    return this.api.remove('attendance-records', id);
  }
}
