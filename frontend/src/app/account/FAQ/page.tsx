'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, getArticleList, getCategoryList, getCenterList } from "@/app/API/UserAPI";
import Pagination from "@/app/Global/component/Pagination";
import Main from "@/app/Global/layout/MainLayout";

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

export default function Page() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [articleList, setArticleList] = useState([] as any[]);
    const [openArticleIds, setOpenArticleIds] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [categoryId, setCategoryId] = useState<any>(null);
    const [centerList, setCenterList] = useState([] as any[]);
    const [selectedAptId, setSelectedAptId] = useState<number | null>(null);
    const router = useRouter();


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    setSelectedAptId(r.aptResponseDTO.aptId);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                        setProfile(r);
                        getCategoryList()
                            .then(r => {
                                setCategories(r);
                                r.forEach((r: any) => {
                                    if (r?.name === 'FAQ') {
                                        setCategoryId(r.id);
                                        getArticleList(r.id) // 테트트 때멘 아파트 아이디 넣고  FAQ는 SECURITY 담당이니 추후에 APTID 는 빼야함
                                            .then(r => {
                                                setArticleList(r?.content);
                                                setTotalPages(r.totalPages);
                                            })
                                            .catch(e => console.log(e));
                                    }
                                });
                            })
                        const interval = setInterval(() => {
                            setIsLoading(true);
                            clearInterval(interval);
                        }, 100);
                    })
            } else {
                router.push('/account/profile');
            }
        } else {
            router.push('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const handleCheckboxChange = (articleId: number) => {
        setOpenArticleIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(articleId)) {
                newSet.delete(articleId);
            } else {
                newSet.add(articleId);
            }
            return newSet;
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        console.log('category', categoryId);
        console.log('apt', categoryId);
        console.log('current', currentPage);

        getArticleList(categoryId, user.aptResponseDTO.aptId, newPage-1) // 테트트 때멘 아파트 아이디 넣고  FAQ는 SECURITY 담당이니 추후에 APTID 는 빼야함
            .then(r => {
                console.log(r);
                setArticleList(r.content);
                setTotalPages(r.totalPages);
            })
            .catch(e => console.log(e));
    };




    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-start">
                        <h2 className="text-3xl font-bold  mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>관리사무소</h2>
                        <div className="mb-2 flex flex-col">
                            <a href="/account/FAQ/" className="hover:underline text-yellow-400">FAQ</a>
                            <a href="/" className="hover:underline">건의사항</a>
                            <a href="/" className="hover:underline">1:1 문의</a>
                        </div>
                    </div>
                </aside>
                <div className="w-[1500px] flex flex-col items-center">
                    <h2 className="w-[1100px] text-3xl font-bold mb-4 mt-10 ml-[-40px]" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>FAQ</h2>
                    {articleList?.map((article, index) => (
                        <div key={article?.articleId} className="flex justify-center items-center ml-[-40px] mr-[20px] flex-col">
                            <div className={`collapse bg-gray-700 w-[1100px] mt-[20px] ${openArticleIds.has(article?.articleId) ? '' : 'hover:text-secondary'}`}>
                                <input
                                    type="checkbox"
                                    checked={openArticleIds.has(article?.articleId)}
                                    onChange={() => handleCheckboxChange(article?.articleId)}
                                />
                                <div className="collapse-title text-xl font-medium h-full ml-5">
                                    Q : {article?.title}
                                </div>
                                <div className="collapse-content w-[900px] whitespace-normal overflow-hidden">
                                    <p className="break-words p-5">A : {article?.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
};