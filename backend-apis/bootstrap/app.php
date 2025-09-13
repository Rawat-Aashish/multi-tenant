<?php

use App\Http\Middleware\HandleLocalization;
use App\Http\Middleware\RoleAccessControlMiddleware;
use App\Traits\RouteHandler;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use App\Traits\ExceptionHandler;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(HandleLocalization::class);
        $middleware->alias([
            'RBAC' => RoleAccessControlMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->dontReport([
            MethodNotAllowedHttpException::class,
        ]);
        ExceptionHandler::handleApiException($exceptions);
    })->create();
