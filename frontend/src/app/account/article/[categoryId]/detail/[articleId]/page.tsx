'use client'

import { deleteArticle, getArticle, getProfile, getUser } from '@/app/API/UserAPI';
import Main from "@/app/Global/layout/MainLayout";
import { getDateTimeFormat } from '@/app/Global/component/Method';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import CommentList from '../../../comment/page';

interface Tag {
    id: number;
    name: string;
}

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
    tagResponseDTOList: Tag[];
}

export default function ArticleDetail() {
    const { categoryId, articleId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [user, setUser] = useState(null as any);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null as any);
    const [categories, setCategories] = useState<any[]>([]);
    const [ isDeleted, setIsDeleted ] = useState(false);
    const router = useRouter();
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
        try {
            if (articleId) {
                await deleteArticle(Number(articleId));
                console.log("게시물이 성공적으로 삭제되었습니다.");
                setIsDeleted(true);
                setShowDeleteConfirm(false);
                setTimeout(() => {
                    router.push(`/account/article/${categoryId}`);
                }, 100);
            }
        } catch (error) {
            console.error('게시물 삭제 중 오류 발생:', error);
            setError('게시물 삭제 중 오류가 발생했습니다.');
        }
    };

    if (isDeleted) {
        return <div className="flex items-center justify-center h-screen text-gray-400">게시물이 삭제되었습니다.</div>;
    }

    if (!article) {
        return <div className="flex items-center justify-center h-screen text-gray-400">게시물을 불러오는 중입니다...</div>;
    }

    const content = (
        <div className="flex w-full">
            <aside className="w-1/6 p-6 flex flex-col items-center">
                <div className="mt-5 flex flex-col items-center">
                    <img src='/user.png' className='w-16 h-16 mb-2 rounded-full' alt="프로필" />
                    <div className="mt-2 text-lg font-semibold">{article.profileResponseDTO.name || '알 수 없음'}</div>
                </div>
            </aside>
            <div className="w-4/6 p-10 flex flex-col">
                <div className="text-3xl font-bold mb-10 text-center">{article.title}</div>
                <div className="text-end mb-2">{getDateTimeFormat(article.createDate)}</div>
                <div className="bg-gray-800 flex flex-col min-h-[600px] p-6 rounded-lg shadow-lg">
                    <div className="flex-grow" dangerouslySetInnerHTML={renderSafeHTML(article.content)} />
                    <div className="mt-4">
                    {/* <h3 className="text-lg font-semibold">태그:</h3> */}
                    <ul className="flex flex-wrap">
                        {article.tagResponseDTOList.map(tag => (
                            <li key={tag.id} className="bg-gray-700 text-white rounded-full px-3 py-1 text-sm mr-2 inline-block">
                                #{tag.name}
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
                <div className="mt-6">
                    <CommentList articleId={Number(articleId)} />
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-start">
                <div className="relative" id="dropdown">
                    <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600">
                        <span className="text-white">⁝</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute mt-2 bg-gray-800 rounded shadow-lg overflow-hidden">
                            <div className="flex flex-col w-20">
                                <Link 
                                    href={`/account/article/${categoryId}/update/${article.articleId}`} 
                                    className="block w-full px-4 py-2 text-sm text-white text-center hover:bg-yellow-600 transition-colors"
                                >
                                    수정
                                </Link>
                                <button 
                                    onClick={handleDelete} 
                                    className="block w-full px-4 py-2 text-sm text-white text-center hover:bg-yellow-600 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );

    return (
        <Main user={user} profile={profile}>
            {content}
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
        </Main>
    );
}
