import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly api: ApiService) {}

  list() {
    return this.api.list<any>('users');
  }

  create(payload: Record<string, unknown>) {
    return this.api.create<any>('users', payload);
  }

  update(id: string, payload: Record<string, unknown>) {
    return this.api.update<any>('users', id, payload);
  }

  remove(id: string) {
    return this.api.remove('users', id);
  }
}
