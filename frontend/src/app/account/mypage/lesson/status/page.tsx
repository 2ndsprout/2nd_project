'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getMyLessonList, getProfile, getUser } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [pendingLessons, setPendingLessons] = useState([] as any[]);
    const [appliedLessons, setAppliedLessons] = useState([] as any[]);
    const [cancellingLessons, setCancellingLessons] = useState([] as any[]);
    const [isLoading, setIsLoading] = useState(false);
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
                                    const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 300);
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

    return (
        <Profile user={user} profile={profile} isLoading={isLoading}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
                <div className="mt-9 w-[1300px] border-2 h-[600px] rounded-lg">

                </div>
            </div>
        </Profile>
    );

}