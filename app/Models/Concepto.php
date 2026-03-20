<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concepto extends Model
{
    protected $table = 'concepto';
    protected $primaryKey = 'Id_Concepto';
    public $timestamps = false;
    protected $guarded = [];
}
