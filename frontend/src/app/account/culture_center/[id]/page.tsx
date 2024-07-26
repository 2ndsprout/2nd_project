'use client';

import { getProfile, getUser, getLessonList, getCenter } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/mainLayout";

import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDateFormat } from "@/app/Global/component/Method";
import Router from "next/router";

interface Lesson {
    id: number;
    startDate: number;
    endDate: number;
    profileResponseDTO: any;
    name: string;
}

interface LessonPage {
    content: Lesson[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

interface PageProps {
    lessonList: Lesson[];
}

export default function Page(props: PageProps) {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [lessons, setLessons] = useState([] as any[]);
    const centerId = Number(params?.id);
    const [center, setCenter] = useState(null as any);
    const [lessonList, setLessonList] = useState<Lesson[]>(props.lessonList || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                    })
                    .catch(e => console.log(e));
                getCenter(centerId)
                    .then(r => {
                        setCenter(r);
                        return getLessonList(r.id, 0);
                    })
                    .then(r => {
                        setLessonList(r.content);
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID, centerId]);


    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="bg-black w-full min-h-screen text-white flex h-full">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-end">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>문화센터</h2>
                        <div className="mb-2">
                            <a href="/account/culture_center/">편의시설</a>
                        </div>
                    </div>
                </aside>
                <table className="w-full p-6 mt-[50px] flex h-full flex-col space-y-10 items-center">
                    <thead>
                        <tr className="w-[1000px] flex items-center">
                            <th className="ml-[130px] text-orange-400 w-[100px] flex justify-center border-b">수업 강사</th>
                            <th className="ml-[130px] text-orange-400 w-[100px] flex justify-center border-b">수업 이름</th>
                            <th className="ml-[300px] text-orange-400 w-[100px] flex justify-center border-b">수업 기간</th>
                        </tr>
                    </thead>
                    {lessonList.map((lesson, index) => (
                        <tbody key={index}>
                            <tr className="bg-gray-800 p-2 rounded-lg w-[1000px] flex items-center h-[120px] hover:cursor-pointer"
                            onClick={() => router.push(`/account/lesson/${lesson.id}`)}>
                                <td><img src={lesson.profileResponseDTO?.url ? lesson.profileResponseDTO.url : '/user.png'} className="ml-[15px] w-[100px] flex h-full justify-center rounded-full" alt="profile" /></td>
                                <td><div className="w-[200px] h-1/3 flex items-center justify-center ml-[15px]">{lesson.profileResponseDTO.name}</div></td>
                                <td><h3 className="text-xl font-bold h-1/4 w-full text-orange-300 flex justify-center">{lesson.name}</h3></td>
                                <td className="ml-48 flex h-3/4 w-full items-center justify-center">{getDateFormat(lesson.startDate)} ~ {getDateFormat(lesson.endDate)}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </Main>
    );
}
