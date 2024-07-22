'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser, saveImage, saveProfileImage } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";


export default function Page() {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState([] as any []);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [aptNum, setAptNum] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [aptName, setAptName] = useState('');
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

  useEffect(() => {
    if (ACCESS_TOKEN) {
      getUser()
        .then(r => {
          setUser(r);
          setEmail(r.email);
          setUsername(r.username);
          setAptNum(r.aptNum);
          setRoadAddress(r.aptResponseDTO.roadAddress);
          setAptName(r.aptResponseDTO.aptName);
        })
        .catch(e => console.log(e));
      if (PROFILE_ID)
        getProfile()
          .then(r => {
            setProfile(r);
            setName(r.name);
            setUrl(r.url);
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

  function Change(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    saveImage(formData)
        .then(r => setUrl(r?.url))
        .catch(e => console.log(e));
}

  return (
    <Profile user={user} profile={profile} categories={categories}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
        <div className="mt-9 w-[1300px] border-2 h-[600px] overflow-y-scroll rounded-lg">
          <div className="py-5 px-5">
            <div className="relative w-full h-auto flex justify-center items-center mb-10">
              <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
              <img src={url == '' ? url : '/user.png'} alt='main Image' className='w-[128px] h-[128px] rounded-full' />
              <input id='file' hidden type='file' onChange={e => Change(e.target.files?.[0])} />
            </div>
            <div>
              fdsafdsa
            </div>
            <div>
              fdsfafdsafdsfdsa
            </div>
          </div>
        </div>
      </div>
    </Profile>
  );
}