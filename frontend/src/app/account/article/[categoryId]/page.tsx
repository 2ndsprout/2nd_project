'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { getArticleList } from "@/app/API/UserAPI";
import { useParams } from "next/navigation";

interface Article {
    id?: number;
    title: string;
    content: string;
    categoryId: number;
    createDate: string;
    authorName: string;
}

export default function ArticleListPage() {
    const [articleList, setArticleList] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchArticles = async () => {
            const data = await getArticleList(Number(categoryId));
            setArticleList(data);
            setFilteredArticles(data); // 초기 로딩 시 모든 게시물을 설정
        };

        fetchArticles();
    }, [categoryId]);

    const handleSearch = () => {
        const results = articleList.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(results);
    };

    const getLinkClass = (id: number) => {
        return categoryId === String(id) ? "text-yellow-400 hover:underline" : "hover:underline";
    };

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 bg-gray-800">
                <div className="mt-5 ml-20">
                    <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>게시판</h2>
                    {/* oklch(80.39% 0.194 70.76 / 1) */}
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
            <div className="flex-1 p-10">
                {filteredArticles.length === 0 ? (
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
                            {filteredArticles.map((article) => (
                                <tr key={article.id} className="border-b border-gray-700">
                                    <td className="p-4 text-left">
                                        <Link href={`/account/article/detail/${article.id}`} className="hover:underline">
                                            {article.title}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-left">{article.authorName}</td>
                                    <td className="p-4 text-right text-gray-400">{article.createDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <input
                    type="text"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-10 mb-4 p-2 bg-gray-700 rounded text-white"
                />
                <button
                    onClick={handleSearch}
                    className="mb-4 p-2 bg-yellow-600 rounded hover:bg-yellow-400 text-white"
                >
                    검색
                </button>
                <div className="mt-6">
                    <Link href={`/account/article/${categoryId}/create`} className="text-blue-500 hover:underline">
                        게시물 등록하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
