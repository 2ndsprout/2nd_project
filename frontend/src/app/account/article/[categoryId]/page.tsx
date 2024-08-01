'use client'

import { getArticleList, getAptList, getCenterList, getCommentList, getLoveInfo, getProfile, getUser, searchArticles } from "@/app/API/UserAPI";
import CategoryList from "@/app/Global/component/CategoryList";
import { getDate } from "@/app/Global/component/Method";
import Pagination from "@/app/Global/component/Pagination";
import Main from "@/app/Global/layout/MainLayout";
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

interface AptInfo {
    aptId: number;
    aptName: string;
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
    const [centerList, setCenterList] = useState([] as any[]);
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState<number>(0);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [aptList, setAptList] = useState<AptInfo[]>([]);
    const [selectedAptId, setSelectedAptId] = useState(0);

    const countTotalComments = (commentList: any[]): number => {
        return commentList.reduce((total, comment) => {
            return total + 1 + countTotalComments(comment.commentResponseDTOList || []);
        }, 0);
    };

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser().then(r => {
                setUser(r);
                console.log("사용자 데이터 : ", r); // 디버깅용
                setIsAdmin(r.role === "ADMIN");
                setSelectedAptId(r.aptResponseDTO.aptId);
                
                if (r.role === "ADMIN") {
                    getAptList().then(aptData => {
                        setAptList(aptData);
                    }).catch(e => console.error("아파트 목록 가져오기 실패:", e));
                }
            }).catch(e => console.error("사용자 정보 가져오기 실패:", e));

            if (PROFILE_ID)
                getProfile()
                    .then(r => {
                        setProfile(r);
                        console.log("프로필 데이터 : ", r); // 디버깅용
                        getCenterList()
                            .then(r => setCenterList(r))
                            .catch(e => console.error("센터 목록 가져오기 실패:", e));
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                    })
                    .catch(e => console.error("프로필 정보 가져오기 실패:", e));
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
                    categoryId: Number(categoryId),
                    aptId: selectedAptId || undefined
                });
            } else {
                data = await getArticleList(
                    Number(categoryId),
                    selectedAptId || undefined,
                    currentPage - 1
                ); // UserAPI의 getArticleList Header순서에 맞춰야함
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
        if (selectedAptId) {
            fetchArticles(isSearching);
        }
    }, [categoryId, currentPage, isSearching, selectedAptId]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(Math.max(1, newPage));
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

    const handleAptChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAptId(Number(event.target.value));
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-1 w-full">
                    <div className="flex w-full h-full">
                        <aside className="w-1/6 p-6 bg-gray-800 fixed absolute h-4/6">
                            <CategoryList userRole={user?.role} />
                        </aside>
                        <div className="flex-1 max-w-7xl p-10 ml-[400px]">
                            {isAdmin && (
                                <div className="mb-6">
                                    <select 
                                        value={selectedAptId || ''}
                                        onChange={handleAptChange}
                                        className="p-2 bg-gray-700 rounded text-white"
                                    >
                                        {aptList.map(apt => (
                                            <option key={apt.aptId} value={apt.aptId}>
                                                {apt.aptName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <h2 className="text-2xl font-bold mb-6">
                                {isAdmin 
                                    ? `선택된 아파트: ${aptList.find(apt => apt.aptId === selectedAptId)?.aptName || ''}`
                                    : `${user?.aptResponseDTO?.aptName || ''} 게시판`
                                }
                            </h2>
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
                </div>
            </div>
        </Main>
    );
}