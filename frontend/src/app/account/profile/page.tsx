'use client'

import { getProfileList, getUser } from "@/app/API/UserAPI";
import { Html } from "next/document";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profileList, setProfileList] = useState(null as unknown as any[])
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                    getProfileList()
                    .then(r => setProfileList(r))
                    .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN]);

    return (
        <>
            <div className="bg-black flex flex-col items-center h-screen relative">
                <a href="/" className="fixed top-0 w-full flex flex-col items-center py-3">
                    <img src='/user.png' className='w-36 h-36 mb-2' alt="로고" />
                    <label className="font-bold text-2xl text-white">Honey Danji</label>
                </a>
                <div className="flex flex-wrap justify-center mt-52 w-full">
                    {profileList?.map((profile, index) => (
                        <div key={index} className="text-center mx-10 my-3 w-1/4">
                            <div className="flex justify-center">
                                <img src={profile?.url ? '/user.png' : profile.url} className="w-56 h-56 mb-2 mt-2 rounded-full" alt="프로필 이미지" />
                            </div>
                            <span className="text-white">{profile?.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
