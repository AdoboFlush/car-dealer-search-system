<?php

namespace App\Integrations\Scrapers;

use App\Enums\Currency;
use App\Enums\ScraperStatus;
use App\Models\ScraperProcess;
use App\Traits\Scrape;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;

class CarEmpireScraper
{
    use Scrape;

    private $cars = [];
    private $url = "https://carempireph.com/page/";
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

            $content = $this->fetchAndParsePage(1);
            $pagination = $this->extractPagination($content);

            $this->scraper_process->update(["total_records" => $pagination['total_count']]);

            foreach (range(1, $pagination['total_page']) as $page) {
                if ($page !== 1) {
                    $content = $this->fetchAndParsePage($page);
                }
                $this->processPageContent($content);
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
        return $response->body();
    }

    private function fetchPage($url, $page_cursor)
    {
        $response = Http::withHeaders($this->defaultHeaders())->get("$url/{$page_cursor}/");
        throw_if($response->failed(), Exception::class, "Failed to get a response on page {$page_cursor}");
        return $response;
    }

    private function extractPagination($content)
    {
        $total_count = intval($this->splitBetween("of", "results", $content, "woocommerce-result-count"));
        $per_page = 16;
        $total_page = ceil($total_count / $per_page);

        return compact('total_count', 'total_page');
    }

    private function processPageContent($content)
    {
        $fragments = explode('<li class="pif-has-gallery ', $content);
        array_shift($fragments);

        foreach ($fragments as $fragment) {
            $car = $this->extractCarData($fragment);
            $car["currency"] = Currency::PHP->value;
            if ($car["details_link"]) {
                $car["description"] = $this->fetchCarDescription($car["details_link"]);
            }
            $this->addCar($car);
        }
    }

    private function extractCarData($fragment)
    {
        return [
            "details_link" => $this->splitBetween('<a href="', '"', $fragment),
            "thumbnail_link" => $this->splitBetween('src="', '"', $fragment, "<img"),
            "title" => $this->splitBetween('loop-product__title">', '<', $fragment),
            "price" => floatval(str_replace(",", "", $this->splitBetween('/span>', '<', $fragment, 'Price-amount amount">'))),
            "description" => "",
        ];
    }

    private function fetchCarDescription($details_link)
    {
        if ($details_link) {
            $response = Http::withHeaders($this->defaultHeaders())->get($details_link);
            $htmlDescription = $this->splitBetween('product-details__short-description">', '</div', $response->body());
            return preg_replace('/\s*class="[^"]*"/', '', $htmlDescription);
        }
        return "";
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
