'use client'

import { getProfile, getUser } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const router = useRouter();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    if (r.role !== 'ADMIN') {
                        redirect('/account/login');
                    }
                    console.log(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
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
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="flex justify-center items-center h-full">
                <h1 className="text-3xl font-bold">관리자 페이지</h1>
                </div>
            </Main>
    );
}