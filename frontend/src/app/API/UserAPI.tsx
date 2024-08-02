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
        return Promise.reject(error);
    }
);
// 토큰 유효성 검사
UserApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (!originalRequest._retry)
        if (error.response.status === 401 && error.response.data == 'refresh') {
            await refreshAccessToken();
            return UserApi(originalRequest);
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
    const response = await UserApi.get('/api/auth/refresh');
    const TOKEN_TYPE = localStorage.getItem('tokenType');
    const ACCESS_TOKEN = response.data;
    localStorage.setItem('accessToken', ACCESS_TOKEN);
    UserApi.defaults.headers.common['Authorization'] = `${TOKEN_TYPE} ${ACCESS_TOKEN}`;
}
// User
interface RegisterProps {
    name: string,
    aptId: number,
    aptNumber: number,
    password: string,
    email: string,
    role: number,
    min: number,
    max: number,
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
    const response = await UserApi.get('/api/user/detail', { headers: { 'Username': data } });
    return response.data;
}

export const getUserList = async (data: number, page?: number) => {
    const response = await UserApi.get('/api/user/list', { headers: { 'AptId': data , 'Page': page} });

    return response.data;
}
interface UpdateProps {
    name: string,
    email: string,
    password: string,
    newPassword1: string,
    newPassword2: string,

}

// // 유저정보 수정
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
// Profile
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

export const updateProfile = async (data: UpdateProfileProps) => {
    const response = await UserApi.put('/api/profile', data);
    return response.data;
}

export const deleteProfile = async () => {
    await UserApi.delete('/api/profile');
}

// Image

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
    await UserApi.delete('/api/image/list');
}

export const saveProfileImage = async (data: any) => {
    const response = await UserApi.post('/api/image/profile', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

// Apt
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

// Category
export interface CategoryProps {
    id: number,
    name: string
}

interface UpdateCategoryProps {
    id: number,
    name: string
}

export const getCategoryList = async () => {
    const response = await UserApi.get('/api/category/list');
    return response.data;
}

export const postCategory = async (data: CategoryProps) => {
    const response = await UserApi.post('/api/category', data);
    return response.data;
}

export const updateCategory = async (data: UpdateCategoryProps) => {
    const response = await UserApi.put('/api/category', data);
    return response.data;
}

export const deleteCategory = async (data: number) => {
    await UserApi.delete('/api/category', { headers: { 'CategoryId': data } });

}

export const getCategory = async (data: number) => {
    const response = await UserApi.get('/api/category', { headers: { 'CategoryId': data } });
    return response.data;
}

// Article


export const getArticleList = async (categoryId: number, aptId?: number, page?: number) => {
    const response = await UserApi.get('/api/article/list', { headers: { 'CategoryId': categoryId, 'AptId': aptId, 'Page': page } });

    return response.data;
}

export const getArticle = async (data: number) => {
    const response = await UserApi.get('/api/article', { headers: { 'ArticleId': data } });
    return response.data
}

interface PostArticleProps {
    title: string;
    content: string;
    categoryId: number;
    tagName: string[];
    topActive: boolean;
}

export const postArticle = async (data: PostArticleProps) => {
    const response = await UserApi.post(`/api/article`, data);
    return response.data;
}

interface UpdateArticleProps {
    categoryId: number;
    articleId: number;
    title: string;
    content: string;
    topActive?: boolean;
    articleTagId?: number[];
}

export const updateArticle = async (data: UpdateArticleProps) => {
    const response = await UserApi.put(`/api/article`, data);
    return response.data;
}

export const getTopArticleList = async (data: number) => {
    const response = await UserApi.get('/api/article/topActive', { headers: { 'CategoryId': data } });
    return response.data;
}

export const deleteArticle = async (data: number) => {
    await UserApi.delete('/api/article', { headers: { 'ArticleId': data } });
}

interface SearchArticleParams {
    page: number;
    keyword: string;
    sort: number;
    categoryId?: number;
    aptId?: number;
}

export const searchArticles = async ({ page, keyword, sort, categoryId, aptId }: SearchArticleParams) => {
    try {
        const headers: { [key: string]: string } = {
            'Page': page.toString(),
            'Keyword': encodeURIComponent(keyword),
            'Sort': sort.toString()
        };

        if (categoryId !== undefined) {
            headers['CategoryId'] = categoryId.toString();
        }

        if (aptId !== undefined) {
            headers['AptId'] = aptId.toString();
        }

        const response = await UserApi.get('/api/article/search', { headers });
        return response.data;
    } catch (error) {
        console.error('Error in searchArticles:', error);
        throw error;
    }
};


// Tag

// Tag
interface TagProps {
    name: string
}

export const postTag = async (data: TagProps) => {
    const response = await UserApi.post('/api/tag', data);
    return response.data;
}

export const getTag = async (data: number) => {
    const response = await UserApi.get('/api/tag', { headers: { 'tagId': data } });
    return response.data;
}

// export const deleteTag = async (data: number) => {
//     await UserApi.delete('/api/tag', {headers: {'tagId': data}});
// }
// Love
interface LoveResponseDTO {
    isLoved: boolean;
    count: number;
}

export const toggleLove = async (articleId: number): Promise<LoveResponseDTO> => {
    try {
        const response = await UserApi.post('/api/love/toggle', null, {
            headers: { 'ArticleId': articleId }
        });
        return response.data;
    } catch (error) {
        console.error('Error toggling love:', error);
        throw error;
    }
};

export const getLoveInfo = async (articleId: number): Promise<LoveResponseDTO> => {
    try {
        const response = await UserApi.get('/api/love/info', {
            headers: { 'ArticleId': articleId }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting love info:', error);
        throw error;
    }
};

// Center
interface CenterProps {
    type: number,
    startDate: Date,
    endDate: Date
}

export const postCenter = async (data: CenterProps) => {
    const response = await UserApi.post('/api/center', data);
    return response.data;
}

export const getCenter = async (data: number) => {
    const response = await UserApi.get('/api/center', { headers: { 'CenterId': data } });
    return response.data;
}

export const getCenterList = async () => {
    const response = await UserApi.get('/api/center/list');
    return response.data;
}

interface UpdateCenterProps {
    id: number,
    type: number,
    startDate: Date,
    endDate: Date,
    key: string[],
}

export const updateCenter = async (data: UpdateCenterProps) => {
    const response = await UserApi.put('/api/center', data);
    return response.data;
}

export const deleteCenter = async (data: number) => {
    await UserApi.delete('/api/center', { headers: { 'CenterId': data } });
}

// Lesson
interface LessonProps {
    centerId: number,
    name: string,
    content: string,
    startDate: Date,
    endDate: Date,
}

export const postLesson = async (data: LessonProps) => {
    const response = await UserApi.post('/api/lesson', data);
    return response.data;
}

export const getLesson = async (data: number) => {
    const response = await UserApi.get('/api/lesson', { headers: { 'LessonId': data } });
    return response.data;
}

export const getLessonList = async (data: number, page: number) => {
    const response = await UserApi.get('/api/lesson/list', { headers: { 'CenterId': data, 'Page': page } });
    return response.data;
}

export const getMyLessonList = async () => {
    const response = await UserApi.get('/api/lesson/user/my/list');
    return response.data;
}

export const getStaffLessonList = async (data: number) => {
    const response = await UserApi.get('/api/lesson/staff', { headers: { 'CenterId': data } });
    return response.data;
}
interface UpdateLessonProps {
    id: number,
    centerId: number,
    name: string,
    content: string,
    startDate: Date,
    endDate: Date,
}

export const updateLesson = async (data: UpdateLessonProps) => {
    const response = await UserApi.put('/api/lesson', data);
    return response.data;
}

export const deleteLesson = async (data: number) => {
    await UserApi.delete('/api/lesson', { headers: { 'LessonId': data } });
}

// Comment
export interface CommentProps {
    articleId: number,
    content: string,
    parentId: number | null
}

export const postComment = async (data: CommentProps) => {
    const response = await UserApi.post('/api/comment', data);
    return response.data;
}

export interface UpdateCommentProps {
    profileId: number,
    commentId: number,
    content: string
}

export const updateComment = async (data: UpdateCommentProps) => {
    const response = await UserApi.put('/api/comment', data);
    return response.data;
}

export const deleteComment = async (data: number) => {
    await UserApi.delete('/api/comment', { headers: { 'CommentId': data } });
}

export interface GetCommentListProps {
    articleId: number;
    page: number;
}

export const getCommentList = async ({ articleId, page }: GetCommentListProps) => {
    const response = await UserApi.get('/api/comment/list', { headers: { 'ArticleId': articleId, 'Page': page } });
    return response.data;
}

// Lesson Request

interface LessonRequestProps {
    id: number | null,
    lessonId: number,
    type: number
}

export const updateLessonRequest = async (data: LessonRequestProps) => {
    const response = await UserApi.put('/api/lesson/user', data);
    return response.data;
}

export const deleteLessonRequest = async (data: number) => {
    await UserApi.delete('/api/lesson/user', { headers: { 'LessonUserId': data } });
}

export const postLessonRequest = async (data: LessonRequestProps) => {
    const response = await UserApi.post('/api/lesson/user', data);
    return response.data;
}

export const getLessonRequest = async (data: number) => {
    const response = await UserApi.get('/api/lesson/user', { headers: { 'LessonUserId': data } });
    return response.data;
}

export const getLessonRequestList = async () => {
    const response = await UserApi.get('/api/lesson/my/list');
    return response.data;
}

export const getLessonRequestListByStaff = async (type : number, id:number) => {
    const response = await UserApi.get('/api/lesson/user/staff/list', { headers: {'LessonId':id, 'Type': type } });
    return response.data;
}

