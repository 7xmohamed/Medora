<?php

namespace App\Models;

use App\Models\ContactMessage;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\HasStorageFiles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasStorageFiles;

    const ROLE_ADMIN = 'admin';
    const ROLE_DOCTOR = 'doctor';
    const ROLE_PATIENT = 'patient';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'address',
        'phone',
        'profile_picture',
        'id_card_front',
        'id_card_back',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
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
        return $this->getProfilePictureUrl();
    }

    public function getIdCardFrontUrlAttribute()
    {
        return $this->getIdCardFrontUrl();
    }

    public function getIdCardBackUrlAttribute()
    {
        return $this->getIdCardBackUrl();
    }
}
