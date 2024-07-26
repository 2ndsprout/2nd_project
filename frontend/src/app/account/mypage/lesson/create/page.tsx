'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getCenterList, getProfile, getUser, postLesson } from "@/app/API/UserAPI";
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import AlertModal from "@/app/Global/component/AlertModal";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import dynamic from "next/dynamic";
import StaticTimePickerLandscape from "@/app/Global/component/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { start } from "repl";

const DatePickerComponent = dynamic(() => import('../../../../Global/component/DatePicker'), { ssr: false });

export default function Page() {

    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [centerList, setCenterList] = useState([] as any[]);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [startDate, setStartDate] = useState(null as any);
    const [endDate, setEndDate] = useState(null as any);
    const [startTime, setStartTime] = useState<Dayjs | string>('');
    const [endTime, setEndTime] = useState<Dayjs | string>('');
    const [centerId, setCenterId] = useState(0);
    const [centerError, setCenterError] = useState('문화센터를 설정해주세요.');
    const [isLoading, setIsLoading] = useState(false);
    const [lessonName, setLessonName] = useState('');
    const [nameError, setNameError] = useState('레슨 제목을 작성해주세요.');
    const [lessonContent, setLessonContent] = useState(`휴무일: ex) 월,금 \n\n\n내용:\n\n\n최대 인원:`);
    const [contentError, setContentError] = useState('레슨 내용을 입력해주세요.');
    const [lessonStartDate, setLessonStartDate] = useState(null as any);
    const [dateError, setDateError] = useState('날짜를 선택해주세요.');
    const [startTimeError, setStartTimeError] = useState('시작 시간을 설정해 주세요.');
    const [endTimeError, setEndTimeError] = useState('종료 시간을 설정해 주세요.');
    const [first, setFirst] = useState(true);
    const [lessonEndDate, setLessonEndDate] = useState(null as any);
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
                                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 300);
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

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedCenter(value);
        setCenterId(Number(value));

        if (value === '') {
            setCenterError('문화 센터를 선택해주세요.');
        } else {
            setCenterError('');
        }
    };

    const isInitialValue = (value: string) => {
        return value === `휴무일: ex) 월,금 \n\n\n내용:\n\n\n최대 인원:`;
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
                typeName = '문화센터가 존재하지 않습니다.';
        }
        return typeName;
    }
    const allErrors = () => {
        if (centerError) return centerError;
        if (dateError) return dateError;
        if (startTimeError) return startTimeError;
        if (endTimeError) return endTimeError;
        if (nameError) return nameError;
        if (contentError) return contentError;
        return '';
    };

    const handleDateChange = (newValue: DateValueType | string) => {
        console.log(startDate, endDate);

        if (typeof newValue === 'object' && newValue !== null) {
            // Date 객체가 있는 경우
            const startISO = newValue.startDate ? newValue.startDate : null;
            const endISO = newValue.endDate ? newValue.endDate : null;
            setStartDate(startISO);
            setEndDate(endISO);
            setDateError('');

        } else if (typeof newValue === 'string') {
            // 문자열 오류 메시지 처리
            setDateError(newValue);
            console.log("Error message received:", newValue);
        } else {
            console.log("Unhandled DateValueType:", newValue);
        }
    };


    const handleStartTimeChange = (time: Dayjs | string) => {
        // 문자열인 경우 Dayjs 객체로 변환
        const dayjsTime = typeof time === 'string' ? dayjs(time) : time;
        setStartTime(dayjsTime.format('HH:mm:ss')); // 포맷된 시간 문자열 출력
    };

    const handleEndTimeChange = (time: Dayjs | string) => {
        const dayjsTime = typeof time === 'string' ? dayjs(time) : time;
        setEndTime(dayjsTime.format('HH:mm:ss')); // 포맷된 시간 문자열 출력
    };

    const handleStartTimeError = (error: string) => {
        setStartTimeError(error);
        if (error == '')
            setStartTimeError('');
    };

    const handleEndTimeError = (error: string) => {
        setEndTimeError(error);
        if (error == '')
            setEndTimeError('');
    };

    const submit = () => {
        const lessonStartDateString = `${startDate}T${startTime}`;
        const lessonEndDateString = `${endDate}T${endTime}`;
        setLessonStartDate(lessonStartDateString);
        setLessonEndDate(lessonEndDateString);
    };

    useEffect(() => {
        if (lessonStartDate && lessonEndDate) {
            postLesson({ centerId, startDate: lessonStartDate, endDate: lessonEndDate, name: lessonName, content: lessonContent })
                .then(() => {
                    closeConfirm();
                    showAlert('레슨 등록이 완료되었습니다.', '/account/mypage/lesson/log/');
                })
                .catch(e => showAlert(allErrors() || e));
        }
    }, [lessonStartDate, lessonEndDate]);

    return (
        <Profile user={user} profile={profile} isLoading={isLoading}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>레슨</label> 등록</label>
                <div className="mt-9 w-[1300px] border-2 h-[640px] rounded-lg flex">
                    <div className="ml-5 mt-5 w-[50%]  flex flex-col">
                        <div className="text-secondary text-lg font-bold">문화 센터<span className="text-white">목록</span></div>
                        <select
                            className="mt-5 font-bold text-white select select-bordered w-full max-w-xs"
                            value={selectedCenter}
                            onChange={e => {
                                handleSelectChange(e);  // handleChange 함수를 호출합니다.
                            }}
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
                                    onEndTimeChange={handleEndTimeChange}
                                    onStartTimeError={handleStartTimeError}
                                    onEndTimeError={handleEndTimeError} />
                            </div>
                        </div>
                    </div>
                    <div className="mr-5 mt-5 w-[50%]  flex flex-col">
                        <div className="text-white font-xs">{allErrors()}</div>
                        <input placeholder="레슨 제목을 작성해주세요"
                            type="text"
                            value={lessonName}
                            onFocus={e => {
                                if ((e.target as HTMLInputElement).value == '')
                                    setNameError('레슨 제목을 작성해주세요.');
                                else setNameError('')
                            }}
                            onKeyUp={e => {
                                if ((e.target as HTMLInputElement).value == '')
                                    setNameError('레슨 제목을 작성해주세요');
                                else setNameError('')
                            }}
                            onChange={e => {
                                setLessonName(e.target.value);
                                if (first) setFirst(false);
                                if ((e.target as HTMLInputElement).value == '')
                                    setNameError('레슨 제목을 작성해주세요');
                                else setNameError('')
                            }}
                            className="h-[50px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                        <textarea
                            name="content"
                            id="content"
                            defaultValue={lessonContent}
                            onFocus={(e) => {
                                const value = (e.target as HTMLTextAreaElement).value;
                                if (value.length <= 24 || isInitialValue(value)) {
                                    setContentError('레슨 내용을 작성해주세요.');
                                } else {
                                    setContentError('');
                                }
                            }}
                            onKeyUp={(e) => {
                                const value = (e.target as HTMLTextAreaElement).value;
                                if (value.length <= 24 || isInitialValue(value)) {
                                    setContentError('레슨 내용을 작성해주세요');
                                } else {
                                    setContentError('');
                                }
                            }}
                            onChange={(e) => {
                                const value = (e.target as HTMLTextAreaElement).value;
                                setLessonContent(value);
                                if (first) {
                                    setFirst(false);
                                }
                                if (value.length <= 24 || isInitialValue(value)) {
                                    setContentError('레슨 내용을 작성해주세요');
                                } else {
                                    setContentError('');
                                }
                            }}
                            className="mt-5 h-[450px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button className="mt-[20px] btn btn-active btn-secondary text-lg text-black"
                            disabled={first || !!allErrors()}
                            onClick={() => finalConfirm(lessonName, '해당 레슨을 등록 하시겠습니까?', '등록', submit)}>
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
