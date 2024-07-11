import exp from 'constants';
import { getAPI } from './AxiosAPI';


export const UserApi = getAPI();

UserApi.interceptors.request.use(
    (config) => {
        const TOKEN_TYPE = localStorage.getItem('tokenType');
        const ACCESS_TOKEN = localStorage.getItem('accessToken');
        const REFRESH_TOKEN = localStorage.getItem('refreshToken');
        const PROFILE_ID = localStorage.getItem('profileId');
        config.headers['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
        config.headers['REFRESH_TOKEN'] = REFRESH_TOKEN;
        config.headers['PROFILE_ID'] = PROFILE_ID;
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
        } else if (error.response.status === 403 && (error.response.data == '' || error.response.data == null)) {
            window.location.href = '/account/profile';
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

interface RegisterProps {
    name: string,
    aptId: number,
    aptNumber: number,
    password: string,
    email: string,
    role: number
    h: number,
    w: number
}
export const register = async (data: RegisterProps) => {
    const response = await UserApi.post('/api/user', data);
    return response.data;
}
export const registerGroup = async (data: RegisterProps) => {
    const response = await UserApi.post('/api/user/group', data);
    return response.data;
}
// 유저정보 가져오기
export const getUser = async () => {
    const response = await UserApi.get('/api/user');
    return response.data;
}
export const getUserList = async (data: number) => {
    const response = await UserApi.get('/api/user/list', { headers: { 'aptId': data } });
    return response.data;
}
interface UpdateProps {
    email: string,
    password: string,
    newPassword: string,
    url: string
}
// 유저정보 수정
export const updateUser = async (data: UpdateProps) => {
    const response = await UserApi.put('/api/user', data);
    return response.data;
}
// 비밀번호 수정
export const updateUserPassword = async (data: UpdateProps) => {
    const response = await UserApi.put('/api/user/password', data);
    return response.data;
}
// 유저 삭제
export const deleteUser = async () => {
    await UserApi.delete('/api/user');
}

interface ProfileProps {
    id: number,
    name: string,
    url: string,
}

export const postProfile = async (data: ProfileProps) => {
    const response = await UserApi.post('/api/user/profile', data);
    return response.data;
}

export const getProfileList = async () => {
    const response = await UserApi.get('/api/user/profile');
    return response.data;
}

export const getProfile = async (data: number) => {
    const response = await UserApi.get('/api/user/profile', { headers: { 'profileId': data } });
    return response.data;
}

export const upateProfile = async (data: ProfileProps) => {
    const response = await UserApi.put('/api/user/profile', data);
    return response.data;
}


export const deleteImage = async () => {
    const response = await UserApi.delete('/api/image');
    return response.data;
}
export const saveImage = async (data: any) => {
    const response = await UserApi.post('/api/image', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}
export const saveImageList = async (data: any) => {
    const response = await UserApi.post('/api/image/list', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}
export const deleteImageList = async () => {
    const response = await UserApi.delete('/api/image/list');
    return response.data;
}

interface AptProps {
    id: number,
    roadAddress: string,
    aptName: string,
    x: number,
    y: number;
}
// 아파트 등록
export const postApt = async (data: AptProps) => {
    const response = await UserApi.post('/api/apt', data);
    return response.data;
}

export const updateApt = async (data: AptProps) => {
    const response = await UserApi.put('/api/apt', data);
    return response.data;
}

export const getAptList = async () => {
    const response = await UserApi.get('/api/apt/list');
    return response.data;
}

export const getApt = async (data: number) => {
    const response = await UserApi.get('/api/apt', { headers: { 'aptId': data } });
    return response.data;
}

interface CategoryProps {
    name: string
}

export const postCategory = async (data: CategoryProps) => {
    const response = await UserApi.post('/api/category', data);
    return response.data;
}

export const deleteCategory = async (data: number) => {
    await UserApi.delete('/api/category', {headers: {'categoryId': data}});

}