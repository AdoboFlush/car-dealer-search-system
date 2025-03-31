import axios from "axios";

export function fetchPosts(payload = {}) {
    return axios.get(route("guest.blogs.posts.get", payload));
}

export function fetchPostComments(payload = {}) {
    return axios.get(route("guest.blogs.posts.comments.get", payload));
}

export function fetchComments(payload = {}) {
    return axios.get(route("blogs.comments.get", payload));
}
