<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Migrar sistema custom de roles/permisos a Laravel Spatie
     */
    public function up(): void
    {
        // 1. RENOMBRAR tabla permisos a permissions
        Schema::rename('permisos', 'permissions');
        
        // 2. Actualizar columnas en permissions
        Schema::table('permissions', function (Blueprint $table) {
            $table->renameColumn('nombre', 'name');
            $table->renameColumn('descripcion', 'description');
            $table->string('guard_name')->default('web')->after('name');
        });

        // 3. Actualizar columnas en roles
        Schema::table('roles', function (Blueprint $table) {
            $table->renameColumn('nombre', 'name');
            $table->renameColumn('descripcion', 'description');
            $table->string('guard_name')->default('web')->after('name');
        });

        // 4. CREAR tabla model_has_permissions
        Schema::create('model_has_permissions', function (Blueprint $table) {
            $table->unsignedBigInteger('permission_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            
            $table->index(['model_id', 'model_type']);
            $table->primary(['permission_id', 'model_id', 'model_type'], 'model_has_permissions_permission_model_type_primary');
            
            $table->foreign('permission_id')
                ->references('id')
                ->on('permissions')
                ->onDelete('cascade');
        });

        // 5. CREAR tabla model_has_roles
        Schema::create('model_has_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('role_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            
            $table->index(['model_id', 'model_type']);
            $table->primary(['role_id', 'model_id', 'model_type'], 'model_has_roles_role_model_type_primary');
            
            $table->foreign('role_id')
                ->references('id')
                ->on('roles')
                ->onDelete('cascade');
        });

        // 6. MIGRAR datos de rol_usuario a model_has_roles
        $rolUsuarios = DB::table('rol_usuario')->get();
        foreach ($rolUsuarios as $ru) {
            DB::table('model_has_roles')->insert([
                'role_id' => $ru->rol_id,
                'model_type' => 'App\\Models\\User',
                'model_id' => $ru->user_id,
            ]);
        }

        // 7. RENOMBRAR permiso_rol a role_has_permissions
        Schema::rename('permiso_rol', 'role_has_permissions');
        
        // 8. Actualizar columnas en role_has_permissions
        Schema::table('role_has_permissions', function (Blueprint $table) {
            $table->renameColumn('permiso_id', 'permission_id');
            $table->renameColumn('rol_id', 'role_id');
        });

        // 9. ELIMINAR tabla antigua rol_usuario
        Schema::dropIfExists('rol_usuario');

        echo "✓ Migración a Spatie completada exitosamente\n";
    }

    /**
     * Revertir a sistema custom
     */
    public function down(): void
    {
        // Recrear rol_usuario
        Schema::create('rol_usuario', function (Blueprint $table) {
            $table->unsignedBigInteger('rol_id');
            $table->unsignedBigInteger('user_id');
            $table->primary(['rol_id', 'user_id']);
            $table->foreign('rol_id')->references('id')->on('roles')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        // Migrar datos de vuelta
        $modelRoles = DB::table('model_has_roles')
            ->where('model_type', 'App\\Models\\User')
            ->get();
        
        foreach ($modelRoles as $mr) {
            DB::table('rol_usuario')->insert([
                'rol_id' => $mr->role_id,
                'user_id' => $mr->model_id,
            ]);
        }

        // Renombrar tablas
        Schema::rename('role_has_permissions', 'permiso_rol');
        
        Schema::table('permiso_rol', function (Blueprint $table) {
            $table->renameColumn('permission_id', 'permiso_id');
        });

        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('model_has_permissions');

        // Revertir permissions
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn('guard_name');
            $table->renameColumn('name', 'nombre');
            $table->renameColumn('description', 'descripcion');
        });
        
        Schema::rename('permissions', 'permisos');

        // Revertir roles
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('guard_name');
            $table->renameColumn('name', 'nombre');
            $table->renameColumn('description', 'descripcion');
        });
    }
};
