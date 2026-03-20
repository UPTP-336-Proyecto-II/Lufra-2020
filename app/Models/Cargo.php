<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    protected $table = 'cargo';
    protected $primaryKey = 'Id_Cargo';
    public $timestamps = false;
    protected $guarded = [];
}
