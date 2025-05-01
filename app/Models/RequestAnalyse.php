<?php

namespace App\Models;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;

class RequestAnalyse extends Model
{
    protected $fillable = [
        'reservation_id',
        'file_path',
    ];

    public function reservation(){
        return $this->belongsTo(Reservation::class);
    }
}
