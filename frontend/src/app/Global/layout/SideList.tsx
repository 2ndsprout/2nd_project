'use client';

import React from 'react';

interface sideListProps {
    user: any;
    profile: any;
}



export default function SideList(props: sideListProps) {
    const { user, profile } = props;

    return (
        <div className="mt-20 w-[200px] mr-[30px]">
            <div className="flex flex-col items-center border-x-2 border-t-2 border-gray-400 rounded-t-lg py-2 px-4 w-full">
                <label className="text-white text-lg font-bold hover:text-secondary">{profile?.name}</label>
                <img src={profile?.url ? profile.url : '/user.png'} className="w-[128px] h-[128px] rounded-full" alt="유저 프로필" />
            </div>
            <div className="flex flex-col border-x-2 border-y-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3">My Profile</label>
                <a href="/account/mypage" className="text-sm text-gray-500 hover:underline hover:text-secondary">프로필 정보 수정</a>
            </div>
            <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full rounded-b-lg">
                <label className="font-bold mb-3">My Lessons</label>
                <a href="/account/mypage/lesson/list" className="text-sm text-gray-500 hover:underline hover:text-secondary">내 레슨 목록</a>
                {user?.role == "STAFF" && <a href="/account/mypage/lesson/manage" className="text-sm text-gray-500 hover:underline hover:text-secondary">레슨 관리</a>}
                {user?.role === "STAFF" && <a href="/account/mypage/lesson/create" className="text-sm text-gray-500 hover:underline hover:text-secondary">레슨 생성</a>}
            </div>
            {user?.role !== "USER" && user?.role !== "STAFF" && <div className="flex flex-col border-x-2 border-y-2 mt-2 border-gray-400 py-2 px-4 w-full rounded-t-lg">
                <label className="font-bold mb-3">User manage</label>
                {/* <a href="/account/chatList" className="text-sm text-gray-500 hover:underline">내 채팅 목록</a> */}
                <a href="/account/mypage/user" className="text-sm text-gray-500 hover:underline hover:text-secondary">유저 관리</a>
            </div>}
            {user?.role !== "USER" && user?.role !== "STAFF" && <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full rounded-b-lg">
                <label className="font-bold mb-3">Culture Center</label>
                <a href="/account/mypage/culture_center" className="text-sm text-gray-500 hover:underline hover:text-secondary">센터 생성</a>
            </div>}
        </div>
    );
}
