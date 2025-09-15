<?php

namespace App\Jobs;

use App\Services\ProductService;
use App\Models\Customer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class PlaceOrderJob implements ShouldQueue
{
    use Queueable;

    protected $request;
    protected $customerId;

    /**
     * Number of times the job should be attempted.
     */
    // public $tries = 2;

    // public $backoff = [5, 10];

    /**
     * Create a new job instance.
     */
    public function __construct(array $request, int $customerId)
    {
        $this->request = $request;
        $this->customerId = $customerId;
    }

    /**
     * Execute the job.
     */
    public function handle(ProductService $productService): void
    {
        $productService->processOrder($this->request, $this->customerId, true);
    }


    // public function failed(\Throwable $exception): void
    // {
    //     OrderNotification::create([
    //         'recipient_id'   => $this->customerId,
    //         'recipient_type' => Customer::class,
    //         'message'        => 'There was an error processing your last order, please try again after sometimes',
    //         'status'         => Customer::ORDER_FAILED,
    //     ]);
    // }
}
