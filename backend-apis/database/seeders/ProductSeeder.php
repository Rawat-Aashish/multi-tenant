<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use Database\Factories\ProductFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Shop::all()->each(function ($shop) {
        //     Product::factory(10)->create([
        //         'shop_id' => $shop->id,
        //     ]);
        // });

        $havmoreShop = Shop::where('name', 'Havmore Ice Creams')->first();
        $belgianWaffleShop = Shop::where('name', 'Belgian Waffle House')->first();

        $iceCreamProducts = collect(ProductFactory::getIceCreamProducts())
            ->map(function ($product, $index) use ($havmoreShop) {
                return [
                    'shop_id' => $havmoreShop->id,
                    'name' => $product['name'],
                    'sku' => 'HAV-ICE-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->toArray();

        $waffleProducts = collect(ProductFactory::getWaffleProducts())
            ->map(function ($product, $index) use ($belgianWaffleShop) {
                return [
                    'shop_id' => $belgianWaffleShop->id,
                    'name' => $product['name'],
                    'sku' => 'BWH-WAF-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'price' => $product['price'],
                    'stock' => $product['stock'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })
            ->toArray();

        Product::insert($iceCreamProducts);
        Product::insert($waffleProducts);
    }
}
