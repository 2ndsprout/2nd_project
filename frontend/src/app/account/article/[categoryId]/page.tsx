'use client'

import { getArticleList, getCommentList, getLoveInfo, getProfile, getUser, searchArticles } from "@/app/API/UserAPI";
import CategoryList from "@/app/Global/component/CategoryList";
import Main from "@/app/Global/layout/MainLayout";
import { getDate } from "@/app/Global/component/Method";
import Pagination from "@/app/Global/component/Pagination";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    commentCount?: number;
    loveCount?: number;
}

interface ArticlePage {
    content: Article[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export default function ArticleListPage() {
    const [articleList, setArticleList] = useState<Article[]>([]);
    const { categoryId } = useParams();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState<number>(0);
    const [isSearching, setIsSearching] = useState(false);

    const countTotalComments = (commentList: any[]): number => {
        return commentList.reduce((total, comment) => {
            return total + 1 + countTotalComments(comment.commentResponseDTOList || []);
        }, 0);
    };

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser().then(r => setUser(r)).catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile()
                    .then(r => {
                        setProfile(r)
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const fetchArticles = async (isSearch: boolean = false) => {
        try {
            let data: ArticlePage;
            if (isSearch && keyword.trim() !== '') {
                data = await searchArticles({
                    page: currentPage - 1,
                    keyword: keyword.trim(),
                    sort,
                    categoryId: Number(categoryId)
                });
            } else {
                data = await getArticleList({
                    page: currentPage - 1,
                    categoryId: Number(categoryId)
                });
            }

            const articlesWithCommentCount = await Promise.all(data.content.map(async (article) => {
                const commentResponse = await getCommentList({ articleId: article.articleId, page: 0 });
                const commentCount = countTotalComments(commentResponse.content);
                const loveResponse = await getLoveInfo(article.articleId);
                return { ...article, commentCount, loveCount: loveResponse.count };
            }));

            setArticleList(articlesWithCommentCount);
            setTotalPages(Math.max(1, data.totalPages));
            setTotalElements(data.totalElements);
            setCurrentPage(data.number + 1);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setError('게시물을 불러오는데 실패했습니다.');
        }
    };

    useEffect(() => {
        fetchArticles(isSearching);
    }, [categoryId, currentPage, isSearching]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, newPage));  // 페이지 번호가 1 미만이 되지 않도록 보장
    };

    const handleSearch = () => {
        setCurrentPage(1);
        setIsSearching(keyword.trim() !== '');
    };

    const handleReset = () => {
        setKeyword('');
        setSort(0);
        setIsSearching(false);
        setCurrentPage(1);
    };


    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="flex w-full h-full">
                <aside className="w-1/6 p-6 bg-gray-800 fixed absolute h-4/6">
                    <CategoryList userRole={user?.role}/>
                </aside>
                <div className="flex-1 max-w-7xl p-10 ml-[400px]">
                    {error ? (
                        <p className="text-red-500">{error}</p>
                    ) : articleList.length === 0 ? (
                        <p className="text-gray-400">게시물을 불러오는중...</p>
                    ) : (
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="w-1/2 p-4 text-left">제목</th>
                                    <th className="w-1/6 p-4 text-center"><span className="invisible">댓글,좋아요수</span></th>
                                    <th className="w-1/6 p-4 text-left">작성자</th>
                                    <th className="w-1/6 p-4 text-right">작성일자</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articleList.map((article) => (
                                    <tr key={article.articleId} className="border-b border-gray-700">
                                        <td className="p-4 text-left">
                                            <Link href={`/account/article/${categoryId}/detail/${article.articleId}`} className="hover:underline">
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td className="flex p-4 text-center">
                                            {(article.loveCount ?? 0) > 0 && (
                                                <div className="text-sm text-gray-400 flex items-center mr-4">
                                                    <img src="/full-like.png" alt="좋아요 아이콘" className="w-4 mr-1" />
                                                    [{article.loveCount}]
                                                </div>
                                            )}
                                            {(article.commentCount ?? 0) > 0 && (
                                                <div className="text-sm text-gray-400 flex items-center justify-center">
                                                    <img src="/icon-comment.png" alt="댓글 아이콘" className="w-4 h-4 mr-1" />
                                                    [{article.commentCount}]
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-left">{article.profileResponseDTO.name}</td>
                                        <td className="p-4 text-right text-gray-400">{getDate(article.createDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="mt-10 flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="검색..."
                                className="p-2 bg-gray-700 rounded text-white mr-2"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <select
                                className="p-2 bg-gray-700 rounded text-white mr-2"
                                value={sort}
                                onChange={(e) => setSort(Number(e.target.value))}
                            >
                                <option value={0}>제목</option>
                                <option value={1}>제목+내용</option>
                                <option value={2}>작성자</option>
                                <option value={3}>태그</option>
                            </select>
                            <button
                                className="p-2 bg-yellow-600 rounded hover:bg-yellow-400 text-white mr-2"
                                onClick={handleSearch}
                            >
                                검색
                            </button>
                            {isSearching && (
                                <button
                                    className="p-2 bg-gray-600 rounded hover:bg-gray-400 text-white"
                                    onClick={handleReset}
                                >
                                    초기화
                                </button>
                            )}
                        </div>
                        <Link href={`/account/article/${categoryId}/create`} className="p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 text-white">
                            등록
                        </Link>
                    </div>
                    {isSearching && keyword.trim() !== '' && (
                        <p className="mt-4 text-gray-400">
                            "{keyword}" 검색 결과 ({totalElements}건)
                        </p>
                    )}
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </Main>
    );
}