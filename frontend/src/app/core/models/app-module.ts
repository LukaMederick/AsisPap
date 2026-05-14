/** Coincide con `permissions.moduleName` en BD (slugs de menú / rutas). */
export type AppModule = 'dashboard' | 'attendance' | 'permissions' | 'directory';

export interface AuthRoleDto {
  id: string;
  name: string;
}

export interface UserAccessDto {
  userId: string;
  dni: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: AuthRoleDto[];
  modules: string[];
}

export interface AuthSession extends UserAccessDto {}
