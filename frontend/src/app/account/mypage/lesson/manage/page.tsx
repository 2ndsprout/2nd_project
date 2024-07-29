'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { deleteProfile, getCenterList, getProfile, getStaffLessonList, getUser, saveImage, saveProfileImage, updateProfile } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput } from "@/app/Global/component/Method";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import AlertModal from "@/app/Global/component/AlertModal";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";

export default function Page() {
  const Router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [lessons, setLessons] = useState([] as any[]);
  const [gymeLessons, setGymeLessons] = useState([] as any[]);
  const [swimmingLessons, setSwimmingLessons] = useState([] as any[]);
  const [golfLessons, setGolfLessons] = useState([] as any[]);
  const [libraryLessons, setLibraryLessons] = useState([] as any[]);
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
          })
          .catch(e => console.log(e));
      } else {
        redirect('/account/profile');
      }
    } else {
      redirect('/account/login');
    }
  }, [ACCESS_TOKEN, PROFILE_ID]);
  useEffect(() => {
    centerList?.forEach(center => {
      fetchLessonList(center?.id, center?.type);
    });
  }, [centerList]);

  const fetchLessonList = (centerId: number, centerType: string) => {
    getStaffLessonList(centerId)
      .then((r) => {
        switch (centerType) {
          case 'GYM':
            setGymeLessons(r);
            console.log('gym', r);
            break;
          case 'SWIMMING_POOL':
            setSwimmingLessons(r);
            console.log(r);
            break;
          case 'LIBRARY':
            setLibraryLessons(r);
            console.log(r);
            break;
          case 'SCREEN_GOLF':
            setGolfLessons(r);
            console.log(r);
            break;
          default:
            console.log("Invalid center ID");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleRowClick = (lessonId: number) => {
    Router.push(`/account/lesson/${lessonId}`);
  };

  function getCenterData(type: string) {

    switch (type) {
      case 'GYM':
        return gymeLessons;
      case 'SWIMMING_POOL':
        return swimmingLessons;
      case 'SCREEN_GOLF':
        return golfLessons;
      case 'LIBRARY':
        return libraryLessons;
      default:
        return null;
    }
  }

  return (
    <Profile user={user} profile={profile} isLoading={isLoading}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>레슨</label> 관리</label>
        <div className="mt-9 w-[1300px] border-2 h-[900px] rounded-lg">
          <div className="flex flex-wrap justify-center justify-between p-10">
            {centerList?.map(center => (
              <div key={center.id} className="w-[550px] p-10">
                <div className="text-xl font-bold flex items-star text-orange-400">
                  {center?.type === 'GYM' && '헬스장'}
                  {center?.type === 'SWIMMING_POOL' && '수영장'}
                  {center?.type === 'SCREEN_GOLF' && '스크린 골프장'}
                  {center?.type === 'LIBRARY' && '도서관'}
                </div>
                <div>
                  {getCenterData(center?.type)?.slice(0, 5)?.map((lesson) => (
                    <div key={lesson.id} className='flex items-center justify-between border-b-2 p-4'>
                      <div className='flex items-center'>
                        <div className='ml-4'>
                          <div className='text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-[300px]'>{lesson?.name}</div>
                        </div>
                      </div>
                      <button className='text-sm font-bold text-primary hover:text-secondary' onClick={() => handleRowClick(lesson.id)}>수정</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
      <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
    </Profile>
  );
}
