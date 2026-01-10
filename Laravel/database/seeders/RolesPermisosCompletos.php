<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RolesPermisosCompletos extends Seeder
{
    /**
     * Crear roles completos para sistema de nóminas
     */
    public function run(): void
    {
        $now = now();
        
        echo "Creando roles del sistema de nóminas...\n";
        
        // 1. CREAR ROLES (solo los que no existen)
        $roles = [
            [
                'nombre' => 'super_admin',
                'descripcion' => 'Super Administrador - Acceso total al sistema',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'nombre' => 'admin_nominas',
                'descripcion' => 'Administrador de Nóminas - Gestiona nóminas y pagos',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'nombre' => 'admin_rrhh',
                'descripcion' => 'Administrador de RRHH - Gestiona empleados y contratos',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'nombre' => 'contador',
                'descripcion' => 'Contador - Revisa y aprueba nóminas',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'nombre' => 'supervisor',
                'descripcion' => 'Supervisor - Gestiona su departamento',
                'created_at' => $now,
                'updated_at' => $now
            ],
        ];

        foreach ($roles as $rol) {
            $existe = DB::table('roles')->where('nombre', $rol['nombre'])->exists();
            if (!$existe) {
                DB::table('roles')->insert($rol);
                echo "✓ Rol creado: {$rol['nombre']}\n";
            } else {
                echo "⚠ Rol ya existe: {$rol['nombre']}\n";
            }
        }
        
        // Asegurar que el rol empleado existe (se crea en otro seeder)
        $empleadoExiste = DB::table('roles')->where('nombre', 'empleado')->exists();
        if (!$empleadoExiste) {
            DB::table('roles')->insert([
                'nombre' => 'empleado',
                'descripcion' => 'Empleado - Acceso básico a su información',
                'created_at' => $now,
                'updated_at' => $now
            ]);
            echo "✓ Rol creado: empleado\n";
        }
        
        echo "✓ Roles verificados\n";

        // 2. CREAR PERMISOS (solo los que no existen)
        $permisos = [
            // Gestión de Usuarios
            ['nombre' => 'ver_usuarios', 'descripcion' => 'Ver lista de usuarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'crear_usuarios', 'descripcion' => 'Crear nuevos usuarios', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'editar_usuarios', 'descripcion' => 'Editar usuarios existentes', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'eliminar_usuarios', 'descripcion' => 'Eliminar usuarios', 'created_at' => $now, 'updated_at' => $now],
            
            // Gestión de Empleados
            ['nombre' => 'ver_empleados', 'descripcion' => 'Ver lista de empleados', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'crear_empleados', 'descripcion' => 'Crear nuevos empleados', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'editar_empleados', 'descripcion' => 'Editar datos de empleados', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'eliminar_empleados', 'descripcion' => 'Eliminar empleados', 'created_at' => $now, 'updated_at' => $now],
            
            // Gestión de Departamentos
            ['nombre' => 'ver_departamentos', 'descripcion' => 'Ver departamentos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'crear_departamentos', 'descripcion' => 'Crear departamentos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'editar_departamentos', 'descripcion' => 'Editar departamentos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'eliminar_departamentos', 'descripcion' => 'Eliminar departamentos', 'created_at' => $now, 'updated_at' => $now],
            
            // Gestión de Contratos
            ['nombre' => 'ver_contratos', 'descripcion' => 'Ver contratos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'crear_contratos', 'descripcion' => 'Crear contratos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'editar_contratos', 'descripcion' => 'Editar contratos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'eliminar_contratos', 'descripcion' => 'Eliminar contratos', 'created_at' => $now, 'updated_at' => $now],
            
            // Gestión de Nóminas
            ['nombre' => 'ver_nominas', 'descripcion' => 'Ver nóminas', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'crear_nominas', 'descripcion' => 'Crear periodos de nómina', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'procesar_nominas', 'descripcion' => 'Procesar nóminas', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'aprobar_nominas', 'descripcion' => 'Aprobar nóminas', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'cerrar_nominas', 'descripcion' => 'Cerrar periodos de nómina', 'created_at' => $now, 'updated_at' => $now],
            
            // Gestión de Pagos
            ['nombre' => 'ver_pagos', 'descripcion' => 'Ver registros de pagos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'registrar_pagos', 'descripcion' => 'Registrar pagos', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'aprobar_pagos', 'descripcion' => 'Aprobar pagos', 'created_at' => $now, 'updated_at' => $now],
            
            // Reportes
            ['nombre' => 'ver_reportes', 'descripcion' => 'Ver reportes', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'exportar_reportes', 'descripcion' => 'Exportar reportes', 'created_at' => $now, 'updated_at' => $now],
            
            // Configuración
            ['nombre' => 'ver_configuracion', 'descripcion' => 'Ver configuración del sistema', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'editar_configuracion', 'descripcion' => 'Editar configuración', 'created_at' => $now, 'updated_at' => $now],
            
            // Acceso Propio
            ['nombre' => 'ver_mi_informacion', 'descripcion' => 'Ver mi propia información', 'created_at' => $now, 'updated_at' => $now],
            ['nombre' => 'ver_mis_recibos', 'descripcion' => 'Ver mis recibos de nómina', 'created_at' => $now, 'updated_at' => $now],
        ];

        foreach ($permisos as $permiso) {
            $existe = DB::table('permisos')->where('nombre', $permiso['nombre'])->exists();
            if (!$existe) {
                DB::table('permisos')->insert($permiso);
            }
        }
        echo "✓ Permisos verificados\n";

        // 3. ASIGNAR PERMISOS A ROLES
        $this->asignarPermisosRoles();
        
        echo "✓ Permisos asignados a roles\n";

        // 4. CREAR USUARIOS DE PRUEBA
        $this->crearUsuariosPrueba();
        
        echo "✓ Usuarios de prueba creados\n";
    }

    private function asignarPermisosRoles()
    {
        // LIMPIAR PERMISOS EXISTENTES para evitar duplicados
        echo "Limpiando permisos existentes...\n";
        DB::table('permiso_rol')->delete();
        
        // Super Admin - TODOS los permisos
        $superAdminId = DB::table('roles')->where('nombre', 'super_admin')->value('id');
        if ($superAdminId) {
            $todosPermisos = DB::table('permisos')->pluck('id');
            
            foreach ($todosPermisos as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $superAdminId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Super Admin\n";
        }

        // Admin Nóminas - Gestión completa de nóminas y pagos
        $adminNominasId = DB::table('roles')->where('nombre', 'admin_nominas')->value('id');
        if ($adminNominasId) {
            $permisosAdminNominas = DB::table('permisos')
                ->whereIn('nombre', [
                    'ver_empleados', 'ver_departamentos', 'ver_contratos',
                    'ver_nominas', 'crear_nominas', 'procesar_nominas', 'cerrar_nominas',
                    'ver_pagos', 'registrar_pagos',
                    'ver_reportes', 'exportar_reportes'
                ])
                ->pluck('id');
                
            foreach ($permisosAdminNominas as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $adminNominasId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Admin Nóminas\n";
        }

        // Admin RRHH - Gestión de empleados, departamentos y contratos
        $adminRRHHId = DB::table('roles')->where('nombre', 'admin_rrhh')->value('id');
        if ($adminRRHHId) {
            $permisosAdminRRHH = DB::table('permisos')
                ->whereIn('nombre', [
                    'ver_empleados', 'crear_empleados', 'editar_empleados', 'eliminar_empleados',
                    'ver_departamentos', 'crear_departamentos', 'editar_departamentos', 'eliminar_departamentos',
                    'ver_contratos', 'crear_contratos', 'editar_contratos', 'eliminar_contratos',
                    'ver_reportes'
                ])
                ->pluck('id');
                
            foreach ($permisosAdminRRHH as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $adminRRHHId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Admin RRHH\n";
        }

        // Contador - Revisar y aprobar nóminas
        $contadorId = DB::table('roles')->where('nombre', 'contador')->value('id');
        if ($contadorId) {
            $permisosContador = DB::table('permisos')
                ->whereIn('nombre', [
                    'ver_empleados', 'ver_nominas', 'aprobar_nominas',
                    'ver_pagos', 'aprobar_pagos',
                    'ver_reportes', 'exportar_reportes'
                ])
                ->pluck('id');
                
            foreach ($permisosContador as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $contadorId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Contador\n";
        }

        // Supervisor - Gestión de su departamento
        $supervisorId = DB::table('roles')->where('nombre', 'supervisor')->value('id');
        if ($supervisorId) {
            $permisosSupervisor = DB::table('permisos')
                ->whereIn('nombre', [
                    'ver_empleados', 'ver_departamentos',
                    'ver_nominas', 'ver_reportes'
                ])
                ->pluck('id');
                
            foreach ($permisosSupervisor as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $supervisorId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Supervisor\n";
        }

        // Empleado - Solo su información
        $empleadoId = DB::table('roles')->where('nombre', 'empleado')->value('id');
        if ($empleadoId) {
            $permisosEmpleado = DB::table('permisos')
                ->whereIn('nombre', [
                    'ver_mi_informacion', 'ver_mis_recibos'
                ])
                ->pluck('id');
                
            foreach ($permisosEmpleado as $permisoId) {
                DB::table('permiso_rol')->insert([
                    'rol_id' => $empleadoId,
                    'permiso_id' => $permisoId
                ]);
            }
            echo "✓ Permisos asignados a Empleado\n";
        }
    }

    private function crearUsuariosPrueba()
    {
        $now = now();
        
        // Verificar si ya existen usuarios con estos emails
        $emailsExistentes = [
            'superadmin@nominas.com',
            'nominas@nominas.com',
            'rrhh@nominas.com',
            'contador@nominas.com',
            'supervisor@nominas.com',
            'empleado@nominas.com'
        ];
        
        $usuariosExistentes = DB::table('users')->whereIn('email', $emailsExistentes)->pluck('email')->toArray();
        
        // Super Admin
        if (!in_array('superadmin@nominas.com', $usuariosExistentes)) {
            $superAdminUser = DB::table('users')->insertGetId([
                'name' => 'Super Administrador',
                'email' => 'superadmin@nominas.com',
                'password' => Hash::make('Admin123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $superAdminUser,
                'rol_id' => DB::table('roles')->where('nombre', 'super_admin')->value('id')
            ]);
            echo "✓ Usuario creado: superadmin@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: superadmin@nominas.com\n";
        }

        // Admin Nóminas
        if (!in_array('nominas@nominas.com', $usuariosExistentes)) {
            $adminNominasUser = DB::table('users')->insertGetId([
                'name' => 'Admin Nóminas',
                'email' => 'nominas@nominas.com',
                'password' => Hash::make('Nominas123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $adminNominasUser,
                'rol_id' => DB::table('roles')->where('nombre', 'admin_nominas')->value('id')
            ]);
            echo "✓ Usuario creado: nominas@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: nominas@nominas.com\n";
        }

        // Admin RRHH
        if (!in_array('rrhh@nominas.com', $usuariosExistentes)) {
            $adminRRHHUser = DB::table('users')->insertGetId([
                'name' => 'Admin Recursos Humanos',
                'email' => 'rrhh@nominas.com',
                'password' => Hash::make('RRHH123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $adminRRHHUser,
                'rol_id' => DB::table('roles')->where('nombre', 'admin_rrhh')->value('id')
            ]);
            echo "✓ Usuario creado: rrhh@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: rrhh@nominas.com\n";
        }

        // Contador
        if (!in_array('contador@nominas.com', $usuariosExistentes)) {
            $contadorUser = DB::table('users')->insertGetId([
                'name' => 'Contador Principal',
                'email' => 'contador@nominas.com',
                'password' => Hash::make('Contador123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $contadorUser,
                'rol_id' => DB::table('roles')->where('nombre', 'contador')->value('id')
            ]);
            echo "✓ Usuario creado: contador@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: contador@nominas.com\n";
        }

        // Supervisor
        if (!in_array('supervisor@nominas.com', $usuariosExistentes)) {
            $supervisorUser = DB::table('users')->insertGetId([
                'name' => 'Supervisor Ventas',
                'email' => 'supervisor@nominas.com',
                'password' => Hash::make('Supervisor123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $supervisorUser,
                'rol_id' => DB::table('roles')->where('nombre', 'supervisor')->value('id')
            ]);
            echo "✓ Usuario creado: supervisor@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: supervisor@nominas.com\n";
        }

        // Empleado
        if (!in_array('empleado@nominas.com', $usuariosExistentes)) {
            $empleadoUser = DB::table('users')->insertGetId([
                'name' => 'Juan Pérez',
                'email' => 'empleado@nominas.com',
                'password' => Hash::make('Empleado123!'),
                'email_verified_at' => $now,
                'created_at' => $now,
                'updated_at' => $now
            ]);
            
            DB::table('rol_usuario')->insert([
                'user_id' => $empleadoUser,
                'rol_id' => DB::table('roles')->where('nombre', 'empleado')->value('id')
            ]);
            echo "✓ Usuario creado: empleado@nominas.com\n";
        } else {
            echo "⚠ Usuario ya existe: empleado@nominas.com\n";
        }
    }
}
