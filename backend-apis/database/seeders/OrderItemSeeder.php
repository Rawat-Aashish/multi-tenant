<?php

namespace Database\Seeders;

use App\Models\Order;
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
            $products = $order->shop->products->random(rand(2, 3));

            $attachData = [];
            foreach ($products as $product) {
                $attachData[$product->id] = [
                    'price' => $product->price,
                    'quantity' => rand(1, 5),
                ];
            }

            $order->products()->attach($attachData);
        });
    }
}
