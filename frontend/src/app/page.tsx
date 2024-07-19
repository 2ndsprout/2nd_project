'use client';

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getArticleList, getCategoryList, getProfile, getUser } from "./API/UserAPI";

import Slider from "./Global/Slider";
import Main from "./Global/layout/mainLayout";

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
  const [notiTotalElements, setNotiTotalElements] = useState(null as any);
  const [freeTotalElements, setFreeTotalElements] = useState(null as any);
  const [saleTotalElements, setSaleTotalElements] = useState(null as any);
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
            setNotiTotalElements(r.totalElements);
            console.log(r);
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

  function getCategoryData( id: number ) {

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

  function getArticleIndex( id: number) {

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


  return (
    <Main user={user} profile={profile} categories={categories}>
      <div className="mt-10 flex w-full mx-auto">
        <div className="ml-10 w-[900px] h-[450px]">
          <Slider urlList={displayUrls} />
        </div>
      </div>
      <div className="w-[1400px] mt-5 flex justify-between items-start text-center mx-auto w-full">
        {categories?.slice(0, 3).map((category, index) => (
          <div className="flex flex-col">
            <label className="text-start text-secondary font-bold text-xl pb-3 hover:text-primary hover:cursor-pointer">{category?.name}</label>
            <table key={index}>
              <thead>
                <tr className="h-[40px] border-b-2 border-gray-500">
                  <th className="w-[100px] text-primary">번호</th>
                  <th className="w-[100px]">작성자</th>
                  <th className="w-[200px]">제목</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {getCategoryData(category.id)?.slice(0, 4).map((article, articleIndex) => 
                <tr className="border-gray-500 border-b-[1px] hover:text-primary hover:cursor-pointer">
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
