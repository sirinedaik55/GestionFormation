<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'name',
        'type',
        'formation_id',
        'file_size',
        'file_path',
        'uploaded_by',
        'original_name',
        'mime_type',
        'description'
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}