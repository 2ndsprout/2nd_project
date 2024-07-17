'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";

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
        if (ACCESS_TOKEN)
          getUser()
            .then(r => {
              setUser(r);
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

      console.log('user:', user, 'profile:', profile);

    return (
        <Main user={user} categories={categories} profile={profile}>
            fdsfdsfds
        </Main>
    );
}