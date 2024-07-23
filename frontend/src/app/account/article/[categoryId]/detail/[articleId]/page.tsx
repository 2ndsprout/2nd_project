'use client'

import React, { useEffect, useState } from 'react';
import { getArticle, getProfile, getUser } from '@/app/API/UserAPI';
import { getDateTimeFormat } from '@/app/Global/Method';
import Link from 'next/link';
import { redirect, useParams } from "next/navigation";
import CommentList from '../../../comment/page'
import DOMPurify from 'dompurify';
import Main from '@/app/Global/layout/MainLayout';

interface Article {
    categoryId: number;
    articleId: number;
    title: string;
    content: string;
    createDate: number;
    categoryName: string;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    urlList: string[] | null;
    topActive: boolean;
    tagResponseDTOList: any[];
}

export default function ArticleDetail() {
    const { categoryId, articleId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [user, setUser] = useState(null as any);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');

    const BACKEND_URL = 'http://localhost:8080'; // 로컬 백엔드 서버 URL, 서버 배포시 수정예정

    const renderSafeHTML = (content: string) => {
        // 이미지 URL을 절대 경로로 변환
        const processedContent = content.replace(/src="\/api/g, `src="${BACKEND_URL}/api`);

        const sanitizedContent = DOMPurify.sanitize(processedContent);

        return { __html: sanitizedContent };
    };

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile()
                    .then(r => {
                        setProfile(r);
                        // getSearch({ Page: props.page, Keyword: encodeURIComponent(props.keyword)})
                        // .then(r => setSearch(r))
                        // .catch(e => console.log
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');

    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        console.log("articleId:", articleId);
        console.log("categoryId:", categoryId);
    }, [categoryId, articleId]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (articleId) {
                    const fetchedArticle = await getArticle(Number(articleId));
                    setArticle(fetchedArticle);
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        fetchArticle();
    }, [articleId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        // 삭제 API 호출
        // deleteArticle()
        //     .then(() => {
        //         console.log("article deleted!");
        //     })
        //     .catch(e => console.log(e));
        setShowDeleteConfirm(false);
        // 페이지 리다이렉트 등 추가 작업 필요
    };

    if (!article) {
        return <div className="flex items-center justify-center h-screen text-gray-400">게시물을 불러오는 중입니다...</div>;
    }

    return (
        <Main user={user} profile={profile}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6 flex flex-col items-center">
                    <div className="mt-5 flex justify-center">
                        <img src='/user.png' className='w-10 h-10 mb-2' alt="로고" />
                        <div className="mt-2 ml-5 text-lg font-semibold">{article.profileResponseDTO.name || '알 수 없음'}</div>
                    </div>
                </aside>
                <div className="w-4/6 p-10">
                    <div className="text-3xl font-bold mb-20 text-center">{article.title}</div>
                    <div className="text-end mb-2">{getDateTimeFormat(article.createDate)}</div>
                    <div className="bg-gray-800 min-h-[600px] p-6 rounded-lg shadow-lg">
                        <div dangerouslySetInnerHTML={renderSafeHTML(article.content)} />
                    </div>
                    <div>
                        {/* 좋아요 댓글수 표시, 댓글 입력창*/}
                        <CommentList articleId={article.articleId} />
                    </div>
                    <div className="mt-6">
                        {/* <Link href={`/account/article/${article.categoryId}`} className="text-blue-500 hover:underline">
                        돌아가기
                    </Link> */}
                    </div>
                </div>
                <aside className="w-1/6 p-6 flex flex-col items-start h-full">
                    <div className="relative" id="dropdown">
                        <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600">
                            <span className="text-white">⁝</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute left-2 mt-2 w-20 bg-yellow-600 shadow-lg">
                                <div className="flex flex-col items-center">
                                    <Link href={`/account/article/${categoryId}/update/${article.articleId}`} className="block w-full p-2 text-sm text-white text-center border-b border-gray-700 hover:bg-yellow-400 hover:text-white">
                                        수정
                                    </Link>
                                    <button onClick={handleDelete} className="block w-full p-2 text-sm text-white text-center hover:bg-yellow-400 hover:text-white">
                                        삭제
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-5 rounded shadow-lg">
                            <div className="text-lg font-semibold text-white">삭제 확인</div>
                            <p className="text-gray-400">이 게시물을 삭제하시겠습니까?</p>
                            <div className="mt-4 flex justify-end">
                                <button onClick={() => setShowDeleteConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
                                <button onClick={confirmDelete} className="p-2 bg-red-600 rounded text-white hover:bg-red-500">삭제</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Main>
    );
}
