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
                <div className="flex justify-end w-full">
                    <button className="btn btn-active btn-secondary">Secondary</button>
                </div>
                <div className="h-[20%]">
                    <a href="/" className="w-full flex flex-col items-center py-3">
                        <img src='/user.png' className='w-36 h-36 mb-2' alt="로고" />
                        <label className="font-bold text-2xl text-white">Honey Danji</label>
                    </a>
                </div>
                <div className="flex flex-wrap justify-center mx-auto mt-10 w-full">
                    {profileList?.map((profile, index) => (
                        <div key={index} className="text-center mx-auto my-3 w-1/3">
                            <div className="flex justify-center">
                                <a href="/">
                                    <img src={profile?.url ? '/user.png' : profile.url} className="w-60 h-60 mb-2 mt-2 rounded-full" alt="프로필 이미지" />
                                    <span>{profile?.name}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-[30%] w-full flex items-end justify-center">
                </div>
            </div>
        </>
    );
}
