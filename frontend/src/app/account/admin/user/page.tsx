'use client'

import { getAptList, getCenterList, getUserList } from '@/app/API/UserAPI';

import { getProfile, getUser } from "@/app/API/UserAPI";
import Pagination from '@/app/Global/component/Pagination';
import Admin from "@/app/Global/layout/AdminLayout";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [centerList, setCenterList] = useState([] as any[]);
    const [aptList, setAptList] = useState([] as any[]);
    const [userList, setUserList] = useState([] as any[]);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [selectedApt, setSelectedApt] = useState('');
    const [aptError, setAptError] = useState('아파트를 설정해주세요.');
    const [apt, setApt] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    if (r.role !== 'ADMIN') {
                        setError('관리자 권한이 필요합니다.');
                        setRedirectCountdown(3);
                    }
                })
                .catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getAptList()
                            .then(r => {
                                setAptList(r);
                                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                            })
                            .catch(e => console.log(e));
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN, PROFILE_ID]);



    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedApt(value);
        if (value === '') {
            setAptError('아파트를 선택해주세요.');
        } else {
            setAptError('');
            const selectedApt = aptList.find(apt => apt.aptId === Number(value));
            if (selectedApt) {
                setApt(selectedApt);
                getUserList(selectedApt.aptId)
                    .then((r) => {
                        setUserList(r.content);
                    })
                    .catch(e => console.log(e));
            }
        }
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, newPage));  // 페이지 번호가 1 미만이 되지 않도록 보장
    };

    return (
        <Admin user={user} profile={profile} isLoading={isLoading}>
            <div className="bg-black w-full text-white flex">
                <div className='flex w-full h-[800px] items-center justify-center mt-[30px]'>
                    <div className='w-[1500px] h-[800px] bg-gray-700 rounded-lg'>
                        <div className='flex w-[1000px]'>
                            <select
                                className="flex mb-[30px] font-bold text-white select select-bordered w-full max-w-xs"
                                value={selectedApt}
                                onChange={handleSelectChange}  // handleChange 함수를 호출합니다.
                            >
                                <option className="text-black font-bold" value="" disabled>
                                    아파트 목록
                                </option>
                                {aptList.map((apt) => (
                                    <option
                                        className="text-black"
                                        key={apt.aptId}
                                        value={apt.aptId}
                                    >
                                        {apt.aptId}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="h-[500px] w-[1000px]">
                            {userList.map((user) => (
                                <div key={user?.id} className='flex items-center justify-between border-b-2 h-[50px]'>
                                    <div className='flex items-center w-full h-full'>
                                        <div className='ml-4 w-full h-full' >
                                            <div className='text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-[300px]'>{user.username}</div>
                                        </div>
                                    </div>
                                    <div className="w-[300px] justify-end flex">
                                        {/* <button className='text-sm mr-[30px] font-bold text-orange-300 hover:text-orange-500' onClick={() => openModal(1, lesson.id, 0)}>신청 관리</button>
                                        <button className='text-sm mr-[30px] font-bold text-red-300 hover:text-red-500' onClick={() => openModal(1, lesson.id, 2)}>취소 관리</button> */}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    );
}