<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set access token expiration to 30 minutes
        Passport::tokensExpireIn(now()->addMinutes(30));

        // Set refresh token expiration to 1 day
        Passport::refreshTokensExpireIn(now()->addDay());
    }
}
