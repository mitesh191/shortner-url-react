<?php

use Illuminate\Support\Facades\Route;
use App\Models\ShortUrl;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/{code}', function (string $code) {
	$shortUrl = ShortUrl::where('short_code', $code)->firstOrFail();

	// Increment hit counter
	$shortUrl->increment('hits');

	return redirect()->away($shortUrl->original_url);

});
	
