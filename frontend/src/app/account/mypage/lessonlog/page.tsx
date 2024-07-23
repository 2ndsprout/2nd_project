'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { deleteProfile, getMyLessonList, getProfile, getUser, saveImage, saveProfileImage, updateProfile } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput, getDate, getDateFormat, getDateTimeFormat, getTimeFormat } from "@/app/Global/Method";
import Calendar from "@/app/Global/Calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [pendingLessons, setPendingLessons] = useState([] as any[]);
    const [appliedLessons, setAppliedLessons] = useState([] as any[]);
    const [cancellingLessons, setCancellingLessons] = useState([] as any[]);
    const [cancelledLessons, setCancelledLessons] = useState([] as any[]);
    const [error, setError] = useState('');
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

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
                                    switch (r.type) {
                                        case 'PENDING':
                                            setPendingLessons(prev => [...prev, r.lessonResponseDTO]);
                                            break;
                                        case 'APPLIED':
                                            setAppliedLessons(prev => [...prev, r.lessonResponseDTO]);
                                            break;
                                        case 'CANCELLING':
                                            setCancellingLessons(prev => [...prev, r.lessonResponseDTO]);
                                            break;
                                        case 'CANCELLED':
                                            setCancelledLessons(prev => [...prev, r.lessonResponseDTO]);
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

    return (
        <Profile user={user} profile={profile}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>프로그램 신청</label> 목록</label>
                <div className="mt-9 p-10 flex flex-col w-[1300px] border-2 h-[1000px] overflow-y-scroll rounded-lg">
                    <p className="mb-10 text-xl font-bold">진행중인 레슨 : <span className="text-secondary">{appliedLessons?.length !== 0 ? appliedLessons.length : '0'}</span> 개</p>
                    <div className="flex w-full h-[50%]">
                        <div>
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>신청</label> 목록</label>
                            {pendingLessons?.slice(0, 5).map((pending, pendingIndex) =>
                                <div key={pending.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className=" font-bold text-secondary">
                                        {pending.name}
                                    </div>
                                    <div className="w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        {pending.content}
                                    </div>

                                    <div className="text-sm"><label><FontAwesomeIcon icon={faClock} /></label>&nbsp;&nbsp;{getDateFormat(pending.startDate)} ~ {getDateFormat(pending.endDate)}
                                        <label className="text-xs text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({getTimeFormat(pending.startDate)} ~ {getTimeFormat(pending.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex w-full justify-between gap-5 ">
                        <div className="w-[400px]">
                            <div className='text-xl font-bold mb-3'><label className='text-xl text-secondary font-bold'>진행중인 </label> 목록</div>
                            {appliedLessons?.slice(0, 5).map((applied, appliedIndex) =>
                                <div key={applied.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className=" font-bold text-secondary">
                                        {applied.name}
                                    </div>
                                    <div className="w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        {applied.content}
                                    </div>

                                    <div className="text-sm"><label><FontAwesomeIcon icon={faClock} /></label>&nbsp;&nbsp;{getDateFormat(applied.startDate)} ~ {getDateFormat(applied.endDate)}
                                        <label className="text-xs text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({getTimeFormat(applied.startDate)} ~ {getTimeFormat(applied.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-[400px]">
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>취소 신청</label> 목록</label>
                            {cancellingLessons?.slice(0, 5).map((cancelling, cancellingIndex) =>
                                <div key={cancelling.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className=" font-bold text-secondary">
                                        {cancelling.name}
                                    </div>
                                    <div className="w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        {cancelling.content}
                                    </div>

                                    <div className="text-sm"><label><FontAwesomeIcon icon={faClock} /></label>&nbsp;&nbsp;{getDateFormat(cancelling.startDate)} ~ {getDateFormat(cancelling.endDate)}
                                        <label className="text-xs text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({getTimeFormat(cancelling.startDate)} ~ {getTimeFormat(cancelling.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-[400px]">
                            <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>취소 완료</label> 목록</label>
                            {cancelledLessons?.slice(0, 5).map((cancelled, cancelledIndex) =>
                                <div key={cancelled.id} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer my-2">
                                    <div className=" font-bold text-secondary">
                                        {cancelled.name}
                                    </div>
                                    <div className="w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary flex items-center">
                                        {cancelled.content}
                                    </div>

                                    <div className="text-sm"><label><FontAwesomeIcon icon={faClock} /></label>&nbsp;&nbsp;{getDateFormat(cancelled.startDate)} ~ {getDateFormat(cancelled.endDate)}
                                        <label className="text-xs text-gray-400">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;({getTimeFormat(cancelled.startDate)} ~ {getTimeFormat(cancelled.endDate)})</label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Profile>
    );
}
