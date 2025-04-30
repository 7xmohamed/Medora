<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'speciality',
        'location',
        'description',
        'image',
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
}
