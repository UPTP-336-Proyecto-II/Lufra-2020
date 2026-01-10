<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RolesSeeder extends Seeder
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
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'administrador'], ['guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'empleado'], ['guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin_rrhh'], ['guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin_nominas'], ['guard_name' => 'web']);
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin_contabilidad'], ['guard_name' => 'web']);
        
        echo "✓ Roles Spatie creados exitosamente\n";
    }

    /**
     * Seed usando sistema custom (antes de migración)
     */
    private function seedCustom()
    {
        $now = now();
        
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'administrador'],
            ['descripcion' => 'Admin del sistema', 'created_at' => $now, 'updated_at' => $now]
        );
        
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'empleado'],
            ['descripcion' => 'Empleado', 'created_at' => $now, 'updated_at' => $now]
        );
        
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'admin_rrhh'],
            ['descripcion' => 'Administrador RRHH', 'created_at' => $now, 'updated_at' => $now]
        );
        
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'admin_nominas'],
            ['descripcion' => 'Administrador Nóminas', 'created_at' => $now, 'updated_at' => $now]
        );
        
        DB::table('roles')->updateOrInsert(
            ['nombre' => 'admin_contabilidad'],
            ['descripcion' => 'Administrador Contabilidad', 'created_at' => $now, 'updated_at' => $now]
        );
        
        echo "✓ Roles custom creados exitosamente\n";
    }
}
