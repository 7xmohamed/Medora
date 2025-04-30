<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'name',
        'phone',
        'address',
        'blood_type',
        'height',
        'weight',
        'date_of_birth',
        'gender',
        'medical_history',
        'allergies',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
