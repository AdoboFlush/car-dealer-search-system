import axios from "axios";

export function fetchGuestCars(payload = {}) {
    return axios.get(route("guest.cars.get", payload));
}

export function fetchCars(payload = {}) {
    return axios.get(route("cars.get", payload));
}
