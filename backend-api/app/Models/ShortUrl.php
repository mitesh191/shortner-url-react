<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShortUrl extends Model
{
	protected $fillable = [
			'client_id',
			'user_id',
			'original_url',
			'short_code'
	];
	
	public function client()
	{
		return $this->belongsTo(Client::class, 'client_id');
	}
	
	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}
}
