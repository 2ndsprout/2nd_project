import axios from 'axios';

export function getAPI() {
    const api = axios.create({
        // baseURL: 'http://3.39.93.40:8080',
        baseURL: 'http://localhost:8080',
        headers: {
            'Content-Type': 'application/json;charset=utf-8;',
            'Cache-Control': 'no-store',
            Pragma: 'no-store',
            Expires: '0',
        },
    });
    return api;
}

