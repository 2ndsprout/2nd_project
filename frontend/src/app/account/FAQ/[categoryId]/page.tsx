'use client'

import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { getProfile, getUser, getArticleList } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";

interface Article {
    categoryId: number;
    articleId: number;
    title: number;
    content: string;
    page: number;
}

export default function Page() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [articleList, setArticleList] = useState<Article[]>([]);
    const { categoryId } = useParams();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getArticleList(r)
                            .then(r => {
                                setArticleList([]);
                            }).catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-start">
                        <h2 className="text-3xl font-bold  mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>관리사무소</h2>
                        <div className="mb-2 flex flex-col">
                            <a href="/account/FAQ/4" className="hover:underline text-yellow-400">FAQ</a>
                            <a href="/" className="hover:underline">건의사항</a>
                            <a href="/" className="hover:underline">1:1 문의</a>
                        </div>
                    </div>
                </aside>
                <div>
                    {articleList?.map((article) =>
                        <div key={article.articleId}>
                            <p>{article.title}</p>
                        </div>
                    )}
                </div>
            </div>
        </Main>
    );
};