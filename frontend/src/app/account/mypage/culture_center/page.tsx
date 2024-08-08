'use client'

import { use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, postCenter, saveImageList, getCenterList, deleteImageList } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import StaticTimePickerLandscape from "@/app/Global/component/TimePicker";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import dayjs, { Dayjs } from "dayjs";
import useAlert from "@/app/Global/hook/useAlert";
import AlertModal from "@/app/Global/component/AlertModal";
import Slider from "@/app/Global/component/Slider";
import { url } from "inspector";
import CenterSlider from "@/app/Global/component/CenterSlider";


export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const [urlList, setUrlList] = useState([] as any[]);
    const [startTime, setStartTime] = useState<Dayjs | string>('');
    const [endTime, setEndTime] = useState<Dayjs | string>('');
    const [startDateTime, setStartDateTime] = useState(null as any);
    const [endDateTime, setEndDateTime] = useState(null as any);
    const [centerType, setCenterType] = useState('' as any);
    const [centerTypeError, setCenterTypeError] = useState('센터 타입을 입력해주세요.');
    const [startTimeError, setStartTimeError] = useState('시작 시간을 설정해 주세요.');
    const [endTimeError, setEndTimeError] = useState('종료 시간을 설정해 주세요.');
    const { alertState, showAlert, closeAlert } = useAlert();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        console.log(r);
                        setProfile(r);
                        getCenterList()
                            .then((r) => {
                                setCenterList(r);
                                deleteImageList()
                                    .catch(e => console.log(e));
                            })
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        if (startDateTime && endDateTime) {
            const centerData = {
                type: centerType,
                startDate: startDateTime,
                endDate: endDateTime,
            };

            postCenter(centerData)
                .then(response => {
                    console.log('센터 생성 응답:', response);
                    closeConfirm();
                    showAlert('센터가 생성되었습니다.', '/account/culture_center');
                })
                .catch(error => {
                    console.error('센터 생성 오류:', error);
                    showAlert('센터 생성 중 오류가 발생했습니다.');
                });
        }
    }, [startDateTime, endDateTime]);

    function Change(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        saveImageList(formData)
            .then(r => {
                if (Array.isArray(r)) {
                    const urls = r.map((item: any) => item.value); // item.value가 URL이라면
                    setUrlList(urls);
                } else {
                    console.log('r is not an array:', r);
                }
            })
            .catch(e => console.log(e));
    }


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCenterType(Number(event.target.value));
        setCenterTypeError('');
    };


    const submit = () => {
        const now = dayjs();
        const todayDate = now.format('YYYY-MM-DD');

        const startDate = todayDate;
        const endDate = todayDate;

        const startDateString = `${startDate}T${startTime}`;
        const endDateString = `${endDate}T${endTime}`;

        setStartDateTime(startDateString);
        setEndDateTime(endDateString);
    };


    const handleStartTimeChange = (time: Dayjs | string) => {
        const dayjsTime = typeof time === 'string' ? dayjs(time, 'HH:mm') : time;
        setStartTime(dayjsTime.format('HH:mm:ss'));
    };

    const handleEndTimeChange = (time: Dayjs | string) => {
        const dayjsTime = typeof time === 'string' ? dayjs(time, 'HH:mm') : time;
        setEndTime(dayjsTime.format('HH:mm:ss'));
    };

    const handleTimeError = (errorSetter: React.Dispatch<React.SetStateAction<string>>, error: string) => {
        errorSetter(error);
    };

    const handleStartTimeError = (error: string) => handleTimeError(setStartTimeError, error);

    const handleEndTimeError = (error: string) => handleTimeError(setEndTimeError, error);

    const defaultUrls = [
        '/slider_default.png',
        '/slider_default.png',
        '/slider_default.png',
    ];

    function urls(): string[] {
        return urlList?.length === 0 ? defaultUrls : urlList;
    }

    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>센터</label> 생성</label>
                <div className="mt-9 w-[1300px] border-2 h-[700px] rounded-lg overflow-x-hidden p-[40px] items-center flex">
                    <div className="w-[600px] h-[550px] flex flex-col">
                        <div className="flex flex-row w-[600px]">
                            <select
                                id="role"
                                defaultValue={-1}
                                onChange={handleChange}
                                className="text-black text-lg w-[650px] h-[50px] bg-white border border-gray-400 rounded-lg p-2.5"
                            >
                                <option value={-1} disabled>센터 타입을 선택하세요</option>
                                <option value={0}>헬스장</option>
                                <option value={1}>수영장</option>
                                <option value={2}>스크린골프장</option>
                                <option value={3}>도서관</option>
                            </select>
                        </div>
                        <div className="w-[600px] h-[100px] justify-center items-center mt-[50px] flex flex-col">
                            <StaticTimePickerLandscape
                                onStartTimeChange={handleStartTimeChange}
                                onEndTimeChange={handleEndTimeChange}
                                onEndTimeError={handleEndTimeError}
                                onStartTimeError={handleStartTimeError} />
                        </div>
                        <div className="w-[600px] h-[330px] flex items-end">
                            <button className="w-[600px] flex h-[50px] btn btn-xl btn-accent" disabled={centerTypeError !== ''} onClick={() => finalConfirm('센터 생성', '센터를 만들겠습니까?', '생성완료', submit)}>
                                센터 생성
                            </button>
                        </div>

                    </div>
                    <div className="ml-16 h-[500px] w-[550px]">
                        {/* {urlList.map((url, urlIndex) => (
                                <img key={urlIndex} src={url} alt={`center_image_${urlIndex}`} className="w-[100px] h-[100px]" />
                            ))} */}
                        <Slider urlList={urls()} />
                        <div className="mt-2 ml-[200px]">
                            <div className="w-[150px] h-[50px] border-secondary text-black hover:bg-orange-200 hover:cursor-pointer btn bg-secondary" onClick={() => document.getElementById('file')?.click()}>이미지 첨부</div>
                            <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files?.[0])} />
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Profile>
    );
}
