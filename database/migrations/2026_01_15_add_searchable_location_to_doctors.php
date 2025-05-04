<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('location_searchable')->nullable()->after('location');
            $table->string('city_searchable')->nullable()->after('city');
        });

        // Update existing records
        DB::table('doctors')->cursor()->each(function ($doctor) {
            DB::table('doctors')
                ->where('id', $doctor->id)
                ->update([
                    'location_searchable' => $this->sanitizeLocation($doctor->location),
                    'city_searchable' => $this->sanitizeLocation($doctor->city)
                ]);
        });
    }

    public function down()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn(['location_searchable', 'city_searchable']);
        });
    }

    private function sanitizeLocation($text)
    {
        if (!$text) return null;
        $text = mb_strtolower($text);
        $text = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $text);
        return str_replace(['fès', 'fez'], 'fes', $text);
    }
};
