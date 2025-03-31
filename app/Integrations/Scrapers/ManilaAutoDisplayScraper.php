<?php

namespace App\Integrations\Scrapers;

use App\Enums\Currency;
use App\Enums\ScraperStatus;
use App\Models\ScraperProcess;
use App\Traits\Scrape;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ManilaAutoDisplayScraper 
{
    use Scrape;

    private $cars = [];
    private $url = "https://filter-v8.globo.io/api/apiFilter?callback=jQuery371006768467830901526_1742192458563&filter_id=1989&shop=manila-auto-display.myshopify.com&collection=0&sort_by=title-descending&country=PH&event=loadmore&cid=3ae658e1-b509-4bf2-9a8d-e4272c8a9c93&did=c504613f-e952-493a-a0a4-b4bfb255d139&page_type=collection&page=";
    private $scraper_process = null;

    public function setScraperInstance(ScraperProcess $scraper_process)
    {
        $this->scraper_process = $scraper_process;
        return $this;
    }

    public function addCar(array $data) 
    {
        $this->scraper_process->update([
            "current_records_scraped" => intval($this->scraper_process->current_records_scraped) + 1
        ]);
        $this->scraper_process->cars()->create($data);
        $this->cars[] = $data;
    }

    public function getCars()
    {
        return $this->cars;
    }

    public function process()
    {
        try {
            $this->validateScraperProcess();
            $this->initializeScraperProcess();

            $data_response = $this->fetchAndParsePage(1);
            $pagination = $this->extractPagination($data_response);

            $this->scraper_process->update(["total_records" => $pagination['total_count']]);

            foreach (range(1, $pagination['total_page']) as $page) {
                if ($page !== 1) {
                    $data_response = $this->fetchAndParsePage($page);
                }
                $this->parseJsonData($data_response);
            }

            $this->finalizeScraperProcess(ScraperStatus::Completed);

        } catch (Exception $e) {
            $this->handleScraperError($e);
        }
    }

    private function validateScraperProcess()
    {
        throw_if(!$this->scraper_process, Exception::class, "Scraper process not found.");
    }

    private function initializeScraperProcess()
    {
        $this->scraper_process->cars()->delete();
        $this->scraper_process->update([
            "starts_at" => Carbon::now(),
            "status" => ScraperStatus::Processing->value
        ]);
    }

    private function fetchAndParsePage($page_cursor)
    {
        $response = $this->fetchPage($this->url, $page_cursor);
        return $this->parseResponseBody($response->body());
    }

    private function fetchPage($url, $page_cursor)
    {
        $response = Http::withHeaders($this->defaultHeaders())->get("$url{$page_cursor}");
        throw_if($response->failed(), Exception::class, "Failed to get a response on page {$page_cursor}");
        return $response;
    }

    private function parseResponseBody($body)
    {
        $data = stripslashes($this->splitBetween('/**/jQuery371006768467830901526_1742192458563(', ");", $body));
        return json_decode($data, true);
    }

    private function extractPagination($data_response)
    {
        $total_count = $data_response["pagination"]["total"] ?? 0;
        $total_page = $data_response["pagination"]["last_page"] ?? 0;

        return compact('total_count', 'total_page');
    }

    private function parseJsonData(array $data)
    {
        if (!isset($data['products']) || !is_array($data['products'])) {
            return;
        }

        foreach ($data['products'] as $product) {
            $car = $this->extractCarData($product);
            $car["currency"] = Currency::PHP->value;
            if ($car["details_link"]) {
                $car["description"] = $this->fetchCarDescription($car["details_link"]);
            }
            $this->addCar($car);
        }
    }

    private function extractCarData($product)
    {
        return [
            'title' => $product['title'] ?? null,
            'price' => floatval(str_replace(",", "", $product['variants'][0]['price'])) ?? 0,
            'description' => $product['tags'] ?? null,
            'thumbnail_link' => $product['image']['src'] ?? null,
            'details_link' => "https://www.manilaautodisplay.com/products/" . ($product['handle'] ?? ''),
        ];
    }

    private function fetchCarDescription($details_link)
    {
        $response = Http::withHeaders($this->defaultHeaders())->get($details_link);
        $description = $this->splitBetween('"product__description rte">', '</div><share-button', $response->body());
        return "<div>".preg_replace('/\s*class="[^"]*"/', '', $description)."</div>";
    }

    private function finalizeScraperProcess($status)
    {
        $this->scraper_process->update([
            "ends_at" => Carbon::now(),
            "status" => $status->value
        ]);
    }

    private function handleScraperError(Exception $e)
    {
        report($e);
        $this->scraper_process->update([
            "last_error_message" => $e->getMessage(),
            "ends_at" => Carbon::now(),
            "status" => ScraperStatus::Failed->value
        ]);
    }
}
