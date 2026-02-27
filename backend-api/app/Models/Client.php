<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
	protected $fillable = ['name'];

    public function users()
    {
        return $this->hasMany(User::class, 'client_id');
    }
    
    public function firstUser()
    {
    	return $this->hasOne(User::class, 'client_id')->oldest();
    }

    public function shortUrls()
    {
        return $this->hasMany(ShortUrl::class, 'client_id');
    }
}
