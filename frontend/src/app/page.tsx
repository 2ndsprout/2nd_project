'use client'

import { useEffect, useState } from "react";
import Main from "./Global/layout/MainLayout";
import { redirect } from "next/navigation";
import { getApt, getProfile, getUser } from "./API/UserAPI";

interface pageProps {
  categories: any[];
}


export default function Page(props: pageProps) {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState(props.categories);
  const [apt, setApt] = useState(null as any);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

  useEffect(() => {
    if (ACCESS_TOKEN)
      getUser()
        .then(r => {
          setUser(r);
          getApt(r.aptResponseDto.aptId)
            .then(r => {
              setApt(r);
            })
            .catch(e => console.log(e));
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

  console.log(user, profile, apt);

  return <Main user={user} profile={profile} categories={categories}>
    fdsa
    </Main>

}
