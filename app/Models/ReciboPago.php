<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReciboPago extends Model
{
    protected $table = 'recibo_pago';
    protected $primaryKey = 'Id_Recibo_Pago';
    public $timestamps = false;
    protected $guarded = [];
}
