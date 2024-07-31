'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { deleteProfile, getCenterList, getProfile, updateLessonRequest, getStaffLessonList, getUser, deleteLessonRequest, getLessonRequestListByStaff } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import { checkInput } from "@/app/Global/component/Method";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import AlertModal from "@/app/Global/component/AlertModal";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import Pagination from "@/app/Global/component/Pagination";
import Modal from "@/app/Global/component/Modal";


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
  const [selectedCenter, setSelectedCenter] = useState('');
  const [centerId, setCenterId] = useState(0);
  const [center, setCenter] = useState<Center | null>(null);
  const [lessonUser, setLessonUser] = useState([] as any[]);
  const [centerError, setCenterError] = useState('문화센터를 설정해주세요.');
  const [isModalOpen, setISModalOpen] = useState(-1);
  const [typeNum, setTypeNum] = useState<any>(null);
  const [lessonId, setLessonId] = useState<any>(null);

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

  // useEffect(() => {
  //   centerList?.forEach(center => {
  //     fetchLessonList(center?.id, center?.type);
  //   });
  // }, [centerList]);
  //   if (selectedCenter) {
  //     fetchLessonList(selectedCenter.id, selectedCenter.type);
  //   }
  // }, [selectedCenter]);

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
  function openModal(type: number, id: number, lessonType: number) {
    setISModalOpen(type);
    getLessonRequestListByStaff(lessonType, id)
      .then((r) => {
        setLessonUser(r);
        setTypeNum(lessonType);
        setLessonId(id);
      })
  }


  function updateModal(id: number, lessonId: number, type: number) {
    updateLessonRequest({ id, lessonId, type })
      .then(() => {
        if (center && typeNum !== null) {
          getLessonRequestListByStaff(typeNum, lessonId)
            .then(r => {
              setLessonUser(r);
              alert('요청이 승인되었습니다.');
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  function deleteModal(LessonUserId: number) {
    deleteLessonRequest(LessonUserId)
      .then(() => {
        if (center && typeNum !== null) {
          getLessonRequestListByStaff(typeNum, lessonId)
            .then(r => {
              setLessonUser(r);
              alert('요청이 거절되었습니다.');
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }


  function closeModal() {
    setISModalOpen(-1);
  }

  function typeTransfer(type: string) {
    let typeName: string | null;

    switch (type) {
      case 'GYM':
        typeName = '헬스장';
        break;
      case 'SWIMMING_POOL':
        typeName = '수영장';
        break;
      case 'SCREEN_GOLF':
        typeName = '스크린 골프장';
        break;
      case 'LIBRARY':
        typeName = '도서관';
        break;
      default:
        typeName = '문화센터가 존재하지 않습니다.';
    }
    return typeName;
  }



  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCenter(value);
    setCenterId(Number(value));

    if (value === '') {
      setCenterError('문화 센터를 선택해주세요.');
    } else {
      setCenterError('');
      const selectedCenter = centerList.find(center => center.id === Number(value));
      if (selectedCenter) {
        setCenter(selectedCenter);
        fetchLessonList(selectedCenter.id, selectedCenter.type);
      }
    }
  };

  return (
    <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
      <div className='flex flex-col'>
        <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>레슨</label> 관리</label>
        <div className="mt-9 w-[1300px] border-2 h-[700px] rounded-lg">
          <div className="flex flex-col p-9 justify-center items-center justify-between">
            <div className="flex w-[1000px]">
              <select
                className="flex mb-[30px] font-bold text-white select select-bordered w-full max-w-xs"
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
              </select>
            </div>
            <div className="h-[500px] w-[1000px] overflow-y-scroll">
              {lessons.map((lesson) => (
                <div key={lesson?.id} className='flex items-center justify-between border-b-2 h-[50px]'>
                  <a href={`/account/lesson/${lesson.id}`}>
                    <div className='flex items-center w-full h-full'>
                      <div className='ml-4 w-full h-full' >
                        <div className='text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-[300px]'>{lesson?.name}</div>
                      </div>
                    </div>
                  </a>
                  <div className="w-[300px] justify-end flex">
                    <button className='text-sm mr-[30px] font-bold text-orange-300 hover:text-orange-500' onClick={() => openModal(1, lesson.id, 0)}>신청 관리</button>
                    <button className='text-sm mr-[30px] font-bold text-red-300 hover:text-red-500' onClick={() => openModal(1, lesson.id, 2)}>취소 관리</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal open={isModalOpen === 1} onClose={() => setISModalOpen(-1)} className='modal-box w-[600px] h-[700px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
        <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => closeModal()}> ✕ </button>
        <div className="flex flex-col w-[450px] h-[500px]">
          {lessonUser.map((lessonUser) => (
            <div key={lessonUser?.id} className='w-[450px] h-[50px] flex flex-row border-b border-gray-500  items-center pb-3 pl-3 mt-[10px]'>
              <img className="w-[50px] h-[50px]" src={lessonUser.profileResponseDTO?.url ? lessonUser.profileResponseDTO.url : '/user.png'} alt="profile"></img>
              <div className="w-[250px] text-black text-lg ml-[20px]">{lessonUser.profileResponseDTO.name}</div>
              <div className="w-[200px] flex justify-end items-center flex-row pr-[30px]">
                <button className='text-sm w-[50px] font-bold text-blue-300 hover:text-blue-500' onClick={() => updateModal(lessonUser.id, lessonUser.lessonResponseDTO.id, (typeNum + 1))}>승인</button>
                <button className='text-sm w-[50px] font-bold text-red-300 hover:text-red-500' onClick={() => deleteModal(lessonUser.id)}>거절</button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
      <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
    </Profile >
  );
}
