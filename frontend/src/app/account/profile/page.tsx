'use client'

import { getProfile, getProfileList, getUser, postProfile, saveImage, saveImageList } from "@/app/API/UserAPI";
import Modal from "@/app/Global/Modal";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profileList, setProfileList] = useState(null as unknown as any[])
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');

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

    function openModal(type: number) {
        setISModalOpen(type);
    }
    function Change(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        saveImage(formData)
            .then(r => setUrl(r?.url))
            .catch(e => console.log(e))
    }

    function Select(id: number) {
        if (confirm("해당 프로필로 로그인 하시겠습니까?")) {
            localStorage.setItem('PROFILE_ID', id.toString());
            getProfile()
                .then(() => {
                    console.log("profile selected!");
                    if (user.username == 'admin') {
                        window.location.href = '/account/admin';
                    }
                    else {
                        window.location.href = '/';
                    }
                })
                //   .catch(e => alert(e.response.data));
                .catch(e => console.log(e));
        }
    }

    function Regist() {
        postProfile({ name: name, url: url })
            .then(() => window.location.href = '/account/profile')
            .catch(e => console.log(e))
    }

    return (
        <>
            <div className="bg-black flex flex-col items-center min-h-screen relative">
                <div className="flex justify-end w-full mt-3 mr-3">
                    <button className="mr-3">계정설정</button>
                    <button className="btn btn-active btn-info" onClick={() => openModal(0)}>프로필 생성</button>
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
                                <button onClick={() => Select(profile.id)}>
                                    <img src={'/user.png'} className="w-60 h-60 mb-2 mt-2 rounded-full" alt="프로필 이미지" />
                                    <span>{profile?.name}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="h-[30%] w-full flex items-end justify-center">
                </div>
            </div>
            <Modal open={isModalOpen > -1} onClose={() => setISModalOpen(-1)} className='modal-box w-[400px] h-[400px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2" onClick={() => openModal(-1)}>✕</button>
                <div className="relative w-full h-auto flex justify-center items-center mb-10">
                    <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
                    <img src={url !== '' ? url : '/user.png'} alt='main Image' className='w-[128px] h-[128px]' />
                    <input id='file' hidden type='file' onChange={e => Change(e.target.files?.[0])} />
                </div>
                <div className="mt-0 flex flex-col items-center">
                    <label className="input input-lg w-full max-w-xs input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70 text-black">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input type="text" defaultValue={name} onChange={e => setName(e.target.value)} className="grow text-black" placeholder="이름을 입력해주세요" />
                    </label>
                    <button className='btn btn-xl btn-success mt-10' onClick={() => Regist()}>프로필 등록</button>
                </div>
            </Modal>
        </>
    );
}
