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
import Pagination from "@/app/Global/component/Pagination";

interface Center {
  id: number;
  type: string;
}

export default function Page() {
  const Router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [lessons, setLessons] = useState([] as any[]);
  const [centerList, setCenterList] = useState([] as any[]);
  const { confirmState, finalConfirm, closeConfirm } = useConfirm();
  const { alertState, showAlert, closeAlert } = useAlert();
  const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

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
            getCenterList()
              .then(r => {
                setCenterList(r);
                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
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
    //   centerList?.forEach(center => {
    //     fetchLessonList(center?.id, center?.type);
    //   });
    // }, [centerList]);
    if (selectedCenter) {
      fetchLessonList(selectedCenter.id, selectedCenter.type);
    }
  }, [selectedCenter]);

  const fetchLessonList = (centerId: number, centerType: string) => {
    getStaffLessonList(centerId)
      .then((r) => {
        switch (centerType) {
          case 'GYM':
            setLessons(r);
            console.log('gym', r);
            break;
          case 'SWIMMING_POOL':
            setLessons(r);
            console.log(r);
            break;
          case 'LIBRARY':
            setLessons(r);
            console.log(r);
            break;
          case 'SCREEN_GOLF':
            setLessons(r);
            console.log(r);
            break;
          default:
            console.log("Invalid center ID");
        }
      })
      .catch((e) => console.log(e));
  };

  const handleRowClick = (lessonId: number) => {
    // Router.push(`/account/lesson/${lessonId}`);
  };

  const handleButtonClick = (center: Center) => {
    setSelectedCenter(center);
  };

  function getCenterData(type: string) {

    switch (type) {
      case 'GYM':
        return lessons;
      case 'SWIMMING_POOL':
        return lessons;
      case 'SCREEN_GOLF':
        return lessons;
      case 'LIBRARY':
        return lessons;
      default:
        return null;
    }
  }

  return (
    <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>레슨</label> 관리</label>
        <div className="mt-9 w-[1300px] border-2 h-[900px] rounded-lg">
          <div className="flex flex-col justify-center justify-between p-10">
            <div className="dropdown mb-3">
              <div tabIndex={0} role="button" className="bg-gray-700 py-[3px] pl-2 w-[200px] flex flex-row">
                센터를 선택해주세요
                <svg
                  width="12px"
                  height="12px"
                  className="flex inline-block h-[10px] w-[30px] fill-current opacity-60 ml-[9px] mt-[8px]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048">
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
              </div>
              <ul tabIndex={0} className="dropdown-content bg-gray-700 z-[1] w-[200px] p-2 shadow-2xl">
                {centerList?.map(center => (
                  <div key={center.id}>
                     <button onClick={() => handleButtonClick(center)}>
                      {center?.type === 'GYM' && '헬스장'}
                      {center?.type === 'SWIMMING_POOL' && '수영장'}
                      {center?.type === 'SCREEN_GOLF' && '스크린 골프장'}
                      {center?.type === 'LIBRARY' && '도서관'}
                    </button>
                  </div>
                ))}
              </ul>
              {/* <select
                className="mt-5 font-bold text-white select select-bordered w-full max-w-xs"
                value={selectedCenter}
                onChange={handleSelectChange}  // handleChange 함수를 호출합니다.
              >
                <option className="text-black font-bold" value="" disabled>
                  문화 센터 목록
                </option>
                {centerList.map((center) => (
                  <option
                    className="text-black"
                    key={center.id}
                    value={center.id}
                  >
                    {typeTransfer(center.type)}
                  </option>
                ))}
              </select> */}
            </div>
            <div>
              {lessons.map((lesson) => (
                <div key={lesson?.id} className='flex items-center justify-between border-b-2 p-4'>
                  <div className='flex items-center'>
                    <div className='ml-4'>
                      <div className='text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-[300px]'>{lesson?.name}</div>
                    </div>
                  </div>
                  <button className='text-sm font-bold text-primary hover:text-secondary' onClick={() => handleRowClick(lesson?.id)}>수정</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
      <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
    </Profile >
  );
}
