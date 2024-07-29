'use client';
import { getProfile, getUser, getLesson, postLesson, postLessonRequest } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/mainLayout";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "@/app/Global/component/Calendar";
import { getDateFormat, getTimeFormat } from "@/app/Global/component/Method";
import { number } from "prop-types";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import AlertModal from "@/app/Global/component/AlertModal";
export default function Page() {
    const params = useParams();
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const lessonId = Number(params?.id);
    const [isLoading, setIsLoading] = useState(false);
    const [lessonList, setLessonList] = useState([] as any[]);
    const [targetLesson, setTargetLesson] = useState(null as any);
    const [error, setError] = useState('');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const countTotalLesson = (lessonList: any[]): number => {
        return lessonList.reduce((total, lesson) => {
            return total + 1 + countTotalLesson(lessonList || []);
        }, 0);
    };
    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    console.log(r);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                    })
                    .catch(e => console.log(e));
                getLesson(lessonId)
                    .then(r => {
                        setLessonList(prev => [...prev, r]);
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID, lessonId]);
    useEffect(() => {
        if (lessonList.length > 0) {
            const foundLesson = lessonList.find(lesson => lesson.id === lessonId);
            setTargetLesson(foundLesson || null);
            console.log('type', targetLesson)
        }
    }, [lessonList, lessonId]);
    function Submit() {
        postLessonRequest({ id: null, lessonId, type: 0 })
            .then(() => {
                closeConfirm();
                showAlert('수강 신청 완료',`/account/lesson/${lessonId}`);
            }).catch((error) => {
                closeConfirm();
                showAlert('수강 신청 중 오류:'+ error);
                setError('수강 신청 중 오류가 발생했습니다.');
            });
    }

    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="ml-[300px] flex justify-center mt-[30px] mb-[20px] w-[1350px] h-full items-center bg-gray-700">
                {targetLesson ? (
                    <div className="w-[1200px] h-full">
                        <div className="flex mt-[30px]">
                            <div className="flex flex-col w-[500px]">
                                <div className="ml-[20px] mb-[15px]">
                                    <img src={targetLesson.profileResponseDTO?.url ? targetLesson.profileResponseDTO.url : '/user.png'} className="my-[15px] w-[200px] flex h-[200px] justify-center rounded-full" alt="profile" />
                                </div>
                                <div className="flex flex-col justify-center items-start m-[20px]">
                                    <p className="text-2xl font-bold mb-4 "><p className="border-b" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>프로그램 명</p><p className="mt-[30px]">{targetLesson.name}</p></p>
                                    <p className="font-semibold flex flex-row">강사 <p className="ml-[40px] mr-[10px]">:</p> {targetLesson.profileResponseDTO.name}</p>
                                    <p className="font-semibold flex flex-row"><p>수강 기간 :</p> <p className="ml-[10px]">{getDateFormat(targetLesson.startDate)} ~ {getDateFormat(targetLesson.endDate)}</p></p>
                                    <p className="font-semibold flex flex-row"><p>강의 시간 :</p> <p className="ml-[10px]"> {getTimeFormat(targetLesson.startDate)} ~ {getTimeFormat(targetLesson.endDate)}</p></p>
                                </div>
                            </div>
                            <div className="flex ">
                                <Calendar lessons={lessonList} height={500} width={700} />
                            </div>
                        </div>
                        <div className="w-[1200px] relative bg-black h-[700px] mt-[50px] my-[10px] items-center rounded flex mb-[50px]">
                            <p className="block break-words whitespace-normal overflow-y-hidden h-[680px] w-full overflow-y-scroll m-2">
                                <div dangerouslySetInnerHTML={{ __html: targetLesson.content }} />
                            </p>
                        </div>

                        <div className="w-[1200px] h-[80px] justify-end items-start flex">
                            <a href="/account/mypage/lesson/${targetLesson.id}/modify">dd</a>
                            <button
                                id='submit'
                                className='bg-transparent  p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 justify-center flex items-end text-white'
                                onClick={() => Submit()}
                            >
                                수강 신청
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Loading lesson details...</p>
                )}
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Main >
    );
}