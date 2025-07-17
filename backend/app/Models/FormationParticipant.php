<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormationParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'formation_id',
        'user_id',
        'status',
        'attendance',
        'notes',
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
