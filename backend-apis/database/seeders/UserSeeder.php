<?php

namespace Database\Seeders;

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
    }
}
