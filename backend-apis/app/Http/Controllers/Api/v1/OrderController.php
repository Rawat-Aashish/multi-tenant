<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\PlaceOrderRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{

    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function placeOrder(PlaceOrderRequest $request)
    {
        try {
            return $this->productService->processOrder($request->all(), Auth::user()->id);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed ordering the product",
                [
                    "requestData" => $request->all(),
                    "error" => $e->getMessage()
                ]
            );
            return response()->json([
                "message" => __("messages.something_went_wrong", ["resource" => "products", "action" => "ordering"]),
                "status" => 0
            ], 500);
        }
    }
}
