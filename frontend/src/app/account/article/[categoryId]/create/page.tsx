'use client'

import { PostArticle } from '@/app/API/UserAPI';
import { KeyDownCheck, Move } from  '@/app/Global/Method';
import { useState } from 'react';
import { useParams } from "next/navigation";
import Link from 'next/link';

export default function Page() {
    const { categoryId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const tagId = null; // 예시로 null을 사용, 실제로는 관련 state에서 가져와야 함
    const tagIdArray = tagId ? [tagId] : []; // null이나 undefined이면 빈 배열로 설정

    function Sumbit() {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }

        // POST 요청 데이터 준비
        const requestData = {
            title,
            content,
            categoryId: Number(categoryId),
            tagId: tagIdArray, // 빈 배열 또는 실제 tagId 배열
        };


        PostArticle(requestData)
            .then((response) => {
                localStorage.clear();
                localStorage.setItem('tokenType', response.tokenType);
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                console.log("게시물 등록 완료");
                window.location.href = `/`;
            }).catch((error) => {
                switch (error.response.data) {
                    case 'title': { setError('제목 입력에 오류가 발생'); break; }
                    case 'content': { setError('내용 입력에 오류가 발생'); break; }
                    default:
                        console.log(error);
                        setError('게시물 작성 중 오류가 발생했습니다.');
                }
            });
    }

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 flex flex-col items-center">
                
            </aside>
            <div className="flex-1 p-10">
                <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <input
                        id='title'
                        type='text'
                        className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                        style={{ outline: '0px', color: 'black' }}
                        placeholder='제목 입력'
                        onFocus={e => e.target.style.border = '2px solid red'}
                        onBlur={e => e.target.style.border = ''}
                        onChange={e => setTitle(e.target.value)}
                        onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('content') })}
                    />

                    <textarea
                        id='content'
                        className='w-full h-72 input input-bordered rounded-[0] text-black'
                        style={{ outline: '0px', color: 'black' }}
                        placeholder='내용 입력'
                        onFocus={e => e.target.style.border = '2px solid red'}
                        onBlur={e => e.target.style.border = ''}
                        onChange={e => setContent(e.target.value)}
                        onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, pre: () => Move('title'), next: () => document.getElementById('submit')?.click() })}
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className='btn btn-outline text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white text-lg'
                        onClick={() => window.location.href = '/'}
                    >
                        취소
                    </button>
                    <button
                        id='submit'
                        className='btn btn-outline text-yellow-500 border border-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white text-lg'
                        onClick={() => Sumbit()}
                    >
                        작성
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-start">
                
            </aside>
        </div>
    );
}


