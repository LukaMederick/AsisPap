import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = `${environment.apiUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  list<T>(resource: string) {
    return this.http.get<T[]>(`${this.baseUrl}/${resource}`);
  }

  create<T>(resource: string, payload: Record<string, unknown>) {
    return this.http.post<T>(`${this.baseUrl}/${resource}`, payload);
  }

  update<T>(resource: string, id: string, payload: Record<string, unknown>) {
    return this.http.patch<T>(`${this.baseUrl}/${resource}/${id}`, payload);
  }

  remove(resource: string, id: string) {
    return this.http.delete(`${this.baseUrl}/${resource}/${id}`);
  }
}
