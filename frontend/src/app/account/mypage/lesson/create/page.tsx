'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getCenterList, getProfile, getUser } from "@/app/API/UserAPI";
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import AlertModal from "@/app/Global/component/AlertModal";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import dynamic from "next/dynamic";
import StaticTimePickerLandscape from "@/app/Global/component/TimePicker";
import { Dayjs } from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus} from "@fortawesome/free-solid-svg-icons";

const DatePickerComponent = dynamic(() => import('../../../../Global/component/DatePicker'), { ssr: false });

interface LessonProps {
    centerId: number,
    name: string,
    content: string,
    startDate: Date,
    endDate: Date,
}

export default function Page(props: LessonProps) {

    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [centerList, setCenterList] = useState([] as any[]);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [centerId, setCenterId] = useState(props.centerId);
    const [lessonName, setLessonName] = useState(props.name);
    const [lessonContent, setLessonContent] = useState(`휴무일: ex) 월,금 \n\n\n내용:\n\n\n최대 인원:`);
    const [lessonStartDate, setLessonStartDate] = useState(props.startDate);
    const [lessonEndDate, setLessonEndDate] = useState(props.endDate);

    const handleStartTimeChange = (newStartTime: Dayjs | null) => {
        setStartTime(newStartTime);
    };

    const handleEndTimeChange = (newEndTime: Dayjs | null) => {
        setEndTime(newEndTime);
    };

    const [selectedCenter, setSelectedCenter] = useState('');

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    if (r.role === 'USER') {
                        showAlert('접근할 수 없는 페이지 입니다.', '/');
                    }
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                                console.log(r);
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const handleChange = (event: any) => {
        setSelectedCenter(event.target.value);
    };

    function typeTransfer(type: string) {
        let typeName: string | null;

        switch (type) {
            case 'GYM':
                typeName = '헬스장';
                break;
            case 'SWIMMING_POOL':
                typeName = '수영장';
                break;
            case 'SCREEN_GOLF':
                typeName = '스크린 골프장';
                break;
            case 'LIBRARY':
                typeName = '도서관';
                break;
            default:
                typeName = '';
        }
        return typeName;
    }

    const handleDateChange = (newValue: DateValueType) => {
        if (newValue && typeof newValue === 'object' && 'startDate' in newValue && 'endDate' in newValue) {
            const { startDate, endDate } = newValue;
            setStartDate(startDate ? new Date(startDate) : null);
            setEndDate(endDate ? new Date(endDate) : null);
        } else {
            console.log("Unhandled DateValueType:", newValue);
        }
    };

    const formatDate = (date: Date | null) => {
        return date ? date.toLocaleDateString() : '없음';
    };

    const handleChangeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLessonContent(event.target.value);
    };


    return (
        <Profile user={user} profile={profile}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>레슨</label> 등록</label>
                <div className="mt-9 w-[1300px] border-2 h-[640px] rounded-lg flex">
                    <div className="ml-5 mt-5 w-[50%]  flex flex-col">
                        <div className="text-secondary text-lg font-bold">문화 센터<span className="text-white">목록</span></div>
                        <select
                            className="mt-5 font-bold text-white select select-bordered w-full max-w-xs"
                            value={selectedCenter}
                            onChange={handleChange}
                        >
                            <option className="text-black font-bold" value="" disabled>
                                문화 센터 목록
                            </option>
                            {centerList.map((center) => (
                                <option className="text-black" key={center.id} value={center.id}>
                                    {typeTransfer(center.type)}
                                </option>
                            ))}
                        </select>
                        <div className="mt-6">
                            <div className="text-secondary text-lg font-bold">레슨 <span className="text-white">시작 및 종료일</span></div>
                            <div className="w-[300px] mt-5">
                                <DatePickerComponent onDateChange={handleDateChange} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="text-secondary text-lg font-bold">레슨 <span className="text-white">시간 설정</span></div>
                            <div className="w-[800px] mt-5">
                                <StaticTimePickerLandscape
                                    onStartTimeChange={handleStartTimeChange}
                                    onEndTimeChange={handleEndTimeChange} />
                            </div>
                        </div>
                    </div>
                    <div className="mr-5 mt-5 w-[50%]  flex flex-col">
                        <input placeholder="레슨 제목을 작성해주세요" value={lessonName} type="text" className="h-[50px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <textarea name="content" id="content" onChange={handleChange} value={lessonContent} className=" mt-5 h-[450px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        <button className="mt-[20px] btn btn-active btn-secondary text-lg text-black">
                            <FontAwesomeIcon icon={faPlus} size="lg" />레슨 등록
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Profile>
    );
}
