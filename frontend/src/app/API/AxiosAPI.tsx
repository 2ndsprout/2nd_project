import axios from 'axios';

export function getAPI() {
    const api = axios.create({
        // baseURL: 'http://localhost:8080',
        baseURL: 'http://15.164.75.8:8080',
        headers: {
            'Content-Type': 'application/json;charset=utf-8;',
        },
    });
    return api;
}
