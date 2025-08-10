<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'formation_id',
        'user_id',
        'status', // present, absent, late
        'notes',
        'taken_by', // formateur_id
        'taken_at',
        'sent_to_admin',
        'sent_at'
    ];

    protected $casts = [
        'taken_at' => 'datetime',
        'sent_at' => 'datetime',
        'sent_to_admin' => 'boolean'
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trainer()
    {
        return $this->belongsTo(User::class, 'taken_by');
    }
} 