'use client';

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getArticleList, getCategoryList, getProfile, getUser } from "./API/UserAPI";

import Slider from "./Global/Slider";
import Main from "./Global/layout/MainLayout";

interface pageProps {
  categories: any[];
}

export default function Page(props: pageProps) {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState(props.categories);
  const [notiArticleList, setNotiArticleList] = useState([] as any[]);
  const [freeArticleList, setFreeArticleList] = useState([] as any[]);
  const [saleArticleList, setSaleArticleList] = useState([] as any[]);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
  const [urlList, setUrlList] = useState([] as any[]);

  useEffect(() => {
    if (ACCESS_TOKEN) {
      getUser()
        .then(r => {
          setUser(r);
          console.log(r);
          if (Array.isArray(r.AptResponseDTO.url)) {
            setUrlList(r.AptResponseDTO.url);
          } else {
            console.log('urlList is not an array:', r.AptResponseDTO.url);
          }
        })
        .catch(e => console.log(e));
      if (PROFILE_ID) {
        getProfile()
          .then(r => {
            setProfile(r);
            getCategoryList()
              .then(r => setCategories(r))
              .catch(e => console.log(e));
          })
          .catch(e => console.log(e));
      } else {
        redirect('/account/profile');
      }
    } else {
      redirect('/account/login');
    }
  }, [ACCESS_TOKEN, PROFILE_ID]);

  useEffect(() => {
    categories?.slice(0, 3).forEach(category => {
      fetchArticleList(category?.id);
    });
  }, [categories]);

  const fetchArticleList = (categoryId: number) => {
    getArticleList({ 'CategoryId': categoryId, 'Page': 0 })
      .then((r) => {
        switch (categoryId) {
          case 1:
            setNotiArticleList(r.content);
            console.log(r.content);
            break;
          case 2:
            setFreeArticleList(r.content);
            console.log(r.content);
            break;
          case 3:
            setSaleArticleList(r.content);
            console.log(r.content);
            break;
          default:
            console.log("Invalid category ID");
        }
      })
      .catch((e) => console.log(e));
  };

  const defaultUrls = [
    '/apt1.png',
    '/apt2.png',
    '/apt3.png'
  ];

  const displayUrls = urlList.length === 0 ? defaultUrls : urlList;

  return (
    <Main user={user} profile={profile} categories={categories}>
      <div className="mt-10 flex w-full mx-auto">
        <div className="ml-10 w-[900px] h-[450px]">
          <Slider urlList={displayUrls} />
        </div>
      </div>
      <div className="flex justify-center items-center text-center mx-auto w-full">
        {categories?.slice(0, 3).map((category, index) => (
          <div key={index} className="h-[400px] w-[500px] mb-10">
            <h1 className="ml-8 text-start">{category?.name}</h1>
            <div className="border-b-2 mt-6 ml-[30px] flex items-center w-[400px]">
              <div className="font-bold mr-14">번호</div>
              <div className="font-bold mr-36">작성자</div>
              <div className="font-bold">제목</div>
            </div>
            {category.id === 1 && notiArticleList?.slice(0, 4).map((article, articleIndex) => (
              <div key={articleIndex} className="border-b-2 mt-4 ml-[30px] flex items-center w-[400px]">
                <div className="mr-16">{articleIndex + 1}</div>
                <div className="mr-20 overflow-hidden overflow-ellipsis whitespace-nowrap">{article.profileResponseDTO.name}</div>
                <div>{article.title}</div>
              </div>
            ))}
            {category.id === 2 && freeArticleList?.slice(0, 4).map((article, articleIndex) => (
              <div key={articleIndex} className="mt-2 ml-[30px] flex items-center w-[400px]">
                <div className="mr-16">{articleIndex + 1}</div>
                <div className="mr-20 overflow-hidden overflow-ellipsis whitespace-nowrap">{article.profileResponseDTO.name}</div>
                <div>{article.title}</div>
              </div>
            ))}
            {category.id === 3 && saleArticleList?.slice(0, 4).map((article, articleIndex) => (
              <div key={articleIndex} className="ml-[30px] flex items-center w-[400px]">
                <div className="mr-16">{articleIndex + 1}</div>
                <div className="mr-20 overflow-hidden overflow-ellipsis whitespace-nowrap">{article.profileResponseDTO.name}</div>
                <div>{article.title}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </Main>
  );
}
