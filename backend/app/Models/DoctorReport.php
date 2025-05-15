<?php

namespace App\Models;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DoctorReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'report_text',
        'file_path',
    ];

    protected $casts = [];

    public function reservation(){
        return $this->belongsTo(Reservation::class);
    }
}