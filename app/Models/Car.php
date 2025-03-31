<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    // Add fillable and casts properties
    protected $fillable = [
        'title',
        'brand',
        'model',
        'type',
        'price',
        'currency',
        'description',
        'details_link',
        'thumbnail_link',
        'is_featured',
        'scraper_process_id',
        'remarks'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'scraper_process_id' => 'integer'
    ];

    public function scraperProcess()
    {
        return $this->belongsTo(ScraperProcess::class);
    }
}
