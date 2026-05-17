<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('nivel_educativo')) {
            return;
        }

        DB::table('nivel_educativo')->insertOrIgnore([
            ['Nombre_Nivel' => 'Superior'],
            ['Nombre_Nivel' => 'Nulo'],
        ]);
    }

    public function down()
    {
        if (!Schema::hasTable('nivel_educativo')) {
            return;
        }

        DB::table('nivel_educativo')->whereIn('Nombre_Nivel', ['Superior', 'Nulo'])->delete();
    }
};
