'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, postCenter, saveImageList, getCenterList } from "@/app/API/UserAPI";
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
    let [centerType, setCenterType] = useState('' as any);
    const [centerTypeError, setCenterTypeError] = useState('센터 타입을 입력해주세요.');
    const [isModalOpen, setISModalOpen] = useState(-1);

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
                        getCenterList()
                            .then((r) => {
                                setCenterList(r);
                            })
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
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCenterType(Number(event.target.value)); // 변환된 숫자값 설정
        setCenterTypeError('');
    };

    function submit() {
        if (centerType != null || centerType != '') {
            onClose(-1);
            closeConfirm();
            // Type 제외 모두 ? 로 null도 들어가게 해놨음 수정해주세요~
            postCenter({ type: centerType })
            window.location.href = `/account/culture_center`;
        }
    };


    function onClose(type: number) {
        setISModalOpen(type);
    }


    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>센터</label> 생성</label>
                <div className="mt-9 w-[1300px] border-2 h-[700px] rounded-lg overflow-x-hidden p-[40px] items-center flex">
                    <div className="w-[600px] h-[550px] flex flex-col">
                        <div className="flex flex-row w-[600px]">
                            <select
                                id="role"
                                defaultValue={-1}
                                onChange={handleChange}
                                className="text-black text-lg w-[650px] h-[50px] bg-white border border-gray-400 rounded-lg p-2.5"
                            >
                                <option value={-1} disabled>센터 타입을 선택하세요</option>
                                <option value={0}>헬스장</option>
                                <option value={1}>수영장</option>
                                <option value={2}>스크린골프장</option>
                                <option value={3}>도서관</option>
                            </select>
                            <button className="w-[100px] h-[50px] ml-[30px] btn btn-xl btn-accent" disabled={centerTypeError !== ''} onClick={() => finalConfirm('센터 생성', '센터를 만들겠습니까?', '생성완료', submit)}>
                                센터 생성
                            </button>
                        </div>
                        <div className="w-[600px] h-[450px] mt-[50px] border">
                            시계 넣을 영역
                        </div>
                    </div>
                    <div className="relative w-[500px] h-[550px] ml-[100px] flex justify-center items-center mb-10">
                        {/* 나중에 사진 미리보기 추가할 예정 */}
                        <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
                        <img src={url ? url : '/logo.png'} alt='Profile Image' className='w-[128px] h-[128px] rounded-full' />
                        <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files?.[0])} />
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
        </Profile>
    );
}
