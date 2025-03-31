<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Post extends Model
{

    use SoftDeletes, LogsActivity;

    protected $fillable = [
        "title",
        "content",
        "user_id",
        "is_active",
        "sub_title",
        "thumbnail_path",
        "blog_image_path",
    ];

    protected $appends = [
        'thumbnail_link',
        'blog_image_link',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} Post")
            ->logOnly([
                "title",
                "content",
                "is_active",
                "sub_title",
                "thumbnail_path",
                "blog_image_path",
            ]);
    }
    
    public function comments() : HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function getThumbnailLinkAttribute()
    {
        if (!empty($this->thumbnail_path)) {
            if (Str::contains($this->thumbnail_path, ["http", "https"])) {
                return $this->thumbnail_path;
            }
            return asset("storage/{$this->thumbnail_path}");
        } else {
            return null;
        }
    }

    public function getBlogImageLinkAttribute()
    {
        if (!empty($this->blog_image_path)) {
            if (Str::contains($this->blog_image_path, ["http", "https"])) {
                return $this->blog_image_path;
            }
            return asset("storage/{$this->blog_image_path}");
        } else {
            return null;
        }
    }

    public function uploadImage(array|Collection|UploadedFile $file, string $field): self
    {
        $disk = Storage::disk("public");

        $path = $disk->putFile(
            "uploads/blogs/images",
            $file,
            "public"
        );
        $this->{$field} = $path;
        $this->save();

        return $this;
    }
}
