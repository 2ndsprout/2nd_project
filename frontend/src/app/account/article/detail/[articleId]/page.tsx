'use client'

import Link from 'next/link';
import { getArticle } from '@/app/API/UserAPI';
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';

interface Article {
    id?: number;
    title: string;
    content: string;
    categoryId: number;
    createDate: number;
    // profile?: Profile;
    authorName: string;
}

export default function ArticleDetail () {
    const { articleId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const fetchedArticle = await getArticle(Number(articleId));
                setArticle(fetchedArticle);
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };

        if (articleId) {
            fetchArticle();
        }
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

    if (!article) {
        return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
    }

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    
    console.log(article.id)
    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 flex flex-col items-center">
                <div className="mt-5 flex justify-center">
                    <img src='/user.png' className='w-10 h-10 mb-2' alt="로고" />
                    <div className="mt-2 ml-5 text-lg font-semibold">{article.authorName || '알 수 없음'}</div>
                </div>
            </aside>
            <div className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-20 text-center">{article.title}</h1>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <p>{article.content}</p>
                </div>
                <div>
                    {/* {댓글 컨텐츠} */}
                </div>
                <div className="mt-6">
                    <Link href={`/account/article/${article.categoryId}`} className="text-blue-500 hover:underline">
                        돌아가기
                    </Link>
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-start">
                <div className="relative" id="dropdown">
                    <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600">
                        <span className="text-white">⁝</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute left-2 mt-2 w-20 bg-yellow-600 shadow-lg">
                            <div className="flex flex-col items-center">
                            <Link href="#" className="block w-full p-2 text-sm text-white text-center border-b border-gray-700 hover:bg-yellow-400 hover:text-black">
                                수정
                            </Link>
                            <Link href="#" className="block w-full p-2 text-sm text-white text-center hover:bg-yellow-400 hover:text-black">
                                삭제
                            </Link>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    )
}