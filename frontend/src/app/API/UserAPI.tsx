import { getAPI } from './AxiosAPI';


export const UserApi = getAPI();

UserApi.interceptors.request.use(
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
    console.log(error);
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
//본인 로그인 정보 가져오기
export const getUser = async () => {
    const response = await UserApi.get('/api/user');
    return response.data;

}
// 유저정보 가져오기(어드민)
export const getUserDetail = async (data: string) => {
    const response = await UserApi.get('/api/user/detail', { headers: {'Username': data}});
    return response.data;
}
export const getUserList = async (data: number) => {
    const response = await UserApi.get('/api/user/list', { headers: { 'AptId': data } });
    return response.data;
}
interface UpdateProps {
    name: string,
    aptId: number,
    aptNumber: number,
    email: string,
    password: string,
    role: number
}
interface UpdateEmailProps {
    email: string
}

export const updateEmail = async (data: UpdateEmailProps) => {
    const response = await UserApi.put('/api/user', data);
    return response.data;
}
// // 유저정보 수정
// export const updateUser = async (data: UpdateProps) => {
//     const response = await UserApi.put('/api/user', data);
//     return response.data;
// }
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
    name: string,
    url: string,
}

interface UpdateProfileProps {
    id: number,
    name: string,
    url: string
}

export const postProfile = async (data: ProfileProps) => {
    const response = await UserApi.post('/api/profile', data);
    return response.data;
}

export const getProfileList = async () => {
    const response = await UserApi.get('/api/profile/list');
    return response.data;
}

export const getProfile = async () => {
    const response = await UserApi.get('/api/profile');
    return response.data;
}

export const upateProfile = async (data: UpdateProfileProps) => {
    const response = await UserApi.put('/api/profile', data);
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
    const response = await UserApi.get('/api/apt', { headers: { 'AptId': data } });
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
    await UserApi.delete('/api/category', {headers: {'CategoryId': data}});

}

// Article

export const getArticleList = async ( categoryId: number ) => {
    const response = await UserApi.get('/api/article', { headers: { CategoryId: categoryId } });
    console.log("Sending request with CategoryId:", categoryId);
    return response.data;
}


export const getArticle = async ( data: number ) => {
    const response = await UserApi.get('/api/article', { headers: { 'ArticleId': data }} );
    console.log("Sending request with ArticleId:", data);
    return response.data
}


interface PostArticleProps {
    title: string;
    content: string;
    categoryId: number;
}

export const postArticle = async (data: PostArticleProps) => {
    const response = await UserApi.post(`/api/article`, data);
    console.log("Sending request with ArticleId:", data);
    return response.data;
}

// Tag

interface TagProps {
    name: string
}

export const postTag = async (data: TagProps) => {
    const response = await UserApi.post('/api/tag', data);
    return response.data;
}

export const getTagList = async (data: number) => {
    const response = await UserApi.get('/api/tag/list', {headers: {'articleId': data}});
    return response.data;
}

export const getTag = async (data: number) => {
    const response = await UserApi.get('/api/tag', {headers: {'tagId': data}});
    return response.data;
}

export const deleteTag = async (data: number) => {
    await UserApi.delete('/api/tag', {headers: {'tagId': data}});
}