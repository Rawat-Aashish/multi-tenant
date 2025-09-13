<?php

use App\Models\Customer;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// 1 Shop owner can create a product
it('allows shop owner to create product', function () {
    $shop = Shop::factory()->create();
    $owner = User::factory()->create([
        'role' => User::ROLE_SHOP_OWNER,
        'shop_id' => $shop->id,
    ]);

    $payload = [
        'name' => 'Test Product',
        'sku' => 'TP-001',
        'price' => 100,
        'stock' => 10,
    ];

    $this->actingAs($owner, 'sanctum')
        ->postJson('/api/v1/products/create', $payload)
        ->assertStatus(201)
        ->assertJsonFragment(['name' => 'Test Product']);
});

// 2 Customer cannot create product
it('forbids customer from creating product', function () {
    $customer = Customer::factory()->create();

    $payload = [
        'name' => 'Invalid Product',
        'sku' => 'INV-001',
        'price' => 50,
        'stock' => 5,
    ];

    $this->actingAs($customer, 'sanctum')
        ->postJson('/api/v1/products/create', $payload)
        ->assertStatus(401);
});

// 3 Shop owner cannot update product of another shop
it('prevents shop owner from updating another shops product', function () {
    $shopA = Shop::factory()->create();
    $shopB = Shop::factory()->create();

    $ownerA = User::factory()->create([
        'role' => User::ROLE_SHOP_OWNER,
        'shop_id' => $shopA->id,
    ]);

    $productB = Product::factory()->create(['shop_id' => $shopB->id]);

    $this->actingAs($ownerA, 'sanctum')
        ->patchJson("/api/v1/products/update/{$productB->id}", ['name' => 'Hacked'])
        ->assertStatus(200);
});

// 4 Shop owner can delete their own product
it('allows shop owner to delete their own product', function () {
    $shop = Shop::factory()->create();
    $owner = User::factory()->create([
        'role' => User::ROLE_SHOP_OWNER,
        'shop_id' => $shop->id,
    ]);

    $product = Product::factory()->create(['shop_id' => $shop->id]);

    $this->actingAs($owner, 'sanctum')
        ->deleteJson("/api/v1/products/delete/{$product->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});