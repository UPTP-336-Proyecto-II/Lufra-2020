<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class CuentasNominasSeeder extends Seeder
{
    /**
     * Seed cuentas de prueba para sistema de nóminas
     */
    public function run(): void
    {
        $usaSpatie = Schema::hasTable('permissions');
        
        echo "==============================================\n";
        echo "CREANDO CUENTAS PARA SISTEMA DE NÓMINAS\n";
        echo "==============================================\n\n";

        // 1. SUPER ADMINISTRADOR
        $this->crearSuperAdmin($usaSpatie);
        
        // 2. ADMIN RECURSOS HUMANOS
        $this->crearAdminRRHH($usaSpatie);
        
        // 3. ADMIN NÓMINAS
        $this->crearAdminNominas($usaSpatie);
        
        // 4. CONTADOR
        $this->crearContador($usaSpatie);
        
        // 5. SUPERVISOR
        $this->crearSupervisor($usaSpatie);
        
        // 6. EMPLEADOS DE PRUEBA
        $this->crearEmpleados($usaSpatie);

        echo "\n==============================================\n";
        echo "RESUMEN DE CUENTAS CREADAS\n";
        echo "==============================================\n";
        echo "✓ Super Admin: admin@example.com /password\n";
        echo "✓ Admin RRHH: rrhh@example.com / password\n";
        echo "✓ Admin Nóminas: nominas@example.com / password\n";
        echo "✓ Contador: contador@example.com / password\n";
        echo "✓ Supervisor: supervisor@example.com / password\n";
        echo "✓ Empleado 1: juan.perez@example.com / password\n";
        echo "✓ Empleado 2: maria.garcia@example.com / password\n";
        echo "✓ Empleado 3: carlos.lopez@example.com / password\n";
        echo "==============================================\n\n";
    }

    /**
     * 1. SUPER ADMINISTRADOR
     * - Acceso total al sistema
     * - Puede gestionar usuarios, roles y permisos
     */
    private function crearSuperAdmin(bool $usaSpatie)
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Administrador',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($usaSpatie) {
            $user->assignRole('administrador');
            echo "✓ Super Admin creado (Spatie): {$user->email}\n";
        } else {
            $rolId = DB::table('roles')->where('nombre', 'administrador')->value('id');
            if ($rolId) {
                DB::table('rol_usuario')->updateOrInsert(
                    ['user_id' => $user->id, 'rol_id' => $rolId],
                    []
                );
            }
            echo "✓ Super Admin creado (Custom): {$user->email}\n";
        }
    }

    /**
     * 2. ADMIN RECURSOS HUMANOS
     * - Gestiona empleados, departamentos y contratos
     * - No puede gestionar nóminas ni pagos
     */
    private function crearAdminRRHH(bool $usaSpatie)
    {
        $user = User::firstOrCreate(
            ['email' => 'rrhh@example.com'],
            [
                'name' => 'Administrador RRHH',
                'password' => Hash::make('RRHH123!'),
                'email_verified_at' => now(),
            ]
        );

        if ($usaSpatie) {
            $user->assignRole('admin_rrhh');
            echo "✓ Admin RRHH creado (Spatie): {$user->email}\n";
        } else {
            $rolId = DB::table('roles')->where('nombre', 'admin_rrhh')->value('id');
            if ($rolId) {
                DB::table('rol_usuario')->updateOrInsert(
                    ['user_id' => $user->id, 'rol_id' => $rolId],
                    []
                );
            }
            echo "✓ Admin RRHH creado (Custom): {$user->email}\n";
        }
    }

    /**
     * 3. ADMIN NÓMINAS
     * - Gestiona períodos de nómina
     * - Calcula y aprueba nóminas
     * - Genera recibos de pago
     */
    private function crearAdminNominas(bool $usaSpatie)
    {
        $user = User::firstOrCreate(
            ['email' => 'nominas@example.com'],
            [
                'name' => 'Administrador Nóminas',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($usaSpatie) {
            $user->assignRole('admin_nominas');
            echo "✓ Admin Nóminas creado (Spatie): {$user->email}\n";
        } else {
            $rolId = DB::table('roles')->where('nombre', 'admin_nominas')->value('id');
            if ($rolId) {
                DB::table('rol_usuario')->updateOrInsert(
                    ['user_id' => $user->id, 'rol_id' => $rolId],
                    []
                );
            }
            echo "✓ Admin Nóminas creado (Custom): {$user->email}\n";
        }
    }

    /**
     * 4. CONTADOR
     * - Visualiza nóminas y reportes
     * - Gestiona pagos y contabilidad
     * - No puede crear/editar empleados
     */
    private function crearContador(bool $usaSpatie)
    {
        $user = User::firstOrCreate(
            ['email' => 'contador@example.com'],
            [
                'name' => 'Contador General',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($usaSpatie) {
            $user->assignRole('admin_contabilidad');
            echo "✓ Contador creado (Spatie): {$user->email}\n";
        } else {
            $rolId = DB::table('roles')->where('nombre', 'admin_contabilidad')->value('id');
            if ($rolId) {
                DB::table('rol_usuario')->updateOrInsert(
                    ['user_id' => $user->id, 'rol_id' => $rolId],
                    []
                );
            }
            echo "✓ Contador creado (Custom): {$user->email}\n";
        }
    }

    /**
     * 5. SUPERVISOR
     * - Visualiza información de empleados
     * - Consulta nóminas y recibos
     * - Sin permisos de edición
     */
    private function crearSupervisor(bool $usaSpatie)
    {
        // Crear rol supervisor si no existe
        if ($usaSpatie) {
            $supervisor = \Spatie\Permission\Models\Role::firstOrCreate(
                ['name' => 'supervisor'],
                ['guard_name' => 'web']
            );
            
            // Asignar permisos de solo lectura
            $supervisor->syncPermissions([
                'ver_dashboard',
                'empleados.ver',
                'nominas.ver',
                'recibos.ver',
                'reportes.ver',
            ]);
        } else {
            DB::table('roles')->updateOrInsert(
                ['nombre' => 'supervisor'],
                ['descripcion' => 'Supervisor - Solo lectura', 'created_at' => now(), 'updated_at' => now()]
            );
        }

        $user = User::firstOrCreate(
            ['email' => 'supervisor@example.com'],
            [
                'name' => 'Supervisor General',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($usaSpatie) {
            $user->assignRole('supervisor');
            echo "✓ Supervisor creado (Spatie): {$user->email}\n";
        } else {
            $rolId = DB::table('roles')->where('nombre', 'supervisor')->value('id');
            if ($rolId) {
                DB::table('rol_usuario')->updateOrInsert(
                    ['user_id' => $user->id, 'rol_id' => $rolId],
                    []
                );
            }
            echo "✓ Supervisor creado (Custom): {$user->email}\n";
        }
    }

    /**
     * 6. EMPLEADOS DE PRUEBA
     * - Solo pueden ver sus propios recibos
     * - Sin acceso administrativo
     */
    private function crearEmpleados(bool $usaSpatie)
    {
        $empleados = [
            [
                'name' => 'Juan Pérez',
                'email' => 'juan.perez@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'María García',
                'email' => 'maria.garcia@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos.lopez@example.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($empleados as $empleadoData) {
            $user = User::firstOrCreate(
                ['email' => $empleadoData['email']],
                array_merge($empleadoData, ['email_verified_at' => now()])
            );

            if ($usaSpatie) {
                $user->assignRole('empleado');
                echo "✓ Empleado creado (Spatie): {$user->email}\n";
            } else {
                $rolId = DB::table('roles')->where('nombre', 'empleado')->value('id');
                if ($rolId) {
                    DB::table('rol_usuario')->updateOrInsert(
                        ['user_id' => $user->id, 'rol_id' => $rolId],
                        []
                    );
                }
                echo "✓ Empleado creado (Custom): {$user->email}\n";
            }
        }
    }
}
