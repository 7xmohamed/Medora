<?php

namespace App\Models;

use App\Models\ContactMessage;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\HasStorageFiles;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasStorageFiles;

    const ROLE_ADMIN = 'admin';
    const ROLE_DOCTOR = 'doctor';
    const ROLE_PATIENT = 'patient';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'profile_picture',
        'id_card_front',
        'id_card_back'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = [
        'profile_picture_url',
        'id_card_front_url',
        'id_card_back_url'
    ];

    // Relations between other models----------

    public function doctor(){
        return $this->hasOne(Doctor::class);
    }

    public function patient(){
        return $this->hasOne(Patient::class);
    }

    public function contactMessage()
    {
        return $this->hasMany(ContactMessage::class);
    }

    // -------------------------------------

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isDoctor(): bool
    {
        return $this->role === self::ROLE_DOCTOR;
    }

    public function isPatient(): bool
    {
        return $this->role === self::ROLE_PATIENT;
    }

    public function hasRole($role): bool
    {
        return $this->role === $role;
    }

    public function getProfilePictureUrlAttribute()
    {
        return $this->profile_picture ? 
            Storage::disk('public')->url($this->profile_picture) : null;
    }

    public function getIdCardFrontUrlAttribute()
    {
        return $this->id_card_front ? 
            Storage::disk('public')->url('doctors/documents/' . $this->id_card_front) : null;
    }

    public function getIdCardBackUrlAttribute()
    {
        return $this->id_card_back ? 
            Storage::disk('public')->url('doctors/documents/' . $this->id_card_back) : null;
    }
}
