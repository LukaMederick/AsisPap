-- Ejecutar en Supabase SQL Editor
-- Requiere que las tablas ya existan (backend Nest levantado con TypeORM synchronize)

BEGIN;

TRUNCATE TABLE
  attendance_records,
  permission_requests,
  user_schedules,
  role_permissions,
  user_roles,
  permissions,
  permission_types,
  schedules,
  users,
  roles,
  offices
RESTART IDENTITY CASCADE;

INSERT INTO offices (id, name, code, description, "parentId", status) VALUES
  (1, 'UNIDAD DE ABASTECIMIENTO, ALMACÉN Y CONTROL PATRIMONIAL', 'OA/UAC', 'Unidad de Abastecimiento', NULL, true),
  (2, 'UNIDAD DE TESORERÍA', 'OA/UT', 'Unidad de Tesorería', NULL, true),
  (3, 'UNIDAD DE CONTABILIDAD', 'OA/UC', 'Unidad de Contabilidad', NULL, true),
  (4, 'UNIDAD DE RECURSOS HUMANOS', 'OA/URH', 'Unidad de Recursos Humanos', NULL, true),
  (5, 'UGEL AVALUCIO', 'DIRECTORES DE UGEL', 'UGEL Avalucio', NULL, true),
  (6, 'CENTRO DE RECURSOS PARA EL APRENDIZAJE - CRAEI', 'CRAEI', 'Centro de Recursos', NULL, true),
  (7, 'DIRECCIÓN DE GESTIÓN INSTITUCIONAL - UNIDAD FORMULADORA', 'DGI-UF', 'Dirección de Gestión Institucional', NULL, true),
  (8, 'DIRECCIÓN DE GESTIÓN PEDAGÓGICA - PROGRAMAS', 'DGP-PROGRAMAS', 'Dirección de Gestión Pedagógica', NULL, true),
  (9, 'ÁREA DE SECRETARÍA GENERAL', 'DR/SG', 'Área de Secretaría General', NULL, true);

INSERT INTO users
  (id, "firstName", "lastName", dni, email, phone, "officeId", gender, "birthDate", status)
VALUES
  (1, 'Layde Adelayda', 'Retamozo CCELLCCARO', '71655268', 'ABCDlEYD@95@GMAIL.COM', '987654321', 4, 'Femenino', '1985-05-15', true),
  (2, 'Hilda Pamela', 'Jaime Tineo', '73327506', 'DANIA146PAME@GMAIL.COM', '987654322', 7, 'Femenino', '1990-08-20', true),
  (3, 'Vilma', 'Quispe Vilca', '40014614', 'qvlima678@gmail.com', '987654323', 6, 'Femenino', '1982-03-10', true),
  (4, 'Honorato Antonio', 'Vega Campos', '09374032', 'AVC_1071@HOTMAIL.COM', '987654324', 2, 'Masculino', '1978-11-25', false),
  (5, 'Martínez Vilca', 'Cristian Smith', '73887998', 'CRISTIANMARTINEZVILCA@GMAIL.COM', '987654325', 7, 'Masculino', '1995-07-03', true),
  (6, 'Edwin', 'Santacruz', '73887999', 'SANTACRUZEDWIN25@GMAIL.COM', '987654326', 8, 'Masculino', '1992-12-12', true);

INSERT INTO roles (id, name, "guardName", status) VALUES
  (1, 'Administrador', 'web', true),
  (2, 'web', 'web', true),
  (3, 'Proyectos', 'web', true),
  (4, 'Proveido', 'web', true),
  (5, 'Responsable Papeletas', 'web', true),
  (6, 'Administrador Alterno De Papeletas', 'web', true),
  (7, 'Asistencia', 'web', true),
  (8, 'Usuarios', 'web', true),
  (9, 'Descanso Medico', 'web', true),
  (10, 'Resoluciones', 'web', true);

INSERT INTO permissions (id, name, "moduleName") VALUES
  (1, 'Ver el listado de registros', 'General'),
  (2, 'Crear', 'General'),
  (3, 'Actualizar', 'General'),
  (4, 'Eliminar un registro en particular', 'General'),
  (5, 'Reordenar', 'General'),
  (20, 'Acceso módulo Dashboard', 'dashboard'),
  (21, 'Acceso módulo Asistencia', 'attendance'),
  (22, 'Acceso módulo Papeletas', 'permissions'),
  (23, 'Acceso módulo Directorio', 'directory');

