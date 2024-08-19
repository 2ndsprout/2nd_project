'use client'

import { getArticleList, getAptList, getCenterList, getCategoryList, getTopArticleList, getCommentList, getLoveInfo, getProfile, getUser, searchArticles, getCategory } from "@/app/API/UserAPI";
import CategoryList from "@/app/Global/component/CategoryList";
import { getDate, getDateFormat, getDateTime, getDateTimeFormat } from "@/app/Global/component/Method";
import Pagination from "@/app/Global/component/Pagination";
import Main from "@/app/Global/layout/MainLayout";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ArticleListPage() {
    const [articleList, setArticleList] = useState([] as any[]);
    const [topArticleList, setTopArticleList] = useState([] as any[]);
    const { categoryId } = useParams();
    const [CategoryList, setCategoryList] = useState([] as any[]);
    const [user, setUser] = useState<any>(null);
    const [aptId, setAptId] = useState(0);
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
    const [aptList, setAptList] = useState([] as any[]);
    const [selectedAptId, setSelectedAptId] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchedKeyword, setSearchedKeyword] = useState('');
    const [noResults, setNoResults] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser().then(r => {
                setUser(r);
                console.log("사용자 데이터 : ", r);
                setIsAdmin(r.role === "ADMIN");
                setAptId(r.aptResponseDTO.aptId);
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
                        console.log("프로필 데이터 : ", r);
                        getCategoryList()
                            .then(r => {
                                setCategoryList(r);
                            })
                            .catch(e => console.error("카테고리 정보 가져오기 실패:", e));
                        getArticleList(Number(categoryId), aptId)
                            .then(r => {
                                setArticleList(r?.content);
                            }).catch(e => console.error("게시물 목록 가져오기 실패:", e));
                        getTopArticleList(Number(categoryId), aptId)
                            .then(r => {
                                setTopArticleList(r);
                            }).catch(e => console.error("공지 게시물 목록 가져오기 실패:", e));
                        getCenterList()
                            .then(r => setCenterList(r))
                            .catch(e => console.error("센터 목록 가져오기 실패:", e));
                    })
                    .catch(e => console.error("프로필 정보 가져오기 실패:", e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN, PROFILE_ID, categoryId]);

    const getLinkClass = (id: number) => {
        return Number(categoryId) === id ? "text-lg text-secondary flex mb-2 hover:underline font-bold" : "font-bold flex mb-2 text-lg hover:underline";
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="flex min-h-screen">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-start">
                        <h2 className="text-3xl font-bold  mb-10" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>게시판</h2>
                        <div className="mb-2 flex flex-col">
                            {CategoryList?.slice(1).map((category) =>
                                <div key={category?.id}>
                                    <Link href={`/account/article/${category.id}`} className={getLinkClass(category?.id)}>
                                        {category.name}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
                <div className="flex-col ml-[100px] mt-[50px] flex w-4/6 h-[1000px]">
                    <div className="text-lg border-b h-[50px] flex flex-row text-yellow-300">
                        <div className="ml-[50px] w-[700px]">제목</div>
                        <div className="flex w-[300px]">작성자</div>
                        <div className="flex w-[100px] flex justify-end">작성일자</div>
                    </div>
                    {topArticleList.map((topArticle) =>
                        <div key={topArticle?.id} className="flex flex-row border-b border-gray-600 p-[10px]">
                            <a className="flex flex-row" href={`/account/article/${categoryId}/detail/${topArticle?.articleId}`}>
                                <div className="flex w-[730px]"><div className="text-yellow-500 mr-[10px]">[공지]</div> {topArticle.title}</div>
                                <div className="w-[300px] justify-center">{topArticle.profileResponseDTO.name}</div>
                                <div className="w-[200px] justify-end">{getDateTimeFormat(topArticle.createDate)}</div>
                            </a>
                        </div>
                    )}
                    {articleList.map((article) =>
                        <div key={article?.id} className="flex flex-row border-b border-gray-600 p-[10px]">
                            <a className="flex flex-row" href={`/account/article/${categoryId}/detail/${article?.articleId}`}>
                            <div className="flex w-[730px]">{article.title}</div>
                            <div className="w-[300px] justify-center">{article.profileResponseDTO.name}</div>
                            <div className="w-[200px] justify-end">{getDateTimeFormat(article.createDate)}</div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
}