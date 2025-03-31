import axios from "axios";

export function fetchRoles(payload = {}) {
    return axios.get(route("roles-permissions.roles", payload));
}

export function fetchRolePermissions(payload = {}) {
    return axios.get(route("roles-permissions.permissions", payload));
}
