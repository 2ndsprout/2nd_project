'use client'

import { getArticleList, getProfile, getUser, getCommentList } from "@/app/API/UserAPI";
import { getDate } from "@/app/Global/Method";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryList from "@/app/Global/CategoryList";

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
    commentCount?: number; // 추가: 댓글 수
}

interface ArticlePage {
    content: Article[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface CommentResponseDTO {
    id: number;
    articleId: number;
    content: string;
    createDate: number;
    parentId: number | null;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    commentResponseDTOList: CommentResponseDTO[];
}

export default function ArticleListPage() {
    const [articleList, setArticleList] = useState<Article[]>([]);
    const { categoryId } = useParams();
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

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
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');

    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        fetchArticles();
    }, [categoryId, currentPage]);

    const countTotalComments = (commentList: CommentResponseDTO[]): number => {
        return commentList.reduce((total, comment) => {
            return total + 1 + countTotalComments(comment.commentResponseDTOList);
        }, 0);
    };

    const getCommentCount = async (articleId: number): Promise<number> => {
        try {
            const response = await getCommentList({ articleId, page: 0 });
            return countTotalComments(response.content);
        } catch (error) {
            console.error('댓글 수를 가져오는데 실패했습니다:', error);
            return 0;
        }
    };

    const fetchArticles = async () => {
        try {
            const data: ArticlePage = await getArticleList({ Page: currentPage, CategoryId: Number(categoryId) });
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);

            // 각 게시물의 댓글 수를 비동기적으로 가져옵니다
            const articlesWithCommentCount = await Promise.all(data.content.map(async (article) => {
                const commentCount = await getCommentCount(article.articleId);
                return { ...article, commentCount };
            }));

            setArticleList(articlesWithCommentCount);
        } catch (error) {
            console.error(error);
            setError('게시물을 불러오는데 실패했습니다.');
        }
    };

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 bg-gray-800">
                <CategoryList />
            </aside>
            <div className="flex-1 max-w-7xl p-10">
                <h3 className="text-xl font-bold mb-4">게시물 목록 (총 {totalElements}개)</h3>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : articleList.length === 0 ? (
                    <p className="text-gray-400">게시물이 없습니다.</p>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="w-3/4 p-4 text-center">제목</th>
                                <th className="w-1/4 p-4 text-left">작성자</th>
                                <th className="w-1/4 p-4 text-right">작성일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articleList.map((article) => (
                                <tr key={article.articleId} className="border-b border-gray-700">
                                    <td className="p-4 text-left">
                                        <Link href={`/account/article/${categoryId}/detail/${article.articleId}`} className="hover:underline">
                                            {article.title}
                                        </Link>
                                        <span className="ml-2 text-sm text-gray-400">
                                            [{article.commentCount ?? 0}]
                                        </span>
                                    </td>
                                    <td className="p-4 text-left">{article.profileResponseDTO.name}</td>
                                    <td className="p-4 text-right text-gray-400">{getDate(article.createDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="mt-6 flex justify-between items-center">
                    <div>
                        <input
                            type="text"
                            placeholder="검색..."
                            className="p-2 bg-gray-700 rounded text-white"
                        />
                        <button
                            className="p-2 bg-yellow-600 rounded hover:bg-yellow-400 text-white"
                        >
                            검색
                        </button>
                    </div>
                    <Link href={`/account/article/${categoryId}/create`} className="p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 text-white">
                        등록
                    </Link>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        이전
                    </button>
                    <span className="mx-4">
                        페이지 {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}