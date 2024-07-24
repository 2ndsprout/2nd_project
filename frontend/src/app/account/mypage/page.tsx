'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { deleteProfile, getProfile, getUser, saveImage, saveProfileImage, updateProfile } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput } from "@/app/Global/Method";

export default function Page() {
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [profleConfirm, setProfleConfirm] = useState(false);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

  useEffect(() => {
    if (ACCESS_TOKEN) {
      getUser()
        .then(r => {
          setUser(r);
        })
        .catch(e => console.log(e));
      if (PROFILE_ID) {
        getProfile()
          .then(r => {
            setProfile(r);
            setName(r.name);
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

  function update() {
    if (confirm('프로필을 수정하시겠습니까?')) {
      if (PROFILE_ID !== null) { // Ensure profileId is not null
        updateProfile({ id: (parseInt(PROFILE_ID)), name: name, url: url })
          .then(() => {
            window.location.href = '/account/mypage';
          })
          .catch(e => {
            setError('프로필 업데이트 중 오류가 발생했습니다.');
            console.log(e);
          });
      } else {
        setError('프로필 ID가 설정되지 않았습니다.');
      }
    }
  }

  function confirmDelete() {
    setProfleConfirm(true);
  }

  async function deleteProfiles() {
    try {
      setProfleConfirm(false);
      await deleteProfile(); // 비동기 함수 호출
      alert('삭제되었습니다.');
      window.location.href = '/account/profile';
    } catch (error) {
      setProfleConfirm(false);
      console.error('탈퇴 처리 중 오류 발생:', error);
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  }

  return (
    <Profile user={user} profile={profile}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
        <div className="mt-9 w-[1300px] border-2 h-[600px] overflow-y-scroll rounded-lg">
          <div className="py-5 px-5">
            <div className="relative w-full h-auto flex justify-center items-center mb-10">
              <div className="w-[256px] h-[256px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
              <img src={url ? url : '/user.png'} alt='Profile Image' className='w-[256px] h-[256px] rounded-full' />
              <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files[0])} />
            </div>
            <div className="mt-0 flex flex-col items-center relative">
              <label className='text-xs font-bold text-red-500 pb-5 absolute top-[-1.5rem]'>{error}</label>
              <input type="text" defaultValue={name} onChange={e => setName(e.target.value)} className='input input-bordered input-lg text-black' placeholder="이름을 입력해주세요"
                onFocus={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))}
                onKeyUp={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))} />
              <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!!error} onClick={() => update()}>프로필 수정</button>
              <button
                onClick={() => confirmDelete()}
                className="text-xs  text-red-500 hover:underline hover:font-bold mt-20"
              >
                프로필 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        profleConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-5 rounded shadow-lg">
              <div className="text-lg font-semibold text-secondary">{profile.name}</div>
              <p className="text-gray-400">프로필을 삭제 하시겠습니까?</p>
              <div className="mt-4 flex justify-end">
                <button onClick={() => setProfleConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
                <button onClick={() => deleteProfiles()} className="p-2 bg-yellow-600 rounded text-white hover:bg-yellow-500">삭제</button>
              </div>
            </div>
          </div>
        )
      }
    </Profile>
  );
}
