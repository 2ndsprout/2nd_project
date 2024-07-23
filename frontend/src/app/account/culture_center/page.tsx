'use client';

import { getProfile, getUser } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    console.log(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
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
        <Main user={user} profile={profile}>
            123
        </Main>
    );
    
}
