import axios from "axios";

export function fetchUsers(payload = {}) {
    return axios.get(route("users.get", payload));
}

export function fetchActivityLogs(payload = {}) {
    return axios.get(route("activity-logs.get", payload));
}
