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

    /**
     * Get ice cream products data for Havmore shop
     */
    public static function getIceCreamProducts(): array
    {
        return [
            ['name' => 'Classic Vanilla Scoop', 'price' => 45.00, 'stock' => 150],
            ['name' => 'Rich Chocolate Delight', 'price' => 50.00, 'stock' => 120],
            ['name' => 'Strawberry Swirl', 'price' => 48.00, 'stock' => 100],
            ['name' => 'Butter Scotch Bliss', 'price' => 52.00, 'stock' => 95],
            ['name' => 'Mint Chocolate Chip', 'price' => 55.00, 'stock' => 80],
            ['name' => 'Mango Kulfi Special', 'price' => 60.00, 'stock' => 75],
            ['name' => 'Pistachio Almond', 'price' => 65.00, 'stock' => 60],
            ['name' => 'Black Currant Burst', 'price' => 58.00, 'stock' => 90],
            ['name' => 'Cookies & Cream', 'price' => 62.00, 'stock' => 85],
            ['name' => 'Caramel Crunch', 'price' => 57.00, 'stock' => 110],
            ['name' => 'Rose Petal Ice Cream', 'price' => 68.00, 'stock' => 45],
            ['name' => 'Coconut Paradise', 'price' => 54.00, 'stock' => 125],
            ['name' => 'Choco Brownie Fudge', 'price' => 70.00, 'stock' => 65],
            ['name' => 'Tender Coconut', 'price' => 56.00, 'stock' => 105],
            ['name' => 'Rajbhog Kulfi', 'price' => 72.00, 'stock' => 40],
            ['name' => 'Paan Ice Cream', 'price' => 66.00, 'stock' => 55],
            ['name' => 'Malai Kulfi', 'price' => 64.00, 'stock' => 88],
            ['name' => 'Kesar Pista', 'price' => 75.00, 'stock' => 35],
            ['name' => 'Chocolate Chip Cookie Dough', 'price' => 68.00, 'stock' => 70],
            ['name' => 'Vanilla Bean Supreme', 'price' => 58.00, 'stock' => 115],
            ['name' => 'Thandai Ice Cream', 'price' => 69.00, 'stock' => 50],
            ['name' => 'Mixed Fruit Medley', 'price' => 59.00, 'stock' => 95],
            ['name' => 'Chocolate Hazelnut', 'price' => 71.00, 'stock' => 60],
            ['name' => 'Blueberry Cheesecake', 'price' => 73.00, 'stock' => 42],
            ['name' => 'Cassata Ice Cream', 'price' => 67.00, 'stock' => 75],
            ['name' => 'Anjeer Badam', 'price' => 76.00, 'stock' => 38],
            ['name' => 'Orange Cream Bar', 'price' => 45.00, 'stock' => 140],
            ['name' => 'Lemon Sherbet', 'price' => 42.00, 'stock' => 160],
            ['name' => 'Raspberry Ripple', 'price' => 61.00, 'stock' => 82],
            ['name' => 'Mocha Almond Fudge', 'price' => 74.00, 'stock' => 48],
            ['name' => 'Vanilla Strawberry Combo', 'price' => 53.00, 'stock' => 118],
            ['name' => 'Chocolate Peanut Butter', 'price' => 69.00, 'stock' => 63],
            ['name' => 'Cardamom Kulfi', 'price' => 65.00, 'stock' => 77],
            ['name' => 'Banana Split Special', 'price' => 58.00, 'stock' => 92],
            ['name' => 'Coffee Mocha', 'price' => 62.00, 'stock' => 85],
            ['name' => 'Gulab Jamun Ice Cream', 'price' => 70.00, 'stock' => 52],
            ['name' => 'Litchi Delight', 'price' => 60.00, 'stock' => 88],
            ['name' => 'Chocolate Mint', 'price' => 64.00, 'stock' => 71],
            ['name' => 'Vanilla Caramel Swirl', 'price' => 59.00, 'stock' => 96],
            ['name' => 'Pineapple Coconut', 'price' => 57.00, 'stock' => 103],
            ['name' => 'Dark Chocolate Truffle', 'price' => 77.00, 'stock' => 41],
            ['name' => 'Mango Lassi Ice Cream', 'price' => 63.00, 'stock' => 79],
            ['name' => 'Chikoo Kulfi', 'price' => 61.00, 'stock' => 84],
            ['name' => 'Tutti Frutti', 'price' => 56.00, 'stock' => 107],
            ['name' => 'Chocolate Orange', 'price' => 66.00, 'stock' => 68],
            ['name' => 'Honey Almond', 'price' => 67.00, 'stock' => 74],
            ['name' => 'Jamun Ice Cream', 'price' => 62.00, 'stock' => 81],
            ['name' => 'Vanilla Berry Blast', 'price' => 60.00, 'stock' => 89],
            ['name' => 'Chocolate Walnut', 'price' => 72.00, 'stock' => 56],
            ['name' => 'Masala Chai Ice Cream', 'price' => 65.00, 'stock' => 73],
        ];
    }

    /**
     * Get waffle products data for Belgian Waffle House
     */
    public static function getWaffleProducts(): array
    {
        return [
            ['name' => 'Classic Belgian Waffle', 'price' => 120.00, 'stock' => 80],
            ['name' => 'Chocolate Drizzle Waffle', 'price' => 150.00, 'stock' => 75],
            ['name' => 'Strawberry & Cream Waffle', 'price' => 145.00, 'stock' => 70],
            ['name' => 'Nutella Heaven Waffle', 'price' => 180.00, 'stock' => 60],
            ['name' => 'Banana Caramel Waffle', 'price' => 155.00, 'stock' => 65],
            ['name' => 'Blueberry Burst Waffle', 'price' => 160.00, 'stock' => 58],
            ['name' => 'Maple Syrup Classic', 'price' => 135.00, 'stock' => 85],
            ['name' => 'Chocolate Chip Waffle', 'price' => 148.00, 'stock' => 72],
            ['name' => 'Peanut Butter Crunch', 'price' => 165.00, 'stock' => 55],
            ['name' => 'Apple Cinnamon Delight', 'price' => 152.00, 'stock' => 68],
            ['name' => 'Oreo Cookie Waffle', 'price' => 175.00, 'stock' => 50],
            ['name' => 'Honey Butter Waffle', 'price' => 142.00, 'stock' => 78],
            ['name' => 'Mixed Berry Waffle', 'price' => 158.00, 'stock' => 62],
            ['name' => 'Salted Caramel Waffle', 'price' => 168.00, 'stock' => 53],
            ['name' => 'Coconut Cream Waffle', 'price' => 156.00, 'stock' => 64],
            ['name' => 'Chocolate Fudge Supreme', 'price' => 185.00, 'stock' => 45],
            ['name' => 'Vanilla Ice Cream Waffle', 'price' => 170.00, 'stock' => 52],
            ['name' => 'Raspberry White Chocolate', 'price' => 172.00, 'stock' => 48],
            ['name' => 'Tiramisu Waffle', 'price' => 188.00, 'stock' => 42],
            ['name' => 'Lemon Zest Waffle', 'price' => 144.00, 'stock' => 76],
            ['name' => 'Double Chocolate Waffle', 'price' => 178.00, 'stock' => 49],
            ['name' => 'Caramelized Apple Waffle', 'price' => 162.00, 'stock' => 59],
            ['name' => 'Cheesecake Waffle', 'price' => 182.00, 'stock' => 46],
            ['name' => 'Mango Tango Waffle', 'price' => 154.00, 'stock' => 66],
            ['name' => 'Red Velvet Waffle', 'price' => 176.00, 'stock' => 51],
            ['name' => 'Pistachio Delight', 'price' => 164.00, 'stock' => 57],
            ['name' => 'Brownie Waffle Stack', 'price' => 190.00, 'stock' => 40],
            ['name' => 'Orange Cream Waffle', 'price' => 149.00, 'stock' => 71],
            ['name' => 'Coffee Mocha Waffle', 'price' => 166.00, 'stock' => 56],
            ['name' => 'Butterscotch Waffle', 'price' => 159.00, 'stock' => 61],
            ['name' => 'Mint Chocolate Waffle', 'price' => 163.00, 'stock' => 58],
            ['name' => 'Peach Cobbler Waffle', 'price' => 157.00, 'stock' => 63],
            ['name' => 'Dark Chocolate Waffle', 'price' => 174.00, 'stock' => 50],
            ['name' => 'Strawberry Cheesecake', 'price' => 179.00, 'stock' => 47],
            ['name' => 'Almond Praline Waffle', 'price' => 167.00, 'stock' => 55],
            ['name' => 'Banana Split Waffle', 'price' => 171.00, 'stock' => 52],
            ['name' => 'Cinnamon Roll Waffle', 'price' => 161.00, 'stock' => 60],
            ['name' => 'Chocolate Hazelnut Waffle', 'price' => 173.00, 'stock' => 49],
            ['name' => 'Vanilla Bean Waffle', 'price' => 146.00, 'stock' => 74],
            ['name' => 'Cherry Vanilla Waffle', 'price' => 153.00, 'stock' => 67],
            ['name' => 'Pineapple Upside Down', 'price' => 158.00, 'stock' => 62],
            ['name' => 'Cookies & Cream Waffle', 'price' => 169.00, 'stock' => 54],
            ['name' => 'Toffee Crunch Waffle', 'price' => 165.00, 'stock' => 56],
            ['name' => 'Blackberry Waffle', 'price' => 156.00, 'stock' => 64],
            ['name' => 'White Chocolate Waffle', 'price' => 171.00, 'stock' => 51],
            ['name' => 'Caramel Apple Pie Waffle', 'price' => 177.00, 'stock' => 48],
            ['name' => 'Chocolate Banana Waffle', 'price' => 164.00, 'stock' => 57],
            ['name' => 'Marshmallow Waffle', 'price' => 151.00, 'stock' => 69],
            ['name' => 'Espresso Chocolate Waffle', 'price' => 175.00, 'stock' => 50],
            ['name' => 'Dulce de Leche Waffle', 'price' => 181.00, 'stock' => 45],
        ];
    }
}
