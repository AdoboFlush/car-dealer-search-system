import axios from "axios";

export function fetchScraperProcesses(payload = {}) {
    return axios.get(route("scraper-processes.get", payload));
}
