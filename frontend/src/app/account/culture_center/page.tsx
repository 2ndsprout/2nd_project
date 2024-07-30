'use client';

import { getCenterList, getProfile, getUser } from "@/app/API/UserAPI";
import CenterSlider from "@/app/Global/CenterSlider";
import Main from "@/app/Global/layout/MainLayout";

import { getTimeFormat } from "@/app/Global/component/Method";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [gymUrlList, setGymUrlList] = useState([] as any[]);
    const [swimUrlList, setSwimUrlList] = useState([] as any[]);
    const [libUrlList, setLibUrlList] = useState([] as any[]);
    const [golfUrlList, setGolfUrlList] = useState([] as any[]);

    


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
                                setGymUrlList([]);
                                setSwimUrlList([]);
                                setLibUrlList([]);
                                setGolfUrlList([]);
                                r.forEach((r: any) => {
                                    switch (r.type) {
                                        case 'GYM':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setGymUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'SWIMMING_POOL':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setSwimUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'LIBRARY':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setLibUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'SCREEN_GOLF':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setGolfUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                })
                                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
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

    // useEffect(() => {
    //     centerList.forEach(center => {
    //         getUrlList(center.imageResponseDTOS)
    //     })
    // })

    console.log('centerlist', centerList);

    // function getUrlList (imageList : any[]) {
    //     imageList.forEach(image => {
    //         setUrlList(prev => [...prev, image.value])
    //     } )
    // }

    const defaultUrls = [
        '/apt1.png',
        '/apt2.png',
        '/apt3.png'
    ];
    function urlList(type: any): string[] {
        switch (type) {
            case 'GYM':
                return gymUrlList?.length === 0 ? defaultUrls : gymUrlList;
            case 'SWIMMING_POOL':
                return swimUrlList?.length === 0 ? defaultUrls : swimUrlList;
            case 'LIBRARY':
                return libUrlList?.length === 0 ? defaultUrls : libUrlList;
            case 'SCREEN_GOLF':
                return golfUrlList?.length === 0 ? defaultUrls : golfUrlList;
            default:
                return defaultUrls; // defaultUrl을 항상 반환하여 string[] 보장
        }
    }



    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-start">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>문화센터</h2>
                        <div className="mb-2">
                            <div>
                                {centerList?.map((center) =>
                                    <div key={center.id} >
                                        <Link href={`/account/culture_center/${center.id}`} >
                                            {center?.type === 'GYM' ? '헬스장' : ''
                                                || center?.type === 'SWIMMING_POOL' ? '수영장' : ''
                                                    || center?.type === 'SCREEN_GOLF' ? '스크린 골프장' : ''
                                                        || center?.type === 'LIBRARY' ? '도서관' : ''}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>
                <div className="w-4/6 p-6 mt-[50px] flex flex-col space-y-10">
                    {centerList?.map((center) =>
                        <div key={center.id} >
                            <div className="bg-gray-800 p-4 rounded-lg flex items-center h-[200px]">
                                <div className="w-[200px] h-full rounded-t-lg">
                                    <CenterSlider urlList={urlList(center?.type)} />
                                </div>
                                <div className="flex flex-col h-full w-full">
                                    <div className="text-xl font-bold mt-4 flex items-start w-full h-1/3 ml-[50px] text-orange-400">{center?.type === 'GYM' ? '헬스장' : '' || center?.type === 'SWIMMING_POOL' ? '수영장' : '' || center?.type === 'SCREEN_GOLF' ? '스크린 골프장' : '' || center?.type === 'LIBRARY' ? '도서관' : ''}</div>
                                    <label className="flex ml-[50px]">{getTimeFormat(center.startDate)} ~ {getTimeFormat(center.endDate)}</label>
                                </div>
                                <Link href={`/account/culture_center/${center.id}`} className="p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 flex justify-center text-white w-[130px]">
                                    수강신청
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );

}
