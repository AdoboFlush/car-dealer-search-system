<?php

namespace App\Traits;

trait Scrape
{
    public function defaultHeaders()
    {
        return [
            "user-agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            "upgrade-insecure-requests" => 1,
            "accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            // "content-length" => 60000, 
        ];
    }

    public function splitBetween($start, $end, $response, $seg = "")
    {
        $result = $response;

        if (!empty($seg)) {
            $result = $this->splitOnce($seg, $result, 1);
        }

        $result = $this->splitOnce($start, $result, 1);
        $result = $this->splitOnce($end, $result, 0);

        return $result !== '' ? trim($result) : '';
    }

    public function splitOnce($delimiter, $response, $index = 0)
    {
        $parts = explode($delimiter, $response);
        return isset($parts[$index]) ? trim($parts[$index]) : '';
    }
}
