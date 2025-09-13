<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Order::all()->each(function ($order) {
            $products = Product::all()->random(rand(2, 3));

            $attachData = [];
            foreach ($products as $product) {
                $attachData[$product->id] = [
                    'price' => $product->price,
                    'quantity' => rand(1, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $order->products()->attach($attachData);
        });
    }
}
