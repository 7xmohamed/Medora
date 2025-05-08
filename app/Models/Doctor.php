<?php

namespace App\Models;

use App\Models\User;
use App\Models\Reservation;
use App\Models\Availability;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Doctor extends Model
{
    protected $fillable = [
        'user_id',
        'speciality',
        'niom',
        'location',
        'latitude',
        'longitude',
        'description',
        'image',
        'price',
        'languages',
        'experience',
        'education',
        'city',
        'total_revenue',
        'monthly_revenue',
        'is_verified'
    ];

    protected $casts = [
        'languages' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
        'price' => 'float',
        'total_revenue' => 'float',
        'monthly_revenue' => 'float',
    ];

    protected $appends = [
        'id_card_front_url',
        'id_card_back_url'
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

    // Add scope for nearby doctors
    public function scopeNearby($query, $lat, $lng, $radius = 50)
    {
        $haversine = "(6371 * acos(cos(radians($lat)) 
                     * cos(radians(latitude)) 
                     * cos(radians(longitude) - radians($lng)) 
                     + sin(radians($lat)) 
                     * sin(radians(latitude))))";
        
        return $query->selectRaw("*, $haversine AS distance")
                     ->whereNotNull('latitude')
                     ->whereNotNull('longitude')
                     ->havingRaw("distance <= ?", [$radius])
                     ->orderBy('distance');
    }

    public function scopeInCity($query, $city)
    {
        $searchTerm = mb_strtolower(trim($city));
        return $query->where(function($query) use ($searchTerm) {
            $query->whereRaw('LOWER(city) LIKE ?', ['%' . $searchTerm . '%'])
                  ->orWhereRaw('LOWER(location) LIKE ?', ['%' . $searchTerm . '%']);
        });
    }

    public function getProfilePictureUrlAttribute()
    {
        return $this->user->profile_picture ? 
            Storage::disk('public')->url($this->user->profile_picture) : null;
    }

    public function getIdCardFrontUrlAttribute()
    {
        return $this->user->id_card_front ? 
            Storage::disk('public')->url($this->user->id_card_front) : null;
    }

    public function getIdCardBackUrlAttribute()
    {
        return $this->user->id_card_back ? 
            Storage::disk('public')->url($this->user->id_card_back) : null;
    }

    public function setLocationAttribute($value)
    {
        $this->attributes['location'] = $value;
    }

    public function setCityAttribute($value)
    {
        $this->attributes['city'] = $value;
    }
}
