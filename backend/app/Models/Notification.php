<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'title',
        'message',
        'type', // attendance, formation, user, etc.
        'read_at',
        'data', // JSON data for additional info
        'recipient_id', // admin_id
        'sender_id', // formateur_id
        'formation_id'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'data' => 'array'
    ];

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    public function isRead()
    {
        return !is_null($this->read_at);
    }
} 