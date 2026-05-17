<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('usuario', function (Blueprint $table) {
            if (!Schema::hasColumn('usuario', 'username')) {
                $table->string('username')->unique()->nullable()->after('Nombre_usuario');
            }
            if (!Schema::hasColumn('usuario', 'Estado')) {
                $table->string('Estado')->default('Activo')->after('Id_Trabajador');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'Estado']);
        });
    }
};
