'use client';

import { getProfile, getUser, getLesson, postLesson, postLessonRequest } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/mainLayout";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "@/app/Global/component/Calendar";
import { getDateFormat, getTimeFormat } from "@/app/Global/component/Method";
import { number } from "prop-types";

interface LessonType {
    id: number;
    name: string;
    content: string;
    startDate: number;
    endDate: number;
    profileResponseDTO: any;
}


interface PageProps {
    lessonList: LessonType[];
}

export default function Page(props: PageProps) {
    const params = useParams();
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const lessonId = Number(params?.id);
    const [isLoading, setIsLoading] = useState(false);
    const [lessonList, setLessonList] = useState<LessonType[]>(props.lessonList || []);
    const [targetLesson, setTargetLesson] = useState<LessonType | null>(null);
    const [error, setError] = useState('');



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
                console.log("수강 신청 완료");
                window.location.href = `/account/lesson/${lessonId}`;
            }).catch((error) => {
                console.error('수강 신청 중 오류:', error);
                setError('수강 신청 중 오류가 발생했습니다.');
            });
    }


    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="flex justify-center mt-[70px] mb-[20px] w-[1350px] h-[800px] items-center bg-gray-700">
                {targetLesson ? (
                    <div className="w-[500px] h-[750px] mr-[15px]">
                        <div className="flex flex">
                            <div className="ml-[20px] mb-[20px]">
                                <img src={targetLesson.profileResponseDTO?.url ? targetLesson.profileResponseDTO.url : '/user.png'} className="ml-[15px] my-[15px] w-[100px] flex h-[100px] justify-center rounded-full" alt="profile" />
                                <p>강사 : {targetLesson.profileResponseDTO.name}</p>
                            </div>
                            <div className="ml-[30px] y-[150px] flex flex-col justify-center">
                                <p className="text-2xl font-semibold mb-2" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>{targetLesson.name}</p>
                                <p>수강 기간 : {getDateFormat(targetLesson.startDate)} ~ {getDateFormat(targetLesson.endDate)}</p>
                                <p>강의 시간 : {getTimeFormat(targetLesson.startDate)} ~ {getTimeFormat(targetLesson.endDate)}</p>
                            </div>
                        </div>
                        <p className="ml-[20px]">강의 설명 :</p>
                        <div className="w-[450px] relative bg-black h-[400px] my-[10px] ml-[20px] rounded">
                            <p className="block break-words whitespace-normal overflow-y-hidden h-[380px] overflow-y-scroll m-2">
                            <div dangerouslySetInnerHTML={{ __html: targetLesson.content }} />
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>Loading lesson details...</p>
                )}
                <div className="flex items-start h-[550px] flex-col">
                    <Calendar lessons={lessonList} height={500} width={700} />
                    <div className="w-[700px] h-[80px] justify-end items-end flex">
                        <button
                            id='submit'
                            className='bg-transparent p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 flex items-end text-white'
                            onClick={() => Submit()}
                        >
                            수강 신청
                        </button>
                    </div>
                </div>

            </div>

        </Main >
    );
}
