import { getAPI } from './AxiosAPI';

export const NonUserApi = getAPI();
NonUserApi.interceptors.request.use(
    (config) => {
        const TOKEN_TYPE = localStorage.getItem('tokenType');
        const ACCESS_TOKEN = localStorage.getItem('accessToken');
        const REFRESH_TOKEN = localStorage.getItem('refreshToken');
        const PROFILE_ID = localStorage.getItem('PROFILE_ID');
        config.headers['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
        config.headers['REFRESH_TOKEN'] = REFRESH_TOKEN;
        config.headers['PROFILE_ID'] = `${PROFILE_ID}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// 토큰 유효성 검사
NonUserApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest._retry)
        if (error.response.status === 401 && error.response.data == 'refresh') {
            await refreshAccessToken();
            return NonUserApi(originalRequest);
        } else if (error.response.status === 403 && error.response.data == 'logout') {
            localStorage.clear();
            window.location.href = '/account/login';
            return;
        } else if (error.response.status === 403 && error.response.data == 'unknown profile') {
            window.location.href = '/account/profile';
            return;
        }
    console.log(error);
    return Promise.reject(error);
});
// 토큰 갱신
const refreshAccessToken = async () => {
    const response = await NonUserApi.get('/api/auth/refresh');
    const TOKEN_TYPE = localStorage.getItem('tokenType');
    const ACCESS_TOKEN = response.data;
    localStorage.setItem('accessToken', ACCESS_TOKEN);
    NonUserApi.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
}

interface proposeProps {
    id?: number,
    title: string,
    roadAddress: string,
    aptName: string,
    min: number,
    max: number,
    h: number,
    w: number
    password?: string,
    proposeStatus?: number
}

export const postPropose = async (data: proposeProps) => {
    const response = await NonUserApi.post('/api/propose', data);
    return response.data;
}

export const getProposeList = async (data?: number) => {
    const response = await NonUserApi.get('/api/propose/list', {headers: {'page': data}});
    return response.data;
}

export const getPropose = async (id: number, password?: string) => {
    const response = await NonUserApi.get('api/propose', {headers: {'ProposeId': id, 'Password': password}});
    return response.data;
}

export const updatePropose = async (data: proposeProps) => {
    const response = await NonUserApi.put('/api/propose', data);
    return response.data;
}