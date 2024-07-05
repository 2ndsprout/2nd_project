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


// interface postPayment {
//     cartItemIdList: number[];
//     recipient: string;
//     phoneNumber: string;
//     mainAddress: string;
//     addressDetail: string;
//     postNumber: string;
//     deliveryMessage: string;
//     point: number;
// }
// export const postPayment = async (data: postPayment) => {
//     const response = await UserApi.post('/api/payment/logList', data);
//     return response.data;
// }
// export const getPayment = async () => {
//     const response = await UserApi.get('/api/payment/logList');
//     return response.data;
// }
// interface postReview {
//     paymentProductId: number;
//     productId: number;
//     title: string;
//     content: string;
//     grade: number;
// }
// export const postReview = async (data: postReview) => {
//     const response = await UserApi.post('/api/review', data);
//     return response.data;
// }
// export const getMyReviews = async () => {
//     const response = await UserApi.get('/api/review/my');
//     return response.data;
// }
// interface putReview {
//     reviewId: number;
//     paymentProductId: number;
//     title: string;
//     content: string;
//     grade: number;
// }
// export const putReview = async (data: putReview) => {
//     const response = await UserApi.put('/api/review', data);
//     return response.data;
// }
// export const getMyProducts = async () => {
//     const response = await UserApi.get('/api/product/myProducts');
//     return response.data;
// }
// interface question {
//     productId: number;
//     title: string;
//     content: string;
// }

// export const postQuestion = async (data: question) => {
//     const response = await UserApi.post('/api/product/question', data);
//     return response.data;
// }
// interface answer {
//     productId: number;
//     answer: string;
//     productQAId: number;
// }
// export const postAnswer = async (data: answer) => {
//     const response = await UserApi.post('/api/product/answer', data);
//     return response.data;
// }

// interface postEvent {
//     startDate: Date;
//     endDate: Date;
//     discount: number;
//     productIdList: number[];
// }

// export const postEvent = async (data: postEvent) => {
//     const response = await UserApi.post('/api/event', data);
//     return response.data;
// }
// interface updateEvent {
//     eventId: number;
//     startDate: Date;
//     endDate: Date;
//     discount: number;
//     productIdList: number[];
// }

// export const updateEvent = async (data: updateEvent) => {
//     const response = await UserApi.put('/api/event', data);
//     return response.data;
// }

// export const getEventList = async () => {
//     const response = await UserApi.get('/api/event/list');
//     return response.data;
// }

// interface postArticle {
//     title: String;
//     content: String;
//     type: number;
// }

// export const postArticle = async (data: postArticle) => {
//     const response = await UserApi.post('/api/article', data);
//     return response.data;
// }

// export const deleteArticle = async (data: number) => {
//     const response = await UserApi.delete('/api/article', { headers: { ArticleId: data } });
//     return response.data;
// }

// interface putArticle {
//     articleId: number;
//     title: String;
//     content: String;
//     type: number;
// }

// export const updateArticle = async (data: putArticle) => {
//     const response = await UserApi.put('/api/article', data);
//     return response.data;
// }

// export const getChatRoom = async (data: string) => {
//     const response = await UserApi.get('/api/chat', { headers: { Username: data } });
//     return response.data;
// }

// export const getChatRoomList = async () => {
//     const response = await UserApi.get('/api/chat/rooms');
//     return response.data;
// }

// export const getChatList = async (data: number) => {
//     const response = await UserApi.get('/api/chat/chats', { headers: { roomId: data } });
//     return response.data;
// }

// export const saveChatImage = async (data: any) => {
//     const response = await UserApi.post('/api/image/chat', data, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
//     return response.data;
// }