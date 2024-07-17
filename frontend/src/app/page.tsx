'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser } from "./API/UserAPI";
import Main from "./Global/layout/MainLayout";
import Slider from "./Global/Slider";

interface pageProps {
  categories: any[];
}


export default function Page(props: pageProps) {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState(props.categories);
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
        })
        .catch(e => console.log(e));
    else
      redirect('/account/profile');
  }, [PROFILE_ID]);

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
      <div>
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
