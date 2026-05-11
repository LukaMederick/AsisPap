import { environment } from '../../../environments/environment';

const DEFAULT_HEADERS: Record<string, string> = {
  apikey: environment.supabaseAnonKey,
  Authorization: `Bearer ${environment.supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

export async function supabaseSelect<T>(
  table: string,
  select = '*',
): Promise<T[]> {
  const url = `${environment.supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`;
  const response = await fetch(url, { headers: DEFAULT_HEADERS });

  if (!response.ok) {
    throw new Error(`Supabase error (${response.status}): ${await response.text()}`);
  }

  return (await response.json()) as T[];
}
