<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\v1\ListRequest;
use App\Http\Requests\Api\v1\ProductCreationRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function list(ListRequest $request){
        $loggedInUserShopId = Auth::user()->shop_id;

        $products = Product::where("shop_id", $loggedInUserShopId);

        if($request->has("search")){
            $search = '%'.$request->search.'%';
            $products = $products->where('name', 'like', $search);
        }

        $products = $products->paginate($request->per_page ?? 10);

        return response()->json([
            "message" => __("message.product_list_success"),
            "data" => $products->items(),
            "status" => 1
        ], 200);
    }

    public function store(ProductCreationRequest $request){

        

    }
}
