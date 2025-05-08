<?php

namespace App\Models;

use App\Models\User;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'blood_type',
        'height',
        'weight',
        'date_of_birth',
        'gender',
        'medical_history',
        'allergies',
        'health_score'
    ];

    protected $attributes = [
        'health_score' => 100
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }
}
