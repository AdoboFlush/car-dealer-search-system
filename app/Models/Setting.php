<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Setting extends Model
{

    use LogsActivity;

    protected $fillable = [
        "key",
        "value",
        "is_active"
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} Setting")
            ->logOnly([
                "key",
                "value",
                "is_active"
            ]);
    }
}
