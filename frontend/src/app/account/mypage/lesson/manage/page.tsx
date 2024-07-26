'use client'

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { deleteProfile, getCenterList, getProfile, getStaffLessonList, getUser, saveImage, saveProfileImage, updateProfile } from "@/app/API/UserAPI";
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
  const [lessons, setLessons] = useState([] as any[]);
  const [centerList, setCenterList] = useState([] as any[]);
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
            const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
            getCenterList()
              .then(r => {
                setCenterList(r);
              })
              .catch(e => console.log(e));
          }
          )
          .catch(e => console.log(e));
      } else {
        redirect('/account/profile');
      }
    } else {
      redirect('/account/login');
    }
  }, [ACCESS_TOKEN, PROFILE_ID]);

  return (
    <Profile user={user} profile={profile} isLoading={isLoading}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
        <div className="mt-9 w-[1300px] border-2 h-[600px] rounded-lg">
          {centerList?.map(center => (
            <div key={center.id}>
              <div className="text-xl font-bold mt-4 flex items-start w-full h-1/3 ml-[50px] text-orange-400">
                {center?.type === 'GYM' && '헬스장'}
                {center?.type === 'SWIMMING_POOL' && '수영장'}
                {center?.type === 'SCREEN_GOLF' && '스크린 골프장'}
                {center?.type === 'LIBRARY' && '도서관'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
      <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
    </Profile>
  );
}
