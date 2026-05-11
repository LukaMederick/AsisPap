import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly baseUrl: string;
  private readonly serviceRoleKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('SUPABASE_URL', '');
    this.serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY', '');
  }

  async select<T>(table: string, select = '*'): Promise<T[]> {
    const url = `${this.baseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
    const response = await fetch(url, {
      headers: {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase error (${response.status}): ${await response.text()}`);
    }

    return (await response.json()) as T[];
  }
}
