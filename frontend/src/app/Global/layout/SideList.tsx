'use client';

import React from 'react';
import { deleteProfile } from "@/app/API/UserAPI";

interface sideListProps {
    user: any;
    profile: any;
}

async function deleteProfiles() {
    if (confirm('정말로 삭제하시겠습니까?')) {
        try {
            await deleteProfile(); // 비동기로 API 호출
            alert('삭제되었습니다.');
            // 이후 로그아웃 처리나 페이지 리다이렉션 추가 가능
        } catch (error) {
            console.error('탈퇴 처리 중 오류 발생:', error);
            alert('탈퇴 처리 중 오류가 발생했습니다.');
        }
    }
}

export default function SideList(props: sideListProps) {
    const { user, profile } = props;

    return (
        <div className="mt-20 w-[200px] mr-[30px]">
            <div className="flex flex-col items-center border-x-2 border-y-2 border-gray-400 rounded-t-lg py-2 px-4 w-full">
                <label className="text-white text-lg">{profile?.name}</label>
                <img src="/user.png" className="w-[128px] h-[128px]" alt="유저 프로필" />
            </div>
            <div className="flex flex-col border-x-2 border-y-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3">프로필 정보 변경</label>
                <a href="/account/mypage" className="text-sm text-gray-500 hover:underline">프로필 정보 수정</a>
                <a href="/account/profile" className="text-sm text-gray-500 hover:underline">계정 정보 수정</a>
            </div>
            <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3">문화 센터</label>
                <a href="/account/log" className="text-sm text-gray-500 hover:underline">프로그램 신청 내역</a>
                <a href="/account/reviews" className="text-sm text-gray-500 hover:underline">내 레슨 목록</a>
                {user?.role !== "USER" && <a href="/account/productList" className="text-sm text-gray-500 hover:underline">수강 회원 목록</a>}
            </div>
            <div className="flex flex-col border-x-2 border-b-2 border-gray-400 py-2 px-4 w-full">
                <label className="font-bold mb-3"></label>
                <a href="/account/chatList" className="text-sm text-gray-500 hover:underline">내 채팅 목록</a>
                <button
                    onClick={deleteProfiles}
                    className="text-xs  text-red-500 hover:underline hover:font-bold mt-4"
                >
                    프로필 삭제
                </button>
            </div>
        </div>
    );
}
