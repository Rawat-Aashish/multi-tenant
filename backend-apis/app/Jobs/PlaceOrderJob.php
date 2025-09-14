<?php

namespace App\Jobs;

use App\Services\ProductService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class PlaceOrderJob implements ShouldQueue
{
    use Queueable;

    protected $request;
    protected $customerId;
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
}
