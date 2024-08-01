'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser, getUserList, getApt } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";


export default function Page() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const [userList, setUserList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    getUserList(r.aptResponseDTO.aptId)
                            .then(r => {
                                setUserList(r.content);
                                console.log("userList : ", r);
                            })
                            .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        console.log(r);
                        setProfile(r);
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





    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>유저</label> 관리</label>
                <div className="mt-9 w-[1300px] border-2 h-[650px] rounded-lg">
                    {userList.map((user, index) => (
                        <p key={index} className="text-white">{user?.username}</p>
                    ))}
                </div>
            </div>
        </Profile>
    );
}
