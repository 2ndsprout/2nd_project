'use client'

import { getArticleList, getProfile, getUser } from "@/app/API/UserAPI";
import { getDate } from "@/app/Global/Method";
import Pagination from "@/app/Global/Pagination";
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

    useEffect(() => {
        if (PROFILE_ID)
            getProfile()
                .then(r => {
                    setProfile(r);
                })
                .catch(e => console.log(e));
        else
            redirect('/account/profile');
    }, [PROFILE_ID]);

    useEffect(() => {
        const fetchArticles = async (page: number) => {
            try {
                const data: ArticlePage = await getArticleList({ Page: page - 1, CategoryId: Number(categoryId) });
                setArticleList(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error(error);
                setError('게시물을 불러오는데 실패했습니다.');
            }
        };

        fetchArticles(currentPage);
    }, [categoryId, currentPage]);

    const getLinkClass = (id: number) => {
        return categoryId === String(id) ? "text-yellow-400 hover:underline" : "hover:underline";
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
      <div className="bg-black w-full min-h-screen text-white flex">
        <aside className="w-1/6 p-6 bg-gray-800">
          <div className="mt-5 ml-20">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>게시판</h2>
            <ul>
              <li className="mb-2">
                <Link href="/account/article/1" className={getLinkClass(1)}>자유게시판</Link>
              </li>
              <li className="mb-2">
                <Link href="/account/article/2" className={getLinkClass(2)}>공지사항</Link>
              </li>
              <li className="mb-2">
                <Link href="/account/article/3" className={getLinkClass(3)}>중고거래 게시판</Link>
              </li>
            </ul>
          </div>
        </aside>
        <div className="flex-1 max-w-7xl p-10">
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
                      <Link href={`/account/article/detail/${article.articleId}`} className="hover:underline">
                        {article.title}
                      </Link>
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
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    );
}
