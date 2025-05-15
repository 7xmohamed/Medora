<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'prescription_text',
        'file_path'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}