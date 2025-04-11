# Car Dealer Search System

A demo PHP-based application built with **Laravel 11**.

## Features

- Second-hand car search engine.
- Scrapes data from multiple car dealer websites.
- Management functionality for cars and scraper configurations.

## Installation

1. Install dependencies:
   ```bash
   composer install
   ```
2. Set up `.env` values.
3. Run database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
4. Compile frontend assets:
   ```bash
   npm run dev
   ```

## Running the Scraper

Start the scraper with the following command:
```bash
php artisan app:process-scrapers
```

To run the scraper for a specific dealer, provide the dealer name as an argument:
```bash
php artisan app:process-scrapers {dealer_scraper_name}
```
Example:
```bash
php artisan app:process-scrapers manila_auto_display
```

### Available Dealer Scrapers

Currently, the following dealer scrapers are supported:
- `dashcarr_pro`
- `manila_auto_display`
- `car_empire`

### Important Note

Before running the scraper, ensure you create a new scraper instance with a "pending" status in the scraper management page.

## Automating the Scraper

To automate the scraping job, add the following entry to your crontab:
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
