<?php

namespace Database\Factories;

use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shop_id' => Shop::factory(),
            'name' => $this->faker->word,
            'sku' => strtoupper($this->faker->unique()->bothify('SKU-###??')),
            'price' => $this->faker->randomFloat(2, 50, 1000),
            'stock' => $this->faker->numberBetween(10, 100),
        ];
    }
}
