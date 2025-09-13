<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    protected $partialOrdersAllowed;
    public function processOrder(array $request)
    {
        try {
            $this->partialOrdersAllowed = (bool)$request['allow_partial_order'];
            return $this->checkAvailability($request);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed ordering the product",
                [
                    "requestData" => $request,
                    "error" => $e->getMessage()
                ]
            );
            return [
                'message' => "Some error occured while processing the order",
                'status' => 0
            ];
        }
    }

    private function checkAvailability(array $request)
    {
        $productIds = collect($request['products'])->pluck('id');

        $products = Product::select(['id', 'stock'])
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        $allProductsStockAvailable = true;

        foreach ($request['products'] as $orderDetail) {
            $product = $products->get($orderDetail['id']);

            if (!$product || $product->stock < (int) $orderDetail['quantity']) {
                $allProductsStockAvailable = false;
            }
        }

        if ($allProductsStockAvailable || (!$allProductsStockAvailable && $this->partialOrdersAllowed)) {
            return $this->deductQuantity($request);
        }

        return [
            'message' => __("messages.quantity_shortage"),
            'status' => 0
        ];
    }


    private function deductQuantity(array $request)
    {
        $orderPlacedForProductDetail = [];

        return DB::transaction(function () use ($request, &$orderPlacedForProductDetail) {
            $productIds = collect($request['products'])->pluck('id');

            $products = Product::select(['id', 'stock', 'price'])
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');


            foreach ($request['products'] as $productDetail) {
                $product = $products->get($productDetail['id']);

                if ($product && $product->stock >= (int)$productDetail['quantity']) {
                    $product->decrement('stock', $productDetail['quantity']);

                    $orderPlacedForProductDetail[] = [
                        'id' => $product->id,
                        'quantity' => (int)$productDetail['quantity'],
                        'price' => $product->price,
                    ];
                }
            }

            if (empty($orderPlacedForProductDetail)) {
                return [
                    'message' => __("messages.quantity_shortage"),
                    'status' => 0
                ];
            }

            return $this->placeOrder($orderPlacedForProductDetail);
        });
    }

    private function placeOrder(array $products)
    {
        try {
            $order = Order::create([
                'shop_id' => 1,
                'customer_id' => 1
            ]);

            $orderItems = [];
            foreach ($products as $product) {
                $orderItems[] = [
                    'order_id' => $order->id,
                    'product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            OrderItem::insert($orderItems);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
