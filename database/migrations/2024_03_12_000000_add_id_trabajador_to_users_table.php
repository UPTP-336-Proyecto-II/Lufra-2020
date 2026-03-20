<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->integer('Id_Trabajador')->nullable()->after('role');
        });

        // Link existing users based on legacy usuario table
        $legacyUsers = DB::table('usuario')->get();
        foreach ($legacyUsers as $legacyUser) {
            DB::table('users')
                ->where('name', $legacyUser->Nombre_usuario)
                ->update(['Id_Trabajador' => $legacyUser->Id_Trabajador]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $blueprint) {
            $blueprint->dropColumn('Id_Trabajador');
        });
    }
};
