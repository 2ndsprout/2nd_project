'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getMyLessonList, getProfile, getUser, updateLessonRequest } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { getDateFormat, getTimeFormat } from "@/app/Global/component/Method";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHourglassStart, faXmark } from "@fortawesome/free-solid-svg-icons";
import useAlert from "@/app/Global/hook/useAlert";
import useConfirm from "@/app/Global/hook/useConfirm";
import AlertModal from "@/app/Global/component/AlertModal";
import ConfirmModal from "@/app/Global/component/ConfirmModal";


export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [pendingLessons, setPendingLessons] = useState([] as any[]);
    const [appliedLessons, setAppliedLessons] = useState([] as any[]);
    const [cancellingLessons, setCancellingLessons] = useState([] as any[]);
    const [cancelledLessons, setCancelledLessons] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
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
                        setProfile(r);
                        getMyLessonList()
                            .then(r => {
                                setPendingLessons([]);
                                setAppliedLessons([]);
                                setCancellingLessons([]);
                                setCancelledLessons([]);
                                r.forEach((r: any) => {
                                    console.log('lu', r);
                                    switch (r.type) {
                                        case 'PENDING':
                                            setPendingLessons(prev => [...prev, r]);
                                            break;
                                        case 'APPLIED':
                                            setAppliedLessons(prev => [...prev, r]);
                                            break;
                                        case 'CANCELLING':
                                            setCancellingLessons(prev => [...prev, r]);
                                            break;
                                        case 'CANCELLED':
                                            setCancelledLessons(prev => [...prev, r]);
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            })
                            .catch(e => console.log(e))
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    console.log('Pending Lessons: ', pendingLessons);
    console.log('Applied Lessons: ', appliedLessons);
    console.log('Cancelling Lessons: ', cancellingLessons);
    console.log('Cancelled Lessons: ', cancelledLessons);

    function updateLesson(id: number, lessonId: number, type: string) {
        let typeNumber: number | null;

        switch (type) {
            case 'PENDING':
                typeNumber = 0;
                break;
            case 'APPLIED':
                typeNumber = 1;
                break;
            case 'CANCELLING':
                typeNumber = 2;
                break;
            case 'CANCELLED':
                typeNumber = 3;
                break;
            default:
                typeNumber = null;
        }

        if (typeNumber !== null) {
            updateLessonRequest({ id, lessonId, type: typeNumber });
            closeConfirm();
            showAlert('레슨 취소 신청이 완료되었습니다.', '/account/mypage/lesson/log');
        } else {
            showAlert('레슨 상태 변경 중 오류가 발생했습니다.');
        }
    }

    return (
        <Profile user={user} profile={profile}>
            <div className='flex flex-col'>
                <label className='mt-4 text-xl font-bold'><label className='text-xl text-secondary font-bold'>내 레슨</label> 목록</label>
                <div className="mt-5 p-10 flex flex-col w-[1300px] border-2 h-[1000px] rounded-lg">
                    <p className="mb-10 text-xl font-bold">진행중인 레슨 : <span className="text-secondary tex-2xl">{appliedLessons?.length !== 0 ? appliedLessons.length : '0'}</span> 개</p>
                    <div className="flex w-full h-[40%]">
                        <div>
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>신청</label> 목록</label>
                            {pendingLessons?.slice(0, 3).map((pending, pendingIndex) =>
                                <div key={pending.lessonResponseDTO.id} className="w-[1200px] flex flex-col border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className="flex font-bold text-secondary justify-between overflow-hidden overflow-ellipsis whitespace-nowrap">
                                        <div>
                                            {pending.lessonResponseDTO.name}
                                        </div>
                                        <p className="p-1 rounded-lg text-sm border-secondary bg-secondary text-black text-center cursor-default"><FontAwesomeIcon icon={faHourglassStart} size="xs" /> 승인 대기중</p>
                                    </div>
                                    <div className=" mt-2 overflow-hidden justify-between overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        <div>
                                            {pending.lessonResponseDTO.content}
                                        </div>
                                        <button onClick={() => finalConfirm(pending.lessonResponseDTO.name, '해당 레슨 신청을 취소하시겠습니까?', '취소', () => updateLesson(pending.id, pending.lessonResponseDTO.id, 'CANCELLING'))} className="btn btn-error text-xs btn-xs"><FontAwesomeIcon icon={faXmark} />신청 취소</button>
                                    </div>
                                    <div className="mt-1 text-sm"><label><FontAwesomeIcon icon={faClock} /> </label>{getDateFormat(pending.lessonResponseDTO.startDate)} ~ {getDateFormat(pending.lessonResponseDTO.endDate)}
                                        <label className="ml-14 text-xs text-gray-400">({getTimeFormat(pending.lessonResponseDTO.startDate)} ~ {getTimeFormat(pending.lessonResponseDTO.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full justify-between gap-5 ">
                        <div className="w-[400px]">
                            <div className='text-xl font-bold mb-3'><label className='text-xl text-secondary font-bold'>진행중인 </label> 목록</div>
                            {appliedLessons?.slice(0, 5).map((applied, appliedIndex) =>
                                <div key={applied.lessonResponseDTO.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className="flex font-bold text-secondary justify-between overflow-hidden overflow-ellipsis whitespace-nowrap">
                                        <div>
                                            {applied.lessonResponseDTO.name}
                                        </div>
                                    <button onClick={() => finalConfirm(applied.lessonResponseDTO.name, '해당 레슨을 취소하시겠습니까?', '취소', () => updateLesson(applied.id, applied.lessonResponseDTO.id, 'CANCELLING'))} className="btn btn-error text-xs btn-xs"><FontAwesomeIcon icon={faXmark} />수강 중단</button>
                                    </div>
                                    <div className="mt-2 justify-between overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        <div>
                                            {applied.lessonResponseDTO.content}
                                        </div>
                                    </div>
                                    <div className="mt-1 text-sm"><label><FontAwesomeIcon icon={faClock} /> </label>{getDateFormat(applied.lessonResponseDTO.startDate)} ~ {getDateFormat(applied.lessonResponseDTO.endDate)}
                                        <label className="ml-14 text-xs text-gray-400">({getTimeFormat(applied.lessonResponseDTO.startDate)} ~ {getTimeFormat(applied.lessonResponseDTO.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-[400px]">
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>취소 신청</label> 목록</label>
                            {cancellingLessons?.slice(0, 5).map((cancelling, cancellingIndex) =>
                                <div key={cancelling.lessonResponseDTO.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className="flex font-bold text-secondary justify-between overflow-hidden overflow-ellipsis whitespace-nowrap">
                                        <div>
                                            {cancelling.lessonResponseDTO.name}
                                        </div>
                                        <span className="p-1 rounded-lg text-sm border-gray-400 bg-gray-400 text-black text-center cursor-default"><FontAwesomeIcon icon={faHourglassStart} size="xs" /> 취소 대기중</span>
                                    </div>
                                    <div className="mt-2 w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        {cancelling.lessonResponseDTO.content}
                                    </div>

                                    <div className="mt-1 text-sm"><label><FontAwesomeIcon icon={faClock} /> </label>{getDateFormat(cancelling.lessonResponseDTO.startDate)} ~ {getDateFormat(cancelling.lessonResponseDTO.endDate)}
                                        <label className="ml-14 text-xs text-gray-400">({getTimeFormat(cancelling.lessonResponseDTO.startDate)} ~ {getTimeFormat(cancelling.lessonResponseDTO.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-[400px]">
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>취소 완료</label> 목록</label>
                            {cancelledLessons?.slice(0, 5).map((cancelled, cancelledIndex) =>
                                <div key={cancelled.lessonResponseDTO.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className="flex font-bold text-secondary justify-between overflow-hidden overflow-ellipsis whitespace-nowrap">
                                        <div>
                                            {cancelled.lessonResponseDTO.name}
                                        </div>
                                        <span className="p-1 rounded-lg text-sm border-gray-400 bg-gray-400 text-gray-700 text-center cursor-default">취소 완료</span>
                                    </div>
                                    <div className="mt-2 w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap flex items-center">
                                        {cancelled.lessonResponseDTO.content}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-400"><label><FontAwesomeIcon icon={faClock} /> </label>{getDateFormat(cancelled.lessonResponseDTO.startDate)} ~ {getDateFormat(cancelled.lessonResponseDTO.endDate)}
                                        <label className="ml-14 text-xs text-gray-400">({getTimeFormat(cancelled.lessonResponseDTO.startDate)} ~ {getTimeFormat(cancelled.lessonResponseDTO.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Profile >
    );
}
