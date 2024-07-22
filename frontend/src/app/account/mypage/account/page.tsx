'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getProfile, getUser, saveImage, saveProfileImage, updateProfile, updateUser } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput } from "@/app/Global/Method";

export default function Page() {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [categories, setCategories] = useState([] as any []);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
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
      if (PROFILE_ID) {
        getProfile()
          .then(r => {
            setProfile(r);
            setUrl(r.url);
          })
          .catch(e => console.log(e));
      } else {
        redirect('/account/profile');
      }
    } else {
      redirect('/account/login');
    }
  }, [ACCESS_TOKEN, PROFILE_ID]);

  function Change(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    saveImage(formData)
      .then(r => setUrl(r?.url))
      .catch(e => console.log(e));
  }

//   function update() {
//     if (confirm('프로필을 수정하시겠습니까?')) {
//       if () { // Ensure profileId is not null
//         updateUser({ name: username, aptId: aptNum })
//           .then(() => {
//             window.location.href = '/account/mypage';
//           })
//           .catch(e => {
//             setError('프로필 업데이트 중 오류가 발생했습니다.');
//             console.log(e);
//           });
//       } else {
//         setError('프로필 ID가 설정되지 않았습니다.');
//       }
//     }
//   }
  

  return (
    <Profile user={user} profile={profile} categories={categories}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
        <div className="mt-9 w-[1300px] border-2 h-[600px] overflow-y-scroll rounded-lg">
          <div className="py-5 px-5">
            <div className="relative w-full h-auto flex justify-center items-center mb-10">
              <div className="w-[256px] h-[256px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
              <img src={url ? url : '/user.png'} alt='Profile Image' className='w-[256px] h-[256px] rounded-full' />
              <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files[0])} />
            </div>
            {/* <div className="mt-0 flex flex-col items-center relative">
            <label className='text-xs font-bold text-red-500 pb-5 absolute top-[-1.5rem]'>{error}</label>
              <input type="text" defaultValue={name} onChange={e => setName(e.target.value)} className='input input-bordered input-lg text-black' placeholder="이름을 입력해주세요" 
              onFocus={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))}
              onKeyUp={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))} />
              <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!!error} onClick={() => update()}>프로필 수정</button>
            </div> */}
          </div>
        </div>
      </div>
    </Profile>
  );
}
