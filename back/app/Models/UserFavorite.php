<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavorite extends Model
{
    use HasFactory;

    // Table name (optional if the table name follows Laravel's plural convention)
    protected $table = 'user_favorites';

    // Fillable properties for mass assignment
    protected $fillable = [
        'user_id',
        'item_id',
    ];

    /**
     * Get the user that owns the favorite.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the item that is favorited.
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
