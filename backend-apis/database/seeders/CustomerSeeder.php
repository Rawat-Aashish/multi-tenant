<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Customer::factory(2)->create();
        // Customer::all()->each(function ($customer) {
        //     Order::factory(2)->create([
        //         'customer_id' => $customer->id,
        //         'shop_id' => $customer->shop_id,
        //     ]);
        // });

        $customers = [
            [
                'name' => 'First Customer',
                'email' => "first@customer.com",
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now()
            ],

            [
                'name' => 'Second Customer',
                'email' => "second@customer.com",
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($customers as $customer) {
            Customer::insert($customer);
        }
    }
}
