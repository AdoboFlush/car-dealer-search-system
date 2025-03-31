<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class CarResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'brand' => $this->brand,
            'model' => $this->model,
            'price' => $this->price,
            'currency' => $this->currency,
            'details_link' => $this->details_link,
            'thumbnail_link' => $this->thumbnail_link,
            'website_name' => $this->scraperProcess?->scraper_name,
            'website_url' => $this->scraperProcess?->website,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
