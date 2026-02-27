<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShortUrlResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        		'id'           => $this->id,
        		'original_url' => $this->original_url,
        		'short_code'   =>  config('app.url') .'/'.$this->short_code,
        		'hits'         => $this->hits,
        		'created_at'   => $this->created_at,
        		'created_by'   => $this->user?->name,
        ];
    }
}
