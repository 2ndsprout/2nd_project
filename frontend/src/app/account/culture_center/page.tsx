'use client';

import { getCenterList, getProfile, getUser } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";
import { gedivateTimeFormat, getDateTimeFormat } from "@/app/Global/Method";
import Pagination from "@/app/Global/Pagination";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [centerList, setCenterList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    console.log(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    console.log('centerlist', centerList);

    return (
        <Main user={user} profile={profile}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>문화센터</h2>
                        <div className="mb-2">편의시설</div>
                    </div>
                </aside>
                <div className="w-4/6 p-6 mt-[50px] flex flex-col space-y-10">
                    {centerList?.map((center, centerIndex) =>
                        <div key={center.id} >
                            <div className="bg-gray-800 p-4 rounded-lg flex items-center h-[200px]">
                                <img src="path/to/your/image.jpg" alt="센터 이미지" className="w-[200px] h-full object-cover rounded-t-lg" />
                                <div className="flex flex-col h-full w-full">
                                    <div className="text-xl font-bold mt-4 flex items-start w-full h-1/3 ml-[50px] text-orange-400">{center?.type === 'GYM' ? '헬스장' : '' || center?.type === 'SWIMMING_POOL' ? '수영장' : '' || center?.type === 'SCREEN_GOLF' ? '스크린 골프장' : '' || center?.type === 'LIBRARY' ? '도서관' : ''}</div>
                                    <label className="flex ml-[50px]">{getDateTimeFormat(center.startDate)} ~ {getDateTimeFormat(center.endDate)}</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="w-4/6 p-6 mt-[50px] flex flex-col space-y-10">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center h-[200px]">
                        <img src="path/to/your/image.jpg" alt="센터 이미지" className="w-[200px] h-full object-cover rounded-t-lg" />
                        <div className="flex flex-col h-full">
                            <h3 className="text-xl font-bold mt-4 flex w-full h-1/3 ml-[20px]]">센터 이름</h3>
                            <h5 className="text-xl font-bold mt-4 flex w-full h-2/3 ml-[20px]]">센터 시간</h5>
                        </div>
                    </div>

                    다른 게시글들도 같은 형식으로 추가합니다
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center h-[200px]">
                        <img src="path/to/your/image.jpg" alt="센터 이미지" className="w-[200px] h-full object-cover rounded-t-lg" />
                        <div className="flex flex-col h-full">
                            <h3 className="text-xl font-bold mt-4 flex w-full h-1/3 ml-[20px]]">센터 이름</h3>
                            <h5 className="text-xl font-bold mt-4 flex w-full h-2/3 ml-[20px]]">센터 시간</h5>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg flex items-center h-[200px]">
                        <img src="path/to/your/image.jpg" alt="센터 이미지" className="w-[200px] h-full object-cover rounded-t-lg" />
                        <div className="flex flex-col h-full">
                            <h3 className="text-xl font-bold mt-4 flex w-full h-1/3 ml-[20px]]">센터 이름</h3>
                            <h5 className="text-xl font-bold mt-4 flex w-full h-2/3 ml-[20px]]">센터 시간</h5>
                        </div>
                    </div>
                </div> */}
            </div>
        </Main>
    );

}
