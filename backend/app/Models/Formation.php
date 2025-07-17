<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'date',
        'duree',
        'equipe_id',
        'formateur_id',
        'room',
        'status',
    ];

    public function equipe()
    {
        return $this->belongsTo(Team::class, 'equipe_id');
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    public function participants()
    {
        return $this->hasMany(FormationParticipant::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'formation_participants')
                    ->withPivot('status', 'notes')
                    ->withTimestamps();
    }
}
