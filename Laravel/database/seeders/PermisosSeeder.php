<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PermisosSeeder extends Seeder
{
    public function run(): void
    {
        // Detectar si ya se migró a Spatie o sigue con sistema custom
        $usaSpatie = Schema::hasTable('permissions');
        
        if ($usaSpatie) {
            $this->seedSpatie();
        } else {
            $this->seedCustom();
        }
    }

    /**
     * Seed usando Spatie Permission (después de migración)
     */
    private function seedSpatie()
    {
        $permisos = $this->getPermisosList();

        foreach ($permisos as $permiso) {
            \Spatie\Permission\Models\Permission::firstOrCreate(
                ['name' => $permiso], 
                ['guard_name' => 'web']
            );
        }

        $this->asignarPermisosSpatieRoles();
        
        echo "✓ Permisos Spatie creados y asignados exitosamente\n";
    }

    /**
     * Seed usando sistema custom (antes de migración)
     */
    private function seedCustom()
    {
        $permisos = [
            // Dashboard
            ['nombre' => 'ver_dashboard', 'descripcion' => 'Acceder al dashboard'],
            
            // Empleados
            ['nombre' => 'empleados.ver', 'descripcion' => 'Ver empleados'],
            ['nombre' => 'empleados.crear', 'descripcion' => 'Crear empleados'],
            ['nombre' => 'empleados.editar', 'descripcion' => 'Editar empleados'],
            ['nombre' => 'empleados.eliminar', 'descripcion' => 'Eliminar empleados'],
            ['nombre' => 'gestionar_empleados', 'descripcion' => 'CRUD de empleados'],
            
            // Departamentos
            ['nombre' => 'departamentos.ver', 'descripcion' => 'Ver departamentos'],
            ['nombre' => 'departamentos.crear', 'descripcion' => 'Crear departamentos'],
            ['nombre' => 'departamentos.editar', 'descripcion' => 'Editar departamentos'],
            ['nombre' => 'departamentos.eliminar', 'descripcion' => 'Eliminar departamentos'],
            ['nombre' => 'gestionar_departamentos', 'descripcion' => 'CRUD de departamentos'],
            
            // Contratos
            ['nombre' => 'contratos.ver', 'descripcion' => 'Ver contratos'],
            ['nombre' => 'contratos.crear', 'descripcion' => 'Crear contratos'],
            ['nombre' => 'contratos.editar', 'descripcion' => 'Editar contratos'],
            ['nombre' => 'contratos.eliminar', 'descripcion' => 'Eliminar contratos'],
            ['nombre' => 'gestionar_contratos', 'descripcion' => 'CRUD de contratos'],
            
            // Nóminas
            ['nombre' => 'nominas.ver', 'descripcion' => 'Ver nóminas'],
            ['nombre' => 'nominas.crear', 'descripcion' => 'Crear nóminas'],
            ['nombre' => 'nominas.editar', 'descripcion' => 'Editar nóminas'],
            ['nombre' => 'nominas.eliminar', 'descripcion' => 'Eliminar nóminas'],
            ['nombre' => 'nominas.calcular', 'descripcion' => 'Calcular nóminas'],
            ['nombre' => 'nominas.aprobar', 'descripcion' => 'Aprobar nóminas'],
            ['nombre' => 'gestionar_periodos', 'descripcion' => 'CRUD de periodos de nómina'],
            
            // Recibos
            ['nombre' => 'recibos.ver', 'descripcion' => 'Ver recibos'],
            ['nombre' => 'recibos.crear', 'descripcion' => 'Crear recibos'],
            ['nombre' => 'recibos.editar', 'descripcion' => 'Editar recibos'],
            ['nombre' => 'recibos.eliminar', 'descripcion' => 'Eliminar recibos'],
            ['nombre' => 'gestionar_recibos_pagos', 'descripcion' => 'Emitir recibos y registrar pagos'],
            
            // Reportes
            ['nombre' => 'reportes.ver', 'descripcion' => 'Ver reportes'],
            ['nombre' => 'reportes.generar', 'descripcion' => 'Generar reportes'],
            
            // Roles
            ['nombre' => 'asignar_roles', 'descripcion' => 'Asignar roles a usuarios'],
            
            // Configuración
            ['nombre' => 'configuracion.ver', 'descripcion' => 'Ver configuración'],
            ['nombre' => 'configuracion.editar', 'descripcion' => 'Editar configuración'],
        ];

        foreach ($permisos as $permiso) {
            DB::table('permisos')->updateOrInsert(
                ['nombre' => $permiso['nombre']],
                [
                    'descripcion' => $permiso['descripcion'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $this->asignarPermisosCustomRoles();
        
        echo "✓ Permisos custom creados y asignados exitosamente\n";
    }

    /**
     * Lista de permisos
     */
    private function getPermisosList(): array
    {
        return [
            'ver_dashboard',
            'empleados.ver',
            'empleados.crear',
            'empleados.editar',
            'empleados.eliminar',
            'gestionar_empleados',
            'departamentos.ver',
            'departamentos.crear',
            'departamentos.editar',
            'departamentos.eliminar',
            'gestionar_departamentos',
            'contratos.ver',
            'contratos.crear',
            'contratos.editar',
            'contratos.eliminar',
            'gestionar_contratos',
            'nominas.ver',
            'nominas.crear',
            'nominas.editar',
            'nominas.eliminar',
            'nominas.calcular',
            'nominas.aprobar',
            'gestionar_periodos',
            'recibos.ver',
            'recibos.crear',
            'recibos.editar',
            'recibos.eliminar',
            'gestionar_recibos_pagos',
            'reportes.ver',
            'reportes.generar',
            'asignar_roles',
            'configuracion.ver',
            'configuracion.editar',
            'vacaciones.solicitar',
            'vacaciones.ver',
            'vacaciones.gestionar',
        ];
    }

    /**
     * Asignar permisos a roles (Spatie)
     */
    private function asignarPermisosSpatieRoles()
    {
        // Administrador: TODOS los permisos
        $admin = \Spatie\Permission\Models\Role::where('name', 'administrador')->first();
        if ($admin) {
            $admin->syncPermissions(\Spatie\Permission\Models\Permission::all());
        }

        // Admin RRHH
        $adminRRHH = \Spatie\Permission\Models\Role::where('name', 'admin_rrhh')->first();
        if ($adminRRHH) {
            $adminRRHH->syncPermissions([
                'ver_dashboard',
                'empleados.ver',
                'empleados.crear',
                'empleados.editar',
                'gestionar_empleados',
                'gestionar_departamentos',
                'gestionar_contratos',
            ]);
        }

        // Admin Nóminas
        $adminNominas = \Spatie\Permission\Models\Role::where('name', 'admin_nominas')->first();
        if ($adminNominas) {
            $adminNominas->syncPermissions([
                'ver_dashboard',
                'nominas.ver',
                'nominas.crear',
                'nominas.editar',
                'nominas.calcular',
                'nominas.aprobar',
                'gestionar_periodos',
                'gestionar_recibos_pagos',
                'reportes.ver',
                'reportes.generar',
            ]);
        }

        // Admin Contabilidad
        $adminContabilidad = \Spatie\Permission\Models\Role::where('name', 'admin_contabilidad')->first();
        if ($adminContabilidad) {
            $adminContabilidad->syncPermissions([
                'ver_dashboard',
                'nominas.ver',
                'recibos.ver',
                'reportes.ver',
                'reportes.generar',
                'configuracion.ver',
                'configuracion.editar',
            ]);
        }

        // Supervisor: solo lectura
        $supervisor = \Spatie\Permission\Models\Role::where('name', 'supervisor')->first();
        if ($supervisor) {
            $supervisor->syncPermissions([
                'ver_dashboard',
                'empleados.ver',
                'nominas.ver',
                'recibos.ver',
                'reportes.ver',
            ]);
        }

        // Empleado: ver recibos y solicitar vacaciones
        $empleado = \Spatie\Permission\Models\Role::where('name', 'empleado')->first();
        if ($empleado) {
            $empleado->syncPermissions([
                'ver_dashboard',
                'recibos.ver',
                'vacaciones.solicitar',
                'vacaciones.ver',
            ]);
        }

        // Admin RRHH también puede gestionar vacaciones
        if ($adminRRHH) {
            $adminRRHH->givePermissionTo('vacaciones.gestionar');
        }
    }

    /**
     * Asignar permisos a roles (Sistema Custom)
     */
    private function asignarPermisosCustomRoles()
    {
        $roles = DB::table('roles')->pluck('id', 'nombre');
        $permisosIds = DB::table('permisos')->pluck('id', 'nombre');

        // Administrador: TODOS los permisos
        if (isset($roles['administrador'])) {
            foreach ($permisosIds as $pid) {
                DB::table('permiso_rol')->updateOrInsert(
                    ['rol_id' => $roles['administrador'], 'permiso_id' => $pid],
                    []
                );
            }
        }

        // Admin RRHH
        if (isset($roles['admin_rrhh'])) {
            $permisosRRHH = [
                'ver_dashboard',
                'empleados.ver',
                'empleados.crear',
                'empleados.editar',
                'gestionar_empleados',
                'gestionar_departamentos',
                'gestionar_contratos',
            ];

            foreach ($permisosRRHH as $permisoNombre) {
                if (isset($permisosIds[$permisoNombre])) {
                    DB::table('permiso_rol')->updateOrInsert(
                        ['rol_id' => $roles['admin_rrhh'], 'permiso_id' => $permisosIds[$permisoNombre]],
                        []
                    );
                }
            }
        }

        // Admin Nóminas
        if (isset($roles['admin_nominas'])) {
            $permisosNominas = [
                'ver_dashboard',
                'nominas.ver',
                'nominas.crear',
                'nominas.editar',
                'nominas.calcular',
                'nominas.aprobar',
                'gestionar_periodos',
                'gestionar_recibos_pagos',
                'reportes.ver',
                'reportes.generar',
            ];

            foreach ($permisosNominas as $permisoNombre) {
                if (isset($permisosIds[$permisoNombre])) {
                    DB::table('permiso_rol')->updateOrInsert(
                        ['rol_id' => $roles['admin_nominas'], 'permiso_id' => $permisosIds[$permisoNombre]],
                        []
                    );
                }
            }
        }

        // Admin Contabilidad
        if (isset($roles['admin_contabilidad'])) {
            $permisosContabilidad = [
                'ver_dashboard',
                'nominas.ver',
                'recibos.ver',
                'reportes.ver',
                'reportes.generar',
                'configuracion.ver',
                'configuracion.editar',
            ];

            foreach ($permisosContabilidad as $permisoNombre) {
                if (isset($permisosIds[$permisoNombre])) {
                    DB::table('permiso_rol')->updateOrInsert(
                        ['rol_id' => $roles['admin_contabilidad'], 'permiso_id' => $permisosIds[$permisoNombre]],
                        []
                    );
                }
            }
        }

        // Empleado: solo ver sus recibos
        if (isset($roles['empleado'])) {
            $permisosEmpleado = [
                'ver_dashboard',
                'recibos.ver',
            ];

            foreach ($permisosEmpleado as $permisoNombre) {
                if (isset($permisosIds[$permisoNombre])) {
                    DB::table('permiso_rol')->updateOrInsert(
                        ['rol_id' => $roles['empleado'], 'permiso_id' => $permisosIds[$permisoNombre]],
                        []
                    );
                }
            }
        }
    }
}
