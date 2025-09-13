<?php

use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use App\Models\Shop;
use App\Services\ProductService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// 1 Stock Decrement
it('decrements stock after successful order', function () {
    $customer = Customer::factory()->create();
    $product = Product::factory()->create(['stock' => 5]);

    $service = app(ProductService::class);
    $service->processOrder([
        'allow_partial_order' => true,
        'products' => [
            ['id' => $product->id, 'quantity' => 2]
        ]
    ], $customer->id);

    expect($product->fresh()->stock)->toBe(3);
});

// 2 Tenant Isolation (Shop owner only sees their products)
it('only allows shop owner to see their own products', function () {
    $shopA = Shop::factory()->create();
    $shopB = Shop::factory()->create();

    $productA = Product::factory()->create(['shop_id' => $shopA->id]);
    $productB = Product::factory()->create(['shop_id' => $shopB->id]);

    $ownerA = User::factory()->create(['shop_id' => $shopA->id, 'role' => User::ROLE_SHOP_OWNER]);

    $this->actingAs($ownerA)
        ->getJson('/api/v1/products/list?page=1')
        ->assertJsonFragment(['id' => $productA->id])
        ->assertJsonMissing(['id' => $productB->id]);
});

// 3 Insufficient Stock Handling
it('fails order if product stock is insufficient', function () {
    $customer = Customer::factory()->create();
    $product = Product::factory()->create(['stock' => 1]);

    $service = app(ProductService::class);
    $result = $service->processOrder([
        'allow_partial_order' => false,
        'products' => [
            ['id' => $product->id, 'quantity' => 5]
        ]
    ], $customer->id);

    expect($result['status'])->toBe(0);
    expect($product->fresh()->stock)->toBe(1); // stock unchanged
});

// 4 Order Split by Shop
it('creates separate orders per shop when ordering from multiple shops', function () {
    $customer = Customer::factory()->create();

    $shopA = Shop::factory()->create();
    $shopB = Shop::factory()->create();

    $productA = Product::factory()->create(['shop_id' => $shopA->id, 'stock' => 10]);
    $productB = Product::factory()->create(['shop_id' => $shopB->id, 'stock' => 10]);

    $service = app(ProductService::class);
    $service->processOrder([
        'allow_partial_order' => true,
        'products' => [
            ['id' => $productA->id, 'quantity' => 2],
            ['id' => $productB->id, 'quantity' => 3],
        ]
    ], $customer->id);

    $this->assertDatabaseHas('orders', [
        'shop_id' => $shopA->id,
        'customer_id' => $customer->id,
    ]);

    $this->assertDatabaseHas('orders', [
        'shop_id' => $shopB->id,
        'customer_id' => $customer->id,
    ]);
});
