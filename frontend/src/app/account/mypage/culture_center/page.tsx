'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, postCenter, saveImageList} from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import ConfirmModal from "@/app/Global/component/ConfirmModal";


export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const [url, setUrl] = useState('');


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

    function Change(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        saveImageList(formData)
            .then(r => setUrl(r?.url))
            .catch(e => console.log(e));
    }


    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>센터</label> 생성</label>
                <div className="mt-9 w-[1300px] border-2 h-[650px] rounded-lg overflow-scroll overflow-x-hidden p-[40px]">
                <div className="relative w-[128px] h-auto flex justify-center items-center mb-10">
                    <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
                    <img src={url ? url : '/user.png'} alt='Profile Image' className='w-[128px] h-[128px] rounded-full' />
                    <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files?.[0])} />
                </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
        </Profile>
    );
}
