<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderNotification;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    protected $partialOrdersAllowed;
    protected $customerId;
    protected $isFromJob = false;

    public function processOrder(array $request, int $customerId)
    {
        try {
            $this->partialOrdersAllowed = (bool)$request['allow_partial_order'];
            $this->customerId = $customerId;
            return $this->checkAvailability($request);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed ordering the product",
                [
                    "requestData" => $request,
                    "error" => $e->getMessage(),
                    "stackTrace" => $e->getTraceAsString()
                ]
            );
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

        $result = $this->isFromJob
            ? false
            : [
                'message' => __("messages.quantity_shortage"),
                'status' => 0
            ];
            
        return $result;
    }


    private function deductQuantity(array $request)
    {
        $orderPlacedForProductDetail = [];
        $skippedProducts = [];

        return DB::transaction(function () use ($request, &$orderPlacedForProductDetail, &$skippedProducts) {
            $productIds = collect($request['products'])->pluck('id');

            $products = Product::select(['id', 'stock', 'price', 'shop_id'])
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
                        'shop_id' => $product->shop_id,
                    ];
                } else {
                    $skippedProducts[] = [
                        'id' => $productDetail['id'],
                        'quantity' => (int)$productDetail['quantity'],
                        'product_id' => $productDetail['id'] ?? null
                    ];
                }
            }

            if (empty($orderPlacedForProductDetail)) {
                $result = $this->isFromJob
                    ? false
                    : [
                        'message' => __("messages.quantity_shortage"),
                        'status' => 0
                    ];
            }

            $result = $this->placeOrder($orderPlacedForProductDetail);

            if (!empty($skippedProducts)) {
                $this->notifySkippedProducts($skippedProducts);
            }

            return $result;
        });
    }

    private function placeOrder(array $products)
    {
        $productsGroupedByShop = collect($products)->groupBy('shop_id');

        foreach ($productsGroupedByShop as $shopId => $shopProducts) {
            $order = Order::create([
                'shop_id'     => $shopId,
                'customer_id' => $this->customerId,
            ]);

            $orderItems = [];
            foreach ($shopProducts as $product) {
                $orderItems[] = [
                    'order_id' => $order->id,
                    'product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                    'created_at' => now()->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                ];
            }

            OrderItem::insert($orderItems);

            $notifications = [];
            $notifications[] = [
                'recipient_id' => $this->customerId,
                'recipient_type' => Customer::class,
                'order_id'  => $order->id,
                'message' => "Your order #{$order->id} has been placed successfully.",
                'status' => Order::ORDER_PLACED,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $notifications[] = [
                'recipient_id' => User::where('shop_id', $shopId)->first()->id ?? null,
                'recipient_type' => User::class,
                'order_id' => $order->id,
                'message' => "A new order #{$order->id} has been placed for your shop.",
                'status' => Shop::NEW_ORDER,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            OrderNotification::insert(array_filter($notifications, fn($n) => $n['recipient_id'] !== null));
        }

        $result = $this->isFromJob
            ? true
            : [
                'message' => __("messages.order_created_success"),
                'status'  => 1,
            ];

        return $result;
    }

    private function notifySkippedProducts(array $skippedProducts)
    {
        $notifications = [];

        foreach ($skippedProducts as $product) {
            $notifications[] = [
                'order_id' => null,
                'recipient_id' => $this->customerId,
                'recipient_type' => Customer::class,
                'message' => "The product '{$product['product_id']}' (Qty: {$product['quantity']}) could not be added to your order due to insufficient stock.",
                'status' => Order::ORDER_SKIPPED,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        OrderNotification::insert($notifications);
    }
}
