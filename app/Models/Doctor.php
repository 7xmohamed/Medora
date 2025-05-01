<?php

namespace App\Models;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Availability;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'speciality',
        'niom',
        'location',
        'description',
        'image',
        'price',
        'languages',
        'experience',
        'education',
    ];

    protected $casts = [
        'languages' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservations(){
        return $this->hasMany(Reservation::class);
    }

    public function availabilities(){
        return $this->hasMany(Availability::class);
    }
}
