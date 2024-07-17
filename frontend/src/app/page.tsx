'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getCategory, getProfile, getUser } from "./API/UserAPI";

import Slider from "./Global/Slider";
import Main from "./Global/layout/MainLayout";
interface pageProps {
  categories: any[];
}


export default function Page(props: pageProps) {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [category, setCategory] = useState(null as any);
  const [categories, setCategories] = useState([] as any[])
  const [articleList, setArticleList] = useState([] as any[])
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
  const [urlList, setUrlList] = useState([] as any[]);

  useEffect(() => {
    if (ACCESS_TOKEN)
      getUser()
        .then(r => {
          setUser(r);
          if (Array.isArray(r.aptResponseDto.urlList)) {

            setUrlList(r.aptResponseDto.urlList);

          } else {
            console.log('urlList is not an array:', r.aptResponseDto.urlList);
          }
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
          // getSearch({ Page: props.page, Keyword: encodeURIComponent(props.keyword)})
            // .then(r => setSearch(r))
            // .catch(e => console.log
        })
        .catch(e => console.log(e));
    else
      redirect('/account/profile');
  }, [PROFILE_ID]);
    function fetchCategory(data: number) {
      getCategory(data)
        .then(r => {
          setCategory(r);
        })
        .catch(e => console.log(e));
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
      <div className="flex justify-between w-[1200px]">
        <table>
          <caption>월별 판매 데이터</caption>
          <thead>
            <tr>
              <th scope="col">월</th>
              <th scope="col">판매량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1월</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2월</td>
              <td>120</td>
            </tr>
            <tr>
              <td>3월</td>
              <td>110</td>
            </tr>
          </tbody>
        </table>
        <table>
          <caption>월별 판매 데이터</caption>
          <thead>
            <tr>
              <th scope="col">월</th>
              <th scope="col">판매량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1월</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2월</td>
              <td>120</td>
            </tr>
            <tr>
              <td>3월</td>
              <td>110</td>
            </tr>
          </tbody>
        </table>
        <table>
          <caption>월별 판매 데이터</caption>
          <thead>
            <tr>
              <th scope="col">월</th>
              <th scope="col">판매량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1월</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2월</td>
              <td>120</td>
            </tr>
            <tr>
              <td>3월</td>
              <td>110</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Main>
  );
}
