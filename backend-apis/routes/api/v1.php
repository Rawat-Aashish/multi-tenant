<?php

use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\OrderController;
use App\Http\Controllers\Api\v1\ProductController;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('logs', [OrderController::class, 'logs']);

    Route::group(['prefix' => 'products/', 'middleware' => 'RBAC:' . User::ROLE_SHOP_OWNER], function () {
        Route::get('list', [ProductController::class, 'list'])->withoutMiddleware('RBAC:' . User::ROLE_SHOP_OWNER);
        Route::post('create', [ProductController::class, 'store']);
        Route::get('view/{product}', [ProductController::class, 'view']);
        Route::patch('update/{product}', [ProductController::class, 'update']);
        Route::delete('delete/{product}', [ProductController::class, 'delete']);
    });
    Route::post('place-order', [OrderController::class, 'placeOrder'])->middleware('RBAC:' . Customer::ROLE_CUSTOMER);
});
