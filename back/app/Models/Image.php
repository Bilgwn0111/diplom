<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Image extends Model
{
    use HasFactory;

    protected $fillable = ['url', 'item_id'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
