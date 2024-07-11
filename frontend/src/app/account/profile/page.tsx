'use client'

import { getUser } from "@/app/API/UserAPI";
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
                })
                .catch(e => console.log(e));
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN]);
    return <>
    <div className='flex items-end bg-black'>
    <label className='text-xl font-bold'>내 <label className='text-xl text-red-500 font-bold'>상품</label>목록</label>
    <label className='text-xs h-[14px] border-l-2 border-gray-400 ml-2 mb-[5px] pl-2'>고객님의 상품으로 들어가서 상품을 수정하실 수 있습니다.</label>
</div>
<table className="text-center">
    <thead>
        <tr>
            <th className="w-[600px]">상품명</th>
            <th className="w-[200px]">리뷰제목</th>
            <th className="w-[100px]">평점</th>
            <th className="w-[150px]">작성일</th>
            <th className="w-[100px]">내용</th>
        </tr>
    </thead>
    <tbody>
            {profileList?.map((profile, index) => <tr key={index} className='min-h-[104px]'>
            <td>{profile?.name}</td>
            <td>{profile?.url}</td>
        </tr>)}
    </tbody>
</table>
<div className="flex justify-center font-bold text-2xl mt-8">
    {profileList?.length == 0 ? <label>프로필이 없습니다.</label> : <></>}
</div>
</>
}