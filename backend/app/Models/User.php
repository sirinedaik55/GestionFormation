<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'name',
        'email',
        'password',
        'role',
        'team_id',
        'phone',
        'specialite',
        'date_debut',
        'date_fin',
        'room',
        'status',
        'last_login_at',
        'email_verified_at',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function formationParticipants()
    {
        return $this->hasMany(FormationParticipant::class);
    }

    public function formations()
    {
        return $this->belongsToMany(Formation::class, 'formation_participants')
                    ->withPivot('status', 'notes')
                    ->withTimestamps();
    }

    // Automatically set name when first_name or last_name changes
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($user) {
            if ($user->first_name && $user->last_name) {
                $user->name = $user->first_name . ' ' . $user->last_name;
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole($roles)
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if user is admin
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is trainer
     */
    public function isTrainer()
    {
        return $this->role === 'trainer';
    }

    /**
     * Check if user is employee
     */
    public function isEmployee()
    {
        return $this->role === 'employee';
    }

    /**
     * Check if user is active
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Update last login timestamp
     */
    public function updateLastLogin()
    {
        $this->update(['last_login_at' => now()]);
    }
}
