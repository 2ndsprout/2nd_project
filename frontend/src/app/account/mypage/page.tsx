'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { deleteProfile, getProfile, getUser, saveImage, saveProfileImage, updateProfile } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput } from "@/app/Global/component/Method";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import AlertModal from "@/app/Global/component/AlertModal";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { confirmState, finalConfirm, closeConfirm } = useConfirm();
  const { alertState, showAlert, closeAlert } = useAlert();
  const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');

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
            const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
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
    saveProfileImage(formData)
      .then(r => setUrl(r?.url))
      .catch(e => console.log(e));
  }

  function update() {
    if (PROFILE_ID !== null) { // Ensure profileId is not null
      updateProfile({ id: parseInt(PROFILE_ID), name: name, url: url })
        .then(() => {
          closeConfirm();
          showAlert('프로필 수정이 완료되었습니다.', '/account/mypage');
        })
        .catch(e => {
          closeConfirm();
          showAlert('프로필 수정 중 오류가 발생했습니다.');
          console.log(e);
        });
    } else {
      closeConfirm();
      showAlert('프로필 ID가 존재하지 않습니다.');
    }
  }


  async function deleteProfiles() {
    try {
      await deleteProfile();
      closeConfirm();; // 비동기 함수 호출
      showAlert('프로필 삭제가 완료되었습니다.', '/account/profile');

    } catch (error) {
      closeConfirm();;
      console.error('탈퇴 처리 중 오류 발생:', error);
      showAlert('프로필 삭제중 오류가 발생했습니다.');
    }
  }

  return (
    <Profile user={user} profile={profile} isLoading={isLoading}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
        <div className="mt-9 w-[1300px] border-2 h-[600px] rounded-lg">
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
              <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!!error} onClick={() => finalConfirm(profile.name, '프로필을 수정하시겠습니까?', '수정', update)}>프로필 수정</button>
              <button
                onClick={() => finalConfirm(profile.name, '프로필을 삭제하시겠습니까?', '삭제', deleteProfiles)}
                className="text-xs text-red-500 hover:underline hover:font-bold mt-20"
              >
                프로필 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
      <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert}/>
    </Profile>
  );
}
