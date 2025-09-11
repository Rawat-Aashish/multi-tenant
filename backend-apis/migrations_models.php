<?php
// List of models (in dependency order)
$tables = ["Shop", "Customer", "Product", "Order", "OrderItem"];

// Loop through each and run artisan commands
foreach ($tables as $table) {
    echo "Creating migration and model for {$table}...\n";

    // Run artisan command
    $cmd = "php artisan make:model {$table} -m";
    shell_exec($cmd);

    // Wait 5 seconds before next to avoid same timestamp conflicts
    sleep(10);
}

echo "✅ All models and migrations created!\n";