INSERT INTO schedules (id, name, "startTime", "endTime", status) VALUES
  (1, 'Horario Regular', '08:01:00', '16:00:00', true),
  (2, 'Horario Reducido', '09:00:00', '14:00:00', true),
  (3, 'Horario Extendido', '07:00:00', '17:00:00', false);

INSERT INTO permission_types (id, name, color, icon, status) VALUES
  (1, 'ASUNTOS PARTICULARES', '#2196F3', 'person', true),
  (2, 'ENFERMEDAD/GRAVIDEZ', '#F44336', 'health_and_safety', true),
  (3, 'COMISIÓN DE SERVICIOS', '#4CAF50', 'work', true),
  (4, 'ACTIVIDADES DE LA INSTITUCIÓN', '#FF9800', 'apartment', true),
  (5, 'DOCENCIA UNIVERSITARIA', '#9C27B0', 'school', true),
  (6, 'ESTUDIOS UNIVERSITARIOS SATISFACTORIOS', '#00BCD4', 'menu_book', true),
  (7, 'CAPACITACIÓN OFICIALIZADA', '#795548', 'verified', true),
  (8, 'CAPACITACIÓN NO OFICIALIZADA', '#607D8B', 'pending', true),
  (9, 'CITACIÓN JUDICIAL/FISCAL/MILITAR/POLICIAL', '#E91E63', 'gavel', true),
  (10, 'FUNCIÓN CONSEJERO REGIONAL/EDIL', '#3F51B5', 'how_to_reg', true);

INSERT INTO user_roles ("userId", "roleId") VALUES
  (1, 1),
  (2, 7),
  (3, 7),
  (4, 8),
  (5, 5),
  (6, 6);

INSERT INTO role_permissions ("roleId", "permissionId") VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
  (1, 20), (1, 21), (1, 22), (1, 23),
  (5, 20), (5, 22),
  (6, 20), (6, 22),
  (7, 1), (7, 2), (7, 20), (7, 21),
  (8, 1), (8, 2), (8, 3), (8, 20), (8, 23);

INSERT INTO user_schedules ("userId", "scheduleId", "validFrom", "validTo") VALUES
  (1, 1, '2026-01-01', NULL),
  (2, 1, '2026-01-01', NULL),
  (3, 1, '2026-01-01', NULL),
  (4, 2, '2026-01-01', NULL),
  (5, 1, '2026-01-01', NULL),
  (6, 3, '2026-01-01', NULL);

INSERT INTO permission_requests
  (id, code, "userId", "officeId", "permissionTypeId", "requestDate", "startTime", "endTime", description, status)
VALUES
  (1, '0583-2026', 1, 9, 3, '2026-04-08', '10:56:00', '13:00:00', 'COORDINACIÓN SOBRE SEGURIDAD Y SALUD EN EL TRABAJO EN BIENESTAR SOCIAL', 'Autorizado'),
  (2, '0582-2026', 2, 9, 1, '2026-04-08', '10:28:00', '12:00:00', 'TRAMITES PERSONALES', 'Autorizado'),
  (3, '0581-2026', 3, 8, 2, '2026-04-08', '10:40:00', '11:40:00', 'CITA EN ESSALUD', 'Autorizado'),
  (4, '0580-2026', 4, 7, 3, '2026-04-08', '10:30:00', '11:30:00', 'REUNION DE COORDINACIÓN DE TRABAJO EN EL GORE', 'Pendiente');

INSERT INTO attendance_records
  (id, "userId", "officeId", "markDatetime", "markType", "permissionRequestId")
VALUES
  (1, 1, 9, '2026-03-16 19:42:38', 'Salida', NULL),
  (2, 1, 9, '2026-03-16 19:42:04', 'Entrada', NULL),
  (3, 2, 9, '2026-03-16 19:40:17', 'Salida', NULL),
  (4, 3, 8, '2026-03-05 11:38:00', 'Entrada', NULL),
  (5, 4, 7, '2025-12-31 20:37:15', 'Salida', NULL),
  (6, 1, 9, '2026-04-08 10:56:00', 'Salida de papeleta', 1),
  (7, 1, 9, '2026-04-08 13:00:00', 'Retorno de papeleta', 1);

COMMIT;
