'use client'

import React, { useEffect, useState } from "react";
import DropDown, { Direction } from "../component/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin, faUpLong, faUser } from "@fortawesome/free-solid-svg-icons";

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '100px',
                        padding: '10px 20px',
                        fontSize: 'small',
                        backgroundColor: 'gray',
                        color: 'white',
                        border: 'none',
                        borderRadius: '100%',
                        cursor: 'pointer',
                    }}
                >
                    <FontAwesomeIcon icon={faUpLong} /><br />
                    Top
                </button>
            )}
        </>
    );
};

interface PageInterface {
    children: React.ReactNode;
    className?: string;
    user?: any;
    profile?: any;
    isLoading: boolean;
}

export default function Admin(props: Readonly<PageInterface>) {

    const { className } = props;

    const [userHoverInterval, setUserHoverInterval] = useState<any>(null);
    const [userHover, setUserHover] = useState(false);

    function openHover(setHover: React.Dispatch<React.SetStateAction<boolean>>) {
        if (userHoverInterval) clearInterval(userHoverInterval);
        setHover(true);
    }

    function closeHover(setHover: React.Dispatch<React.SetStateAction<boolean>>, delay: number = 300) {
        if (userHoverInterval) clearInterval(userHoverInterval);
        const interval = setInterval(() => { setHover(false); if (userHoverInterval) clearInterval(userHoverInterval); }, delay);
        setUserHoverInterval(interval);
    }

    return (
        <main id='main' className={'bg-black h-full w-[1903px] flex flex-col relative ' + className}>
            <div className={"absolute bg-black w-full min-h-screen z-[1000]" + (props.isLoading ? ' hidden' : '')} />
            {props?.user?.role === 'ADMIN' ? (
                <header className='fixed rounded-b-xl bg-gray-700 flex w-[1903px] items-center h-[56px] z-[950]'>
                    <div className="navbar items-center">
                        <div className="navbar-start">
                            <a href="/account/admin">
                                <img src="/user.png" alt="logo" className="mt-1 w-[36px] h-[36px] ml-10" />
                                <label className="text-sm font-bold ml-4 hover:cursor-pointer">Honey Danji</label>
                            </a>
                        </div>
                        <div className="navbar-center justify-between w-[800px]">
                            <a id="center" href="/propose/" className="btn btn-ghost text-xl hover:text-secondary">
                                서비스 신청현황
                            </a>
                            <a id="board" href="/account/article/1" className="btn btn-ghost text-xl hover:text-secondary">
                                아파트 관리
                            </a>
                            <a id="manage" href="/account/FAQ/" className="btn btn-ghost text-xl hover:text-secondary">
                                유저 관리
                            </a>
                        </div>
                        <div className="navbar-end">
                            <button id="user"
                                onMouseEnter={() => openHover(setUserHover)}
                                onMouseLeave={() => closeHover(setUserHover)} className="pl-5 mr-[50px] rounded-full flex flex-col">
                                <img src={props?.profile?.url ? props?.profile?.url : '/user.png'} className='w-[48px] h-[48px] rounded-full' alt="profile" />
                            </button>
                            <DropDown open={userHover} onClose={() => !setUserHover} background="main" button="user" className="fixed z-[950] mt-[1px] text-black" defaultDirection={Direction.DOWN} height={100} width={180} x={-100} y={8}>
                                <div
                                    onMouseEnter={() => openHover(setUserHover)}
                                    onMouseLeave={() => closeHover(setUserHover)}>
                                    <a className="mt-1 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/profile">
                                        <FontAwesomeIcon icon={faArrowsSpin} />
                                        프로필 변경
                                    </a>
                                </div>
                            </DropDown>
                        </div>
                    </div>
                </header>
            ) :( 
                <div className="fixed z-[950] bg-black w-full h-[56px] flex justify-center items-center mb-3 z-[950]">
                    <a href="/propose" className="flex items-center">
                        <img src="/user.png" alt="logo" className="w-[48px] h-[48px]" />
                        <span className="ml-2 text-white">Honey Danji</span>
                    </a>
                </div>
            )}
            <div className="flex mt-[70px]">
                {props.children}
            </div>
            <ScrollToTopButton />
            <footer className='flex flex-col w-[1450px] mt-18 ml-52 p-10 gap-2 z-[950]'>
                <div className='flex justify-between'>
                    <div className='text-secondary flex font-bold'>상호명 및 호스팅 서비스 제공 :
                        <span className='text-white flex flex-col ml-2'> 꿀단지(주)</span>
                    </div>
                    <a href="/help" className='mr-[300px] hover:underline text-white'>고객센터</a>
                </div>
                <label className='text-xs text-secondary'>대표이사 : <span className="text-white">이순재, 황준하, 정진석, 손혜승</span></label>
                <label className='text-xs text-secondary'>주소 : <span className="text-white">대전광역시 서구 둔산로 52</span></label>
                <label className='text-xs text-secondary'>Tel : <span className="text-white">042-369-5890</span></label>
                <label className='text-xs text-secondary'>사업자등록번호 : <span className="text-white">889-86-02332</span></label>
            </footer>
        </main>
    );
}
