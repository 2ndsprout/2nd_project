'use client'

import { getUser } from "@/app/API/UserAPI";
import DaumPostcode from "@/app/Global/component/Address";
import Admin from "@/app/Global/layout/AdminLayout";
import { useEffect, useState } from "react";

interface IAddr {
    address: string;
}

export default function Page() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isLoading, setIsLoading] = useState(false);
    const [aptName, setAptName] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [password, setPassword] = useState('');
    const [proposeStatus, setProposeStatus] = useState('');
    const [w, setW] = useState('');
    const [h, setH] = useState('');
    const [daumAddr, setDaumAddr] = useState(null as any);

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN]);


    const handleAddressChange = (address: IAddr) => {
        setRoadAddress(address.address);
        setDaumAddr(address);
    };

    return (
        <Admin user={user} isLoading={isLoading} className="flex">
            <div className="mt-[30px] ml-[250px] border-2 w-[1400px] h-[800px] rounded-lg bg-gray-700 border-gray-700 flex flex-col justify-center">
                <div className="overflow-x-auto h-[750px]">
                    <div className="flex flex-col items-start ml-[100px] gap-10 mt-5">
                        <div className="w-full flex items-center">
                            <span className="mr-[50px] text-xl font-bold">제목<span className="ml-10">:</span></span>
                            <input type="text" placeholder="제목을 입력하세요." className="text-gray-700 text-lg w-[600px] h-[50px] bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-700  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="flex">
                        <DaumPostcode onAddressChange={handleAddressChange} />
                            {daumAddr && (
                                <div className="ml-[60px]">
                                    <div className="border-2 bg-white text-gray-700 text-lg rounded-lg border-round-lg w-[600px] h-[50px]">{daumAddr.address}</div>
                                </div>
                            )}
                        </div>
                        <div className="w-full flex items-center">
                            <span className="mr-[60px] text-xl font-bold">총 층 수<span>:</span></span>
                            <input type="text" placeholder="아파트의 총 층 수를 입력해주세요." className="text-gray-700 text-lg w-[600px] h-[50px] bg-gray-50 border border-gray-300  rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-700  dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                        </div>
                        <div className="w-full flex items-center">
                            <span className="mr-[25px] text-xl font-bold">층당 세대수<span>:</span></span>
                            <input type="text" placeholder="층당 세대수를 입력해주세요." className="text-gray-700 text-lg w-[600px] h-[50px] bg-gray-50 border border-gray-300  rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-700  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div className="w-full flex items-center">
                            <span className="mr-[50px] text-xl font-bold">비밀번호<span>:</span></span>
                            <input type="password" placeholder="글 비밀번호를 입력해주세요." className="text-gray-700 text-lg w-[600px] h-[50px] bg-gray-50 border border-gray-300  rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-700  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                    </div>
                    <a href="/propose/create" className="w-[200px] btn-success">생성</a>
                </div>
            </div>
        </Admin>
    );
}
