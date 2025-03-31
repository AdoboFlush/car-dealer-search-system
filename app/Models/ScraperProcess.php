<?php

namespace App\Models;

use App\Enums\Dealer;
use App\Enums\ScraperStatus;
use Illuminate\Database\Eloquent\Model;

class ScraperProcess extends Model
{
    protected $fillable = [
        'scraper_name',
        'scraper_class',
        'total_records',
        'current_records_scraped',
        'starts_at',
        'ends_at',
        'retry_count',
        'last_error_message',
        'remarks',
        'status',
        'is_published',
    ];

    protected $casts = [
        'scraper_name' => Dealer::class,
        'status' => ScraperStatus::class,
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected $appends = [
        'website'
    ];

    public function cars()
    {
        return $this->hasMany(Car::class);
    }

    public function getWebsiteAttribute()
    {
        return $this->scraper_name->website(); 
    }
}
