<?php

namespace App\Models;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    protected $fillable = [
        'reservation_id',
        'file_path',
    ];

    protected $casts = [
        'reservation_id' => 'integer',
        'file_path' => 'string',
    ];

    public function reservation(){
        return $this->belongsTo(Reservation::class);
    }

}
