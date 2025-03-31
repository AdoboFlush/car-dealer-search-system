<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\UserType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\UploadedFile;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'profile_image_path',
        'birth_date',
        'type',
        'is_blacklisted',
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

    protected $appends = [
        'full_name',
        'profile_image_link',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'type' => UserType::class,
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->setDescriptionForEvent(fn(string $eventName) => "{$eventName} User")
            ->logOnly([
                'name', 
                'email', 
                'password',
                'first_name',
                'last_name',
                'middle_name',
                'suffix',
                'profile_image_path',
                'birth_date',
                'type'
            ]);
    }

    public function getFullNameAttribute()
    {
        if(empty($this->last_name) && empty($this->first_name)) {
            return '';
        } 
        return "{$this->last_name}, {$this->first_name} {$this->middle_name} {$this->suffix}";
    }

    public function getProfileImageLinkAttribute()
    {
        if (!empty($this->profile_image_path)) {
            if (Str::contains($this->profile_image_path, ["http", "https"])) {
                return $this->profile_image_path;
            }
            return asset("storage/{$this->profile_image_path}");
        } else {
            return null;
        }
    }

    public function uploadImage(array|Collection|UploadedFile $file): self
    {
        $disk = Storage::disk("public");

        $path = $disk->putFile(
            'uploads/users/profiles',
            $file,
            'public'
        );
        $this->profile_image_path = $path;
        $this->save();

        return $this;
    }
}
