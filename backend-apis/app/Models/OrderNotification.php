<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderNotification extends Model
{
    use HasFactory;

    //public $timestamps = false;

    //TABLE
    public $table = 'order_notifications';

    //FILLABLE
    protected $fillable = [
        'order_id',
        'recipient_id',
        'recipient_type',
        'message',
        'status'
    ];

    //HIDDEN
    protected $hidden = [
        'recipient_type',
        'recipient_id',
        'order_id',
        'updated_at'
    ];

    //APPENDS
    protected $appends = [];

    //WITH
    protected $with = [];

    //CASTS
    protected $casts = [];

    //RELATIONSHIPS
    public function recipient()
    {
        return $this->morphTo();
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    //ATTRIBUTES
    //public function getExampleAttribute()
    //{
    //    return $data;
    //}

}
