<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoNomina extends Model
{
    protected $table = 'tipo_nomina';
    protected $primaryKey = 'Id_Tipo_Nomina';
    public $timestamps = false;
    protected $guarded = [];
}
