'use client';

<<<<<<< HEAD
import { getProfile, getUser, getLessonList, getCenter, getCenterList } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/MainLayout";

=======
import { getProfile, getUser, getLessonList, getCenter } from "@/app/API/UserAPI";
import Main from "@/app/Global/layout/mainLayout";
>>>>>>> d7f5bf2ed31f33bffd8b7e0072ed58cb988347b7
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDateFormat } from "@/app/Global/component/Method";


export default function Page() {
    const router = useRouter();
    const params = useParams();
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [lessons, setLessons] = useState([] as any[]);
    const centerId = Number(params?.id);
    const [center, setCenter] = useState(null as any);
    const [lessonList, setLessonList] = useState([] as any[]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [gymUrlList, setGymUrlList] = useState([] as any[]);
    const [swimUrlList, setSwimUrlList] = useState([] as any[]);
    const [libUrlList, setLibUrlList] = useState([] as any[]);
    const [golfUrlList, setGolfUrlList] = useState([] as any[]);
    const [centerList, setCenterList] = useState([] as any[]);

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
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                                setGymUrlList([]);
                                setSwimUrlList([]);
                                setLibUrlList([]);
                                setGolfUrlList([]);
                                r.forEach((r: any) => {
                                    switch (r.type) {
                                        case 'GYM':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setGymUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'SWIMMING_POOL':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setSwimUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'LIBRARY':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setLibUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        case 'SCREEN_GOLF':
                                            r.imageListResponseDTOS?.forEach((image: any) => {
                                                setGolfUrlList(prev => [...prev, image.value]);
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                })
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
                getCenter(centerId)
                    .then(r => {
                        setCenter(r);
                        console.log(r);
                        getLessonList(r.id, 0)
                            .then(r => {
                                setLessonList(r.content);
                                const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                            })
                            .catch(e => console.log(e));
                    })
                    .then(r => {
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
                            <div>
                                {centerList?.map((center) =>
                                    <div key={center.id} >
                                        <Link href={`/account/culture_center/${center.id}`} >
                                            {center?.type === 'GYM' ? '헬스장' : ''
                                                || center?.type === 'SWIMMING_POOL' ? '수영장' : ''
                                                    || center?.type === 'SCREEN_GOLF' ? '스크린 골프장' : ''
                                                        || center?.type === 'LIBRARY' ? '도서관' : ''}
                                        </Link>
                                    </div>
                                )}
                            </div>
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
                                <td className="w-[300px] h-1/3 flex items-center justify-center">{lesson.profileResponseDTO.name}</td>
                                <td className="text-xl font-bold w-[600px] text-orange-300 flex overflow-hidden overflow-ellipsis whitespace-nowrap">{lesson.name}</td>
                                <td className="ml-48 flex h-3/4 w-full items-center justify-center">{getDateFormat(lesson.startDate)} ~ {getDateFormat(lesson.endDate)}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </Main>
    );
}
