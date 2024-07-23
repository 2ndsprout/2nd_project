'use client'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { getProfile, getProfileList, getUser, postProfile, saveImage, updateUser } from "@/app/API/UserAPI";
import DropDown, { Direcion } from "@/app/Global/DropDown";
import Modal from "@/app/Global/Modal";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faUserPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import { Check, checkInput } from "@/app/Global/Method";

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profileList, setProfileList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [openDropDown, setOpenDropDown] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                    setEmail(r.email);
                    getProfileList()
                        .then(r => setProfileList(r))
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN]);

    function IsDisabled() {
        return email != user?.email;
    }

    function Submit() {
        if (!Check('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))
            return setError('이메일 형식이 맞지 않습니다.');
        if (!Check('^[가-힣]{1,6}$', name))
            return setError('프로필 이름은 6자 내외 한글만 가능합니다.');
        updateUser({ email: email, password:"", newPassword1: "", newPassword2: "", name: "" })
            .then(r => {
                setUser(r)
                setEmail(r.email);
            })
            .catch(error => {
                switch (error.response.data) {
                    case 'email': { setEmailError('이메일 중복'); break; }
                    default:
                        console.log(error);
                }
            });
    }

    function openModal(type: number) {
        setISModalOpen(type);
    }

    function Change(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        saveImage(formData)
            .then(r => setUrl(r?.url))
            .catch(e => console.log(e));
    }

    function Select(id: number) {
        if (confirm("해당 프로필로 로그인 하시겠습니까?")) {
            localStorage.setItem('PROFILE_ID', id.toString());
            getProfile()
                .then(() => {
                    console.log("profile selected!");
                    // if (user.username === 'admin') {
                    //     window.location.href = '/account/admin';
                    // } else {
                        window.location.href = '/';
                    // }
                })
                .catch(e => console.log(e));
        }
    }

    function Regist() {
        if (profileList.length < 6) {
            postProfile({ name: name, url: url })
                .then(() => window.location.href = '/account/profile')
                .catch(e => console.log(e));
        } else {
            alert('프로필은 최대 6개까지 등록 가능합니다.');
            window.location.href = '/account/profile';
        }
    }

    return (
        <>
            <div className="bg-black flex flex-col items-center h-[953px] w-[1900px] relative" id="main">
                <div className="flex justify-end w-full mt-[15px] mr-[50px]">
                    <button id="profileSettings" className="btn btn-active btn-primary w-[180px] text-lg text-black" onClick={() => setOpenDropDown(!openDropDown)}>
                        <FontAwesomeIcon icon={faBars} />프로필 설정
                    </button>
                    <div>
                        <DropDown open={openDropDown} onClose={() => setOpenDropDown(false)} background="main" button="profileSettings" className="mt-[10px]" defaultDriection={Direcion.DOWN} height={200} width={180} x={-5} y={30}>
                            <button className="mt-0 btn btn-active btn-secondary text-lg text-black" onClick={() => openModal(1)}>
                                <FontAwesomeIcon icon={faGear} />계정 설정
                            </button>
                            <button className="mt-[5px] btn btn-active btn-secondary text-lg text-black" onClick={() => openModal(2)}>
                                <FontAwesomeIcon icon={faUserPlus} size="xs" />프로필 추가
                            </button>
                            {user ? <a href='/' onClick={e => { e.preventDefault(); localStorage.clear(); window.location.reload(); }} className='mt-[5px] btn btn-active btn-secondary text-lg text-black'>로그아웃</a> : <></>}
                        </DropDown>
                    </div>
                </div>
                <div className="h-1/5">
                    <div className="w-full flex flex-col items-center py-3">
                        <img src='/user.png' className='w-[64px] h-[64px] mb-2' alt="로고" />
                        <label className="font-bold text-2xl text-white">Honey Danji</label>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center mx-auto mt-10 w-full">
                    {profileList?.map((profile, index) => (
                        <div key={index} className="text-center mx-auto my-3 w-1/3">
                            <div className="flex justify-center">
                                <button onClick={() => Select(profile.id)}>
                                    <img src={profile?.url ? profile.url : '/user.png' } className="w-56 h-56 mb-2 mt-2 rounded-full" alt="프로필 이미지" />
                                    <span className='font-bold text-xl'>{profile?.name}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal open={isModalOpen === 1} onClose={() => setISModalOpen(-1)} className='modal-box w-[400px] h-[400px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-2)}>✕</button>
                <div className="mt-0 flex flex-col items-center gap-3">
                    <label className='text-xs font-bold text-red-500'>{emailError}</label>
                    <input type="text" className='input input-bordered input-lg text-black' defaultValue={email} minLength={3}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={e => checkInput(e, '^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', () => setEmailError(''), () => setEmailError('이메일 형식이 맞지 않습니다.'))}
                        onKeyUp={e => checkInput(e, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', () => setEmailError(''), () => setEmailError('이메일 형식이 맞지 않습니다.'))} />
                    <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!IsDisabled() || !!error} onClick={() => { Submit(); setISModalOpen(-2) }}>정보 수정</button>

                </div>
            </Modal>
            <Modal open={isModalOpen === 2} onClose={() => setISModalOpen(-2)} className='modal-box w-[400px] h-[400px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-1)}> ✕ </button>
                <div className="relative w-[128px] h-auto flex justify-center items-center mb-10">
                    <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
                    <img src='/user.png'defaultValue={url} alt='main Image' className='w-[128px] h-[128px] rounded-full' />
                    <input id='file' hidden type='file' onChange={e => Change(e.target.files?.[0])} />
                </div>
                <div className="mt-0 flex flex-col items-center">
                    <label className='text-xs font-bold text-red-500 pb-5'>{error}</label>
                        <input type="text" defaultValue={name} onChange={e => setName(e.target.value)} className='input input-bordered input-lg text-black' placeholder="이름을 입력해주세요"
                        onFocus={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))}
                        onKeyUp={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))} />
                    <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!!error} onClick={() => Regist()}>프로필 등록</button>
                </div>
            </Modal>
        </>
    );
}
