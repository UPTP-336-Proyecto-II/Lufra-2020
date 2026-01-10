-- ══════════════════════════════════════════════════════════════
-- SISTEMA DE ROLES Y CUENTAS PARA GESTIÓN DE NÓMINAS
-- ══════════════════════════════════════════════════════════════
-- Ejecutar: php artisan db:seed --class=RolesPermisosCompletos

BEGIN TRANSACTION;

-- Limpiar datos existentes
DELETE FROM permiso_rol;
DELETE FROM rol_usuario WHERE rol_id NOT IN (SELECT id FROM roles WHERE nombre IN ('administrador', 'empleado'));
DELETE FROM permisos WHERE nombre NOT IN ('ver_empleados', 'gestionar_empleados');
DELETE FROM roles WHERE nombre NOT IN ('administrador', 'empleado');

-- CREAR ROLES
INSERT INTO roles (nombre, descripcion, created_at, updated_at) VALUES
('super_admin', 'Super Administrador - Acceso total al sistema', datetime('now'), datetime('now')),
('admin_nominas', 'Administrador de Nóminas - Gestiona nóminas y pagos', datetime('now'), datetime('now')),
('admin_rrhh', 'Administrador de RRHH - Gestiona empleados y contratos', datetime('now'), datetime('now')),
('contador', 'Contador - Revisa y aprueba nóminas', datetime('now'), datetime('now')),
('supervisor', 'Supervisor - Gestiona su departamento', datetime('now'), datetime('now'));

-- CREAR PERMISOS (manteniendo los existentes)
INSERT INTO permisos (nombre, descripcion, created_at, updated_at) VALUES
-- Gestión de Usuarios
('ver_usuarios', 'Ver lista de usuarios', datetime('now'), datetime('now')),
('crear_usuarios', 'Crear nuevos usuarios', datetime('now'), datetime('now')),
('editar_usuarios', 'Editar usuarios existentes', datetime('now'), datetime('now')),
('eliminar_usuarios', 'Eliminar usuarios', datetime('now'), datetime('now')),

-- Gestión de Departamentos
('ver_departamentos', 'Ver departamentos', datetime('now'), datetime('now')),
('crear_departamentos', 'Crear departamentos', datetime('now'), datetime('now')),
('editar_departamentos', 'Editar departamentos', datetime('now'), datetime('now')),
('eliminar_departamentos', 'Eliminar departamentos', datetime('now'), datetime('now')),

-- Gestión de Contratos
('ver_contratos', 'Ver contratos', datetime('now'), datetime('now')),
('crear_contratos', 'Crear contratos', datetime('now'), datetime('now')),
('editar_contratos', 'Editar contratos', datetime('now'), datetime('now')),
('eliminar_contratos', 'Eliminar contratos', datetime('now'), datetime('now')),

-- Gestión de Nóminas
('ver_nominas', 'Ver nóminas', datetime('now'), datetime('now')),
('crear_nominas', 'Crear periodos de nómina', datetime('now'), datetime('now')),
('procesar_nominas', 'Procesar nóminas', datetime('now'), datetime('now')),
('aprobar_nominas', 'Aprobar nóminas', datetime('now'), datetime('now')),
('cerrar_nominas', 'Cerrar periodos de nómina', datetime('now'), datetime('now')),

-- Gestión de Pagos
('ver_pagos', 'Ver registros de pagos', datetime('now'), datetime('now')),
('registrar_pagos', 'Registrar pagos', datetime('now'), datetime('now')),
('aprobar_pagos', 'Aprobar pagos', datetime('now'), datetime('now')),

-- Reportes
('ver_reportes', 'Ver reportes', datetime('now'), datetime('now')),
('exportar_reportes', 'Exportar reportes', datetime('now'), datetime('now')),

-- Configuración
('ver_configuracion', 'Ver configuración del sistema', datetime('now'), datetime('now')),
('editar_configuracion', 'Editar configuración', datetime('now'), datetime('now')),

-- Acceso Propio
('ver_mi_informacion', 'Ver mi propia información', datetime('now'), datetime('now')),
('ver_mis_recibos', 'Ver mis recibos de nómina', datetime('now'), datetime('now'));

COMMIT;

-- Mostrar resultados
SELECT 'ROLES CREADOS:' as info;
SELECT id, nombre, descripcion FROM roles ORDER BY id;

SELECT '';
SELECT 'PERMISOS CREADOS:' as info;
SELECT COUNT(*) as total FROM permisos;

SELECT '';
SELECT 'Para asignar permisos y crear usuarios, ejecuta:' as instruccion;
SELECT 'php artisan db:seed --class=RolesPermisosCompletos' as comando;
