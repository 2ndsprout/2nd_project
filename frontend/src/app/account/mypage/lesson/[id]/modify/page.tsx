'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { deleteImageList, getCenterList, getLesson, getProfile, getUser, saveImage, saveImageList, updateLesson } from "@/app/API/UserAPI";
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
import { faPlus, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import QuillNoSSRWrapper from "@/app/Global/component/QuillNoSSRWrapper";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { getTimeFormatting } from "@/app/Global/component/Method";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const DatePickerComponent = dynamic(() => import('@/app/Global/component/DatePicker'), { ssr: false });

export default function Page() {
    const params = useParams();
    const lessonId = Number(params?.id);
    const [url, setUrl] = useState('');
    const quillInstance = useRef<ReactQuill>(null);
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [centerList, setCenterList] = useState<any[]>([]);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [dateRange, setDateRange] = useState({ startDate: null as any, endDate: null as any });
    const [startTime, setStartTime] = useState<Dayjs | string>('');
    const [endTime, setEndTime] = useState<Dayjs | string>('');
    const [centerId, setCenterId] = useState(0);
    const [centerOpenTime, setCenterOpenTime] = useState('');
    const [centerCloseTime, setCenterCloseTime] = useState('');
    const [centerError, setCenterError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lessonName, setLessonName] = useState('');
    const [nameError, setNameError] = useState('');
    const [lessonContent, setLessonContent] = useState(``);
    const [lessonStartDate, setLessonStartDate] = useState(null as any);
    const [dateError, setDateError] = useState('');
    const [startTimeError, setStartTimeError] = useState('');
    const [endTimeError, setEndTimeError] = useState('');
    const [first, setFirst] = useState(true);
    const [lessonEndDate, setLessonEndDate] = useState(null as any);
    const [selectedCenter, setSelectedCenter] = useState('');

    const submit = () => {
        const lessonStartDateString = `${dateRange.startDate}T${startTime}`;
        const lessonEndDateString = `${dateRange.endDate}T${endTime}`;
        const now = dayjs();

        // 시작일이 현재 날짜 이전인지 확인
        if (dayjs(dateRange.startDate).isBefore(now, 'day')) {
            closeConfirm();
            showAlert('레슨 시작일은 현재 날짜 이후여야 합니다.');
            return;
        }

        // 종료일이 시작일보다 이전인지 확인
        if (dayjs(dateRange.endDate).isBefore(dayjs(dateRange.startDate), 'day')) {
            closeConfirm();
            showAlert('레슨 종료일은 레슨 시작일과 같거나 그 이후여야 합니다.');
            return;
        }

        const startTime24 = dayjs(startTime, 'HH:mm:ss');
        const endTime24 = dayjs(endTime, 'HH:mm:ss');
        const centerOpenTime24 = dayjs(centerOpenTime, 'HH:mm');
        const centerCloseTime24 = dayjs(centerCloseTime, 'HH:mm');

        // 레슨 시간이 문화센터 운영 시간 내에 있는지 확인
        if (startTime24.isBefore(centerOpenTime24) || endTime24.isAfter(centerCloseTime24)) {
            closeConfirm();
            showAlert('레슨 시간은 문화센터 운영 시간 내에 있어야 합니다.');
            return;
        }

        setLessonStartDate(lessonStartDateString);
        setLessonEndDate(lessonEndDateString);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedCenter(value);
        setCenterId(Number(value));

        if (value === '') {
            setCenterError('문화 센터를 선택해주세요.');
        } else {
            setCenterError('');
            const selectedCenter = centerList.find(center => center.id === Number(value));
            if (selectedCenter) {
                setCenterOpenTime(getTimeFormatting(selectedCenter.startDate));
                setCenterCloseTime(getTimeFormatting(selectedCenter.endDate));
            }
        }
    };

    const allErrors = () => {
        const errors = [centerError, dateError, startTimeError, endTimeError, nameError];
        return errors.find(error => error !== '') || '';
    };

    const validateInput = (value: string) => {
        const pattern = /^.{1,25}$/;
        if (pattern.test(value)) {
            setNameError('');
        } else {
            setNameError('레슨 제목은 1 ~ 25자 이내로 작성해주세요.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLessonName(value);
        validateInput(value);
        if (first) setFirst(false);
        if (value === '') setNameError('레슨 제목을 작성해주세요');
    };

    const handleDateChange = (newValue: DateValueType | string) => {
        if (typeof newValue === 'object' && newValue !== null) {
            const { startDate, endDate } = newValue;
            setDateRange({ startDate, endDate });
            setDateError('');
        } else if (typeof newValue === 'string') {
            setDateError(newValue);
        }
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

    const imageHandler = () => {
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();


        input.addEventListener('change', async () => {
            const file = input.files?.[0];

            try {
                const formData = new FormData();
                formData.append('file', file as any);
                const imgUrl = (await saveImageList(formData)).url;
                const editor = (quillInstance?.current as any).getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', imgUrl);
                editor.setSelection(range.index + 1);
            } catch (error) {
                console.log(error);
            }
        });
    };
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: '1' }, { header: '2' }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                    ['image'],
                ],
                handlers: { image: imageHandler },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [],
    );

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'align',
        'image',
    ];
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
                                getLesson(lessonId)
                                    .then(r => {
                                        console.log(r);
                                        setDateRange({
                                            startDate: dayjs(r.startDate).format('YYYY-MM-DD'),
                                            endDate: dayjs(r.endDate).format('YYYY-MM-DD'),
                                        });
                                        setStartTime(dayjs(r.startTime, 'HH:mm:ss'));
                                        setEndTime(dayjs(r.endTime, 'HH:mm:ss'));
                                        setLessonName(r.name);
                                        setLessonContent(r.content);
                                        setCenterId(r.centerResponseDTO.id);
                                        setSelectedCenter(r.centerResponseDTO.id.toString());
                                        setCenterOpenTime(getTimeFormatting(r.centerResponseDTO.startDate));
                                        setCenterCloseTime(getTimeFormatting(r.centerResponseDTO.endDate));
                                    })
                                    .catch(e => console.log(e));
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
        deleteImageList();
    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        if (lessonStartDate && lessonEndDate) {
            updateLesson({
                id: lessonId,
                centerId,
                startDate: lessonStartDate,
                endDate: lessonEndDate,
                name: lessonName,
                content: lessonContent
            })
                .then(() => {
                    closeConfirm();
                    showAlert('레슨 수정이 완료되었습니다.', '/account/mypage/lesson/manage/');
                })
                .catch(e => showAlert(allErrors() || e));
        }
    }, [lessonStartDate, lessonEndDate]);

    function typeTransfer(type: string) {
        switch (type) {
            case 'GYM':
                return '헬스장';
            case 'SWIMMING_POOL':
                return '수영장';
            case 'SCREEN_GOLF':
                return '스크린 골프장';
            case 'LIBRARY':
                return '도서관';
            default:
                return '문화센터가 존재하지 않습니다.';
        }
    }

    function convertTo12HourFormat(time: string): string {
        return dayjs(time, 'HH:mm').format('A hh:mm');
    }

    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold mb-9'>
                    <span className='text-xl text-secondary font-bold'>레슨</span> 등록
                </label>
                <div className="w-[1300px] border-2 h-[640px] rounded-lg flex">
                    <div className="ml-5 mt-5 w-[50%] flex flex-col">
                        <div className="text-secondary text-lg font-bold">
                            문화 센터<span className="text-white"> 목록</span>
                        </div>
                        <select
                            className="mt-5 font-bold text-white select select-bordered w-full max-w-xs"
                            value={selectedCenter}
                            onChange={handleSelectChange}
                        >
                            <option className="text-black font-bold" value="" disabled>
                                문화 센터 목록
                            </option>
                            {centerList.map((center) => (
                                <option
                                    className="text-black"
                                    key={center.id}
                                    value={center.id}
                                >
                                    {typeTransfer(center.type)}
                                </option>
                            ))}
                        </select>
                        {centerOpenTime && centerCloseTime && (
                            <div>{convertTo12HourFormat(centerOpenTime)} ~ {convertTo12HourFormat(centerCloseTime)}</div>
                        )}
                        <div className="mt-6">
                            <div className="text-secondary text-lg font-bold">
                                레슨 <span className="text-white">시작 및 종료일</span>
                            </div>
                            <div className="w-[300px] mt-5">
                                <DatePickerComponent
                                    startDate={dateRange.startDate ? new Date(dateRange.startDate) : null}
                                    endDate={dateRange.endDate ? new Date(dateRange.endDate) : null}
                                    onDateChange={handleDateChange}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="text-secondary text-lg font-bold">
                                레슨 <span className="text-white">시간 설정</span>
                            </div>
                            <div className="w-[800px] mt-5">
                                <StaticTimePickerLandscape
                                    onStartTimeChange={handleStartTimeChange}
                                    onEndTimeChange={handleEndTimeChange}
                                    onStartTimeError={handleStartTimeError}
                                    onEndTimeError={handleEndTimeError}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mr-5 mt-5 w-[50%] flex flex-col">
                        {allErrors() && (
                            <div className="badge badge-warning gap-2 w-[350px] p-3">
                                <span className="text-sm">
                                    <FontAwesomeIcon icon={faTriangleExclamation} /> {allErrors()}
                                </span>
                            </div>
                        )}
                        <input
                            placeholder="레슨 제목을 작성해주세요"
                            type="text"
                            value={lessonName}
                            onFocus={(e) => {
                                validateInput(e.target.value);
                                if (e.target.value === '') setNameError('레슨 제목을 작성해주세요.');
                            }}
                            onKeyUp={(e) => {
                                validateInput((e.target as HTMLInputElement).value);
                                if ((e.target as HTMLInputElement).value === '') setNameError('레슨 제목을 작성해주세요');
                            }}
                            onChange={handleInputChange}
                            className="h-[50px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <div className="mt-5 h-[450px] block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <QuillNoSSRWrapper
                                forwardedRef={quillInstance}
                                value={lessonContent}
                                onChange={(e: any) => {
                                    setLessonContent(e);
                                    if (first) {
                                        setFirst(false);
                                    }
                                }}
                                modules={modules}
                                theme="snow"
                                className='w-full h-[385px]'
                                placeholder="내용을 입력해주세요."
                            />
                        </div>
                        <button
                            className="mt-[20px] btn btn-active btn-secondary text-lg text-black"
                            disabled={first || !!allErrors()}
                            onClick={() => finalConfirm(lessonName, '해당 레슨을 등록 하시겠습니까?', '등록', submit)}
                        >
                            <FontAwesomeIcon icon={faPlus} /> 레슨 수정
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Profile>
    );
}
