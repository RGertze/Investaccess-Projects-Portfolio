<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $user_id
 * @property string $title
 * @property string $description
 * @property integer $position
 * @property string $created_at
 * @property string $updated_at
 * @property string $completed_at
 * @property User $user
 */
class Task extends Model
{
    /**
     * @var array
     */
    protected $fillable = ['user_id', 'title', 'description', 'position', 'created_at', 'updated_at', 'completed_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
