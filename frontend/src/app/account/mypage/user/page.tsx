'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, getUserList, deleteUser } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "@/app/Global/component/ConfirmModal";


export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const [userList, setUserList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    getUserList(r.aptResponseDTO.aptId)
                        .then(r => {
                            const filteredUserList = r.content.filter((user: any) => user.role !== 'ADMIN');
                            setUserList(filteredUserList);
                            console.log("userList : ", filteredUserList);
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


    function deleteTargetUser(deleteUsername: string) {
        if(deleteUsername !== null) {
            try {
                deleteUser(deleteUsername);
                closeConfirm();
                showAlert('레슨 신청 취소가 완료되었습니다.', '/account/mypage/user');
                setUserList(prevList => prevList.filter(user => user.username !== deleteUsername));
            } catch (e) {
                showAlert('유저 삭제 중 오류가 발생했습니다.');
                console.error(e);
            }
        } else {
            showAlert('유저 삭제 중 오류가 발생했습니다.');
        }
    }


    return (
        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>유저</label> 관리</label>
                <div className="mt-9 w-[1300px] border-2 h-[650px] rounded-lg overflow-scroll overflow-x-hidden p-[40px]">
                    {userList.map((user, index) => (
                        <div key={index} className="w-[1200px] flex justify-center">
                            <div className="border-b-[1px] w-[900px] flex">
                                <p className="font-bold m-[15px]">{user?.username}</p>
                                <div className="flex w-full items-center justify-end">
                                <button onClick={() => finalConfirm(user?.username, '해당 유저를 삭제하시겠습니까?', '삭제', () => deleteTargetUser(user?.username))} className="btn btn-error text-xs btn-xs h-[28px]"><FontAwesomeIcon icon={faXmark} size="xs" />유저 삭제</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
        </Profile>
    );
}
