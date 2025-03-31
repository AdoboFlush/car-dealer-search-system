<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConvertResponsesToCamelCase
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof JsonResponse) {
            $content = json_decode($response->content(), true);

            if ($request->hasHeader("X-VueTable") && array_key_exists("data", $content)) {
                $content["data"] = $this->convertDimensionKeyToCamel($content["data"]);
                $formatted_content = $content;
            } else {
                $formatted_content = $this->convertDimensionKeyToCamel($content);
            }

            $response->setContent(json_encode($formatted_content));
        }

        return $response;
    }

    private function convertDimensionKeyToCamel(?array $parameters): array
    {
        $new_payload = [];

        if (!empty($parameters)) {
            foreach ($parameters as $key => $value) {
                $new_payload[Str::camel($key)] = is_array($value)
                    ? $this->convertDimensionKeyToCamel($value)
                    : $value;
            }
        }

        return $new_payload;
    }
}
