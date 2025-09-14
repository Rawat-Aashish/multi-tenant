<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\OrderNotification;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $havmoreShop = Shop::where('name', 'Havmore Ice Creams')->first();
        $belgianWaffleShop = Shop::where('name', 'Belgian Waffle House')->first();

        User::create([
            'shop_id' => $havmoreShop->id,
            'name' => 'Raj Patel',
            'email' => 'icecreams@havmore.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => User::ROLE_SHOP_OWNER,
        ]);

        User::create([
            'shop_id' => $belgianWaffleShop->id,
            'name' => 'Sarah Johnson',
            'email' => 'waffles@belgian.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => User::ROLE_SHOP_OWNER,
        ]);

        $exampleNotifications = [
            [
                'recipient_id' => 1,
                'recipient_type' => Customer::class,
                'message' => "This is a dummy notification for example",
                'status' => "ORDER PLACED",
                'created_at' => now()
            ],
            [
                'recipient_id' => 2,
                'recipient_type' => Customer::class,
                'message' => "This is a dummy notification for example",
                'status' => "ORDER PLACED",
                'created_at' => now()
            ],
            [
                'recipient_id' => 1,
                'recipient_type' => User::class,
                'message' => "This is a dummy notification for example",
                'status' => "NEW ORDER",
                'created_at' => now()
            ],
            [
                'recipient_id' => 2,
                'recipient_type' => User::class,
                'message' => "This is a dummy notification for example",
                'status' => "NEW ORDER",
                'created_at' => now()
            ]
        ];

        foreach ($exampleNotifications as $notification) {
            OrderNotification::insert($notification);
        }
    }
}
