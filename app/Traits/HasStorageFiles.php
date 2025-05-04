<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait HasStorageFiles
{
    public function getFileUrl($path)
    {
        if (!$path) {
            return null;
        }
        return Storage::disk('public')->url($path);
    }
    
    public function getProfilePictureUrl()
    {
        return $this->getFileUrl($this->profile_picture);
    }
    
    public function getIdCardFrontUrl()
    {
        return $this->getFileUrl($this->id_card_front);
    }
    
    public function getIdCardBackUrl()
    {
        return $this->getFileUrl($this->id_card_back);
    }
}
