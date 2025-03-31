<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Comment extends Model
{

    use SoftDeletes, LogsActivity;

    protected $fillable = [
        "content",
        "user_id",
        "post_id",
        "comment_id",
        "is_active",
        "is_viewed",
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} Comment")
            ->logOnly([
                "content",
                "comment_id",
                "is_active",
                "is_viewed",
            ]);
    }

    public function replies() : HasMany
    {
        return $this->hasMany(Comment::class, "comment_id");
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function post() : BelongsTo
    {
        return $this->belongsTo(Post::class, "post_id");
    }
}
