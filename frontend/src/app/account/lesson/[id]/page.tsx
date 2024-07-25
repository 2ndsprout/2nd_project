'use client';

import { getProfile, getUser, getLessonList, getCenter, getLesson, postLesson, postLessonRequest } from "@/app/API/UserAPI";
import Calendar from "@/app/Global/Calendar";
import Main from "@/app/Global/layout/MainLayout";
import { getDateFormat, getDateTimeFormat, getTimeFormat } from "@/app/Global/Method";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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
        }
    }, [lessonList, lessonId]);

    function Submit() {

        const requestData = {
            lessonId,
            type: Number(0)
        };

        postLessonRequest(requestData)
            .then(() => {
                console.log("수강 신청 완료");
                window.location.href = `/account/lesson/${lessonId}`;
            }).catch((error) => {
                console.error('수강 신청 중 오류:', error);
                setError('수강 신청 중 오류가 발생했습니다.');
            });
    }


    return (
        <Main user={user} profile={profile}>
            <div className="flex justify-center mt-[130px] mb-[-50px]">
                <Calendar lessons={lessonList} height={480} width={650} />
                {targetLesson ? (
                    <div className="ml-[20px]">
                        <p className="text-2xl font-semibold mb-2" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>{targetLesson.name}</p>
                        <p>강사 이름 : {targetLesson.profileResponseDTO.name}</p>
                        <p>수강 기간 : {getDateFormat(targetLesson.startDate)} ~ {getDateFormat(targetLesson.endDate)}</p>
                        <p>강의 시간 : {getTimeFormat(targetLesson.startDate)} ~ {getTimeFormat(targetLesson.endDate)}</p>
                        <div className="overflow-y-scroll overflow-x-hidden max-h-[100px] max-w-[300px] my-[10px]">
                            <p className="whitespace-normal">
                                {targetLesson.content}
                            </p>
                        </div>
                        <button
                            id='submit'
                            className='bg-transparent p-2.5 bg-yellow-600 rounded hover:bg-yellow-400 flex justify-center text-white'
                            onClick={Submit}
                        >
                            수강 신청
                        </button>
                    </div>
                ) : (
                    <p>Loading lesson details...</p>
                )}
            </div>
        </Main >
    );
}
