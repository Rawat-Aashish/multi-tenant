<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Customer extends Authenticatable
{
    use HasFactory, HasApiTokens;

    //public $timestamps = false;

    //TABLE
    public $table = 'customers';

    const ROLE_CUSTOMER = 'CUSTOMER';

    //FILLABLE
    protected $fillable = [
        'shop_id',
        'name',
        'email',
        'password'
    ];

    //HIDDEN
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at'
    ];

    //APPENDS
    protected $appends = [];

    //WITH
    protected $with = [];

    //CASTS
    protected $casts = [];

    //RELATIONSHIPS
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function notifications()
    {
        return $this->morphMany(OrderNotification::class, 'recipient');
    }
    
    //ATTRIBUTES
    //public function getExampleAttribute()
    //{
    //    return $data;
    //}

}
