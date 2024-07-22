'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";

interface pageProps {
  categories: any[];
}

export default function Page(props: pageProps) {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState(props.categories);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

  useEffect(() => {
    if (ACCESS_TOKEN) {
      getUser()
        .then(r => {
          setUser(r);
        })
        .catch(e => console.log(e));
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
    }
    else
      redirect('/account/login');

  }, [ACCESS_TOKEN, PROFILE_ID]);

  return (
    <Profile user={user} profile={profile} categories={props.categories}>
      <div className='flex items-end'>
        <label className='text-xl font-bold'><label className='text-xl text-red-500 font-bold'>회원정보</label> 변경</label>
        <label className='text-xs h-[14px] border-l-2 border-gray-400 ml-2 mb-[5px] pl-2'>고객님의 회원정보를 수정하실 수 있습니다. 회원정보를 변경하시고 반드시 하단에 있는 <label className='font-bold'>확인</label> 버튼을 클릭해 주셔야 합니다.</label>
      </div>
    </Profile>
  );
}