import { getAPI } from './AxiosAPI';

export const NonUserApi = getAPI();

interface proposeProps {
    title: string,
    roadAddress: string,
    aptName: string,
    min: number,
    max: number,
    h: number,
    w: number
    password: string,
    proposeStatus: number
}

export const postPropose = async (data: proposeProps) => {
    const response = await NonUserApi.post('/api/propose', data);
    return response.data;
}