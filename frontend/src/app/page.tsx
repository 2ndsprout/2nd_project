'use client';

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getArticleList, getCategoryList, getMyLessonList, getProfile, getUser } from "./API/UserAPI";

import Calendar from "./Global/component/Calendar";
import Slider from "./Global/component/Slider";
import Main from "./Global/layout/mainLayout";



export default function Page() {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState([] as any[]);
  const [notiArticleList, setNotiArticleList] = useState([] as any[]);
  const [freeArticleList, setFreeArticleList] = useState([] as any[]);
  const [saleArticleList, setSaleArticleList] = useState([] as any[]);
  const [lessons, setLessons] = useState([] as any[]);
  const [isLoading, setIsLoading] = useState(false);
  const [notiTotalElements, setNotiTotalElements] = useState(null as any);
  const [freeTotalElements, setFreeTotalElements] = useState(null as any);
  const [saleTotalElements, setSaleTotalElements] = useState(null as any);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
  const [urlList, setUrlList] = useState([] as any[]);
  const Router = useRouter();

  useEffect(() => {
    if (ACCESS_TOKEN) {
      getUser()
        .then(r => {
          setUser(r);
          console.log(r);
          if (Array.isArray(r.aptResponseDto.url)) {
            setUrlList(r.aptResponseDto.url);
          } else {
            console.log('urlList is not an array:', r.aptResponseDto.url);
          }
        })
        .catch(e => console.log(e));
        
      if (PROFILE_ID) {
        getProfile()
          .then(r => {
            setProfile(r);
            getCategoryList()
              .then(r => setCategories(r))
              .catch(e => console.log(e))
            getMyLessonList()
              .then(r => {
                r.forEach((r: any) => {
                  if(r.type === 'APPLIED') {
                    setLessons(prev => [...prev, r.lessonResponseDTO])
                  }
                });
                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 300);
              })
              .catch(e => {console.log(e); setIsLoading(true);});
          })
          .catch(e => {console.log(e); setIsLoading(true);});
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
    getArticleList({ 'categoryId': categoryId, 'page': 0 })
      .then((r) => {
        switch (categoryId) {
          case 1:
            setNotiArticleList(r.content);
            setNotiTotalElements(r.totalElements);
            console.log('noti', r);
            break;
          case 2:
            setFreeArticleList(r.content);
            setFreeTotalElements(r.totalElements);
            console.log(r);
            break;
          case 3:
            setSaleArticleList(r.content);
            setSaleTotalElements(r.totalElements);
            console.log(r);
            break;
          default:
            console.log("Invalid category ID");
        }
      })
      .catch((e) => console.log(e));
  };

  function getCategoryData(id: number) {

    switch (id) {
      case 1:
        return notiArticleList;
      case 2:
        return freeArticleList;
      case 3:
        return saleArticleList;
      default:
        return null;
    }
  }

  function getArticleIndex(id: number) {

    switch (id) {
      case 1:
        return notiTotalElements;
      case 2:
        return freeTotalElements;
      case 3:
        return saleTotalElements;
      default:
        return null;
    }
  }

  const defaultUrls = [
    '/apt1.png',
    '/apt2.png',
    '/apt3.png'
  ];

  const displayUrls = urlList.length === 0 ? defaultUrls : urlList;

  const handleRowClick = (categoryId: number, articleId: number) => {
    Router.push(`/account/article/${categoryId}/detail/${articleId}`);
  };

  return (
    <Main user={user} profile={profile} isLoading={isLoading}>
      <div className="mt-5 flex w-full justify-between h-[480px] px-0 px-5">
        <Slider urlList={displayUrls} />
        <Calendar lessons={lessons} height={480} width={900} />
      </div>
      <div className="w-[1400px] mt-5 flex justify-between items-start text-center mx-auto w-full px-16">
        {categories?.slice(0, 3).map((category) => (
          <div key={category.id} className="flex flex-col">
            <label className="text-start text-secondary font-bold text-xl pb-3 hover:text-primary hover:cursor-pointer">{category?.name}</label>
            <table className="table">
              <thead>
                <tr className="h-[40px] border-b-2 border-gray-500">
                  <th className="w-[100px] text-primary">번호</th>
                  <th className="w-[100px]">작성자</th>
                  <th className="w-[200px]">제목</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {getCategoryData(category.id)?.slice(0, 5).map((article, articleIndex) =>
                  <tr key={article.articleId} className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer" onClick={() => handleRowClick(category.id, article.articleId)}>
                    <td>{getArticleIndex(category.id) - articleIndex}</td>
                    <td>{article.profileResponseDTO.name}</td>
                    <td><div className="w-[250px] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-secondary">{article.title}</div></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>

    </Main>
  );
}
