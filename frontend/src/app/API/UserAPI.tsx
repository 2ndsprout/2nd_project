import exp from 'constants';
import { getAPI } from './AxiosAPI';


export const UserApi = getAPI();

UserApi.interceptors.request.use(
    (config) => {
        const TOKEN_TYPE = localStorage.getItem('tokenType');
        const ACCESS_TOKEN = localStorage.getItem('accessToken');
        const REFRESH_TOKEN = localStorage.getItem('refreshToken');
        config.headers['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
        config.headers['REFRESH_TOKEN'] = REFRESH_TOKEN;
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);
// 토큰 유효성 검사
UserApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest._retry)
        if (error.response.status === 401 && (error.response.data == '' || error.response.data == null)) {
            await refreshAccessToken();
            return UserApi(originalRequest);
        } else if (error.response.status === 403 && (error.response.data == '' || error.response.data == null)) {
            localStorage.clear();
            window.location.href = '/account/login';
            return;
        }
    return Promise.reject(error);
});
// 토큰 갱신
const refreshAccessToken = async () => {
    const response = await UserApi.get('/api/auth/refresh');
    const TOKEN_TYPE = localStorage.getItem('tokenType');
    const ACCESS_TOKEN = response.data;
    localStorage.setItem('accessToken', ACCESS_TOKEN);
    UserApi.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
}

export const getUser = async () => {
    const response = await UserApi.get('/api/user');
    return response.data;
}
interface UpdateProps {
    email: string,
    password: string,
    newPassword: string,
    url: string
}
export const updateUser = async (data: UpdateProps) => {
    const response = await UserApi.put('/api/user', data);
    return response.data;
}
export const updateUserPassword = async (data: UpdateProps) => {
    const response = await UserApi.put('/api/user/password', data);
    return response.data;
}
export const deleteUser = async () => {
    await UserApi.delete('/api/user');
}

interface postApt {
    roadAddress: string,
    aptName: string,
    x: number,
    y: number;
}

export const postPayment = async (data: postApt) => {
    const response = await UserApi.post('/api/apt', data);
    return response.data;
}
