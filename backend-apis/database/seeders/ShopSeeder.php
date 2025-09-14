<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Shop::factory(3)->create();

        Shop::create([
            'name' => 'Havmore Ice Creams',
            'address' => '123 Dairy Lane, Sweet Valley, Gujarat 390001',
            'phone' => '+91 98765 43210',
        ]);

        Shop::create([
            'name' => 'Belgian Waffle House',
            'address' => '456 Waffle Street, Dessert District, Gujarat 390002',
            'phone' => '+91 87654 32109',
        ]);
    }
}
