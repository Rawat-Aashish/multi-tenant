<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\ListRequest;
use App\Http\Requests\Api\v1\PlaceOrderRequest;
use App\Http\Requests\Api\v1\ProductCreationRequest;
use App\Http\Requests\Api\v1\ProductUpdateRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function list(ListRequest $request)
    {
        $loggedInUser = Auth::user();
        $products = Product::query();

        if($loggedInUser->role == User::ROLE_SHOP_OWNER){
            $products = $products->where("shop_id", $loggedInUser->shop_id);
        }

        if($loggedInUser->role == Customer::ROLE_CUSTOMER){
            $products = $products->with('shop')->inRandomOrder();
        }

        if ($request->has("search")) {
            $search = '%' . $request->search . '%';
            $products = $products->where('name', 'like', $search);
        }

        $products = $products->paginate($request->per_page ?? 10);

        return response()->json([
            "message" => __("messages.product_list_success"),
            "total_pages" => $products->lastPage(),
            "data" => $products->items(),
            "status" => 1
        ], 200);
    }

    public function store(ProductCreationRequest $request)
    {
        try {
            $product = DB::transaction(function () use ($request) {
                return Product::create([
                    "shop_id" => Auth::user()->shop_id,
                    "name" => $request->name,
                    "sku" => $request->sku,
                    "price" => $request->price,
                    "stock" => $request->stock
                ]);
            });

            return response()->json([
                "message" => __("messages.product_created_success"),
                "data"    => $product->refresh(),
                "status"  => 1,
            ], 201);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed create new product",
                [
                    "data" => $request->all(),
                    "error" => $e->getMessage()
                ]
            );
            return response()->json([
                "message" => __("messages.something_went_wrong", ["resource" => "product", "action" => "creating"]),
                "status" => 0
            ], 500);
        }
    }

    public function update(ProductUpdateRequest $request, Product $product)
    {
        try {
            $product->fill($request->only(['name', 'price', 'stock', 'sku']));
            $product->save();
            return response()->json([
                "message" => __("messages.product_updated_success"),
                "data" => $product->refresh(),
                "status" => 1
            ], 200);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed updating the product",
                [
                    "product" => $product,
                    "data" => $request->all(),
                    "error" => $e->getMessage()
                ]
            );
            return response()->json([
                "message" => __("messages.something_went_wrong", ["resource" => "product", "action" => "updating"]),
                "status" => 0
            ], 500);
        }
    }

    public function delete(Product $product)
    {
        Gate::authorize('delete', $product);
        try {
            $product->delete();
            return response()->json([
                "message" => __('messages.product_deleted_successfully'),
                "status" => 1
            ]);
        } catch (\Exception $e) {
            Log::channel('products')->error(
                "Failed deleting the product",
                [
                    "product" => $product,
                    "error" => $e->getMessage()
                ]
            );
            return response()->json([
                "message" => __("messages.something_went_wrong", ["resource" => "product", "action" => "delete"]),
                "status" => 0
            ], 500);
        }
    }

    public function view(Product $product)
    {
        return response()->json([
            "message" => __("messages.product_view_success"),
            "data" => $product,
            "status" => 1
        ], 200);
    }
}
