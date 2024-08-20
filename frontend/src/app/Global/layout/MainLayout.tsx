'use client'

import React, { useEffect, useState } from "react";
import DropDown, { Direction } from "../component/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin, faMagnifyingGlass, faRightFromBracket, faUpLong, faUser } from "@fortawesome/free-solid-svg-icons";
import useConfirm from "../hook/useConfirm";
import ConfirmModal from "../component/ConfirmModal";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 페이지 스크롤 이벤트를 추가합니다.
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

  // 버튼 클릭 시 화면 최상단으로 이동시킵니다.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드럽게 스크롤
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
  user: any;
  profile: any;
  centerList?: any[];
  keyword?: string;
  isLoading: boolean;
}

export default function Main(props: Readonly<PageInterface>) {

  const { className, user, profile, centerList } = props;

  const [centerHover, setCenterHover] = useState(false);
  const [boardHover, setBoardHover] = useState(false);
  const [manageHover, setManageHover] = useState(false);
  const [userHoverInterval, setUserHoverInterval] = useState<any>(null);
  const [userHover, setUserHover] = useState(false);
  const { confirmState, finalConfirm, closeConfirm } = useConfirm();

  function handleLogout() {
    localStorage.clear();
    window.location.href = '/';
  }

  function openHover(setHover: React.Dispatch<React.SetStateAction<boolean>>) {
    if (userHoverInterval) clearInterval(userHoverInterval);
    setHover(true);
  }

  function closeHover(setHover: React.Dispatch<React.SetStateAction<boolean>>, delay: number = 300) {
    if (userHoverInterval) clearInterval(userHoverInterval);
    const interval = setInterval(() => { setHover(false); if (userHoverInterval) clearInterval(userHoverInterval); }, delay);
    setUserHoverInterval(interval);
  }

  const getDefaultHeight = () => {
    if (centerList?.length === 1) {
      return 35;
    }
    if (centerList?.length === 2) {
      return 65;
    }
    if (centerList?.length === 3) {
      return 100;
    }
    if (centerList?.length === 4) {
      return 130;
    }
    return 0; // 기본 높이
  };

  const defaultHeight = getDefaultHeight();

  return (

    <main id='main' className={'bg-black h-full w-[1903px] flex flex-col relative ' + className}>
      <div className={"absolute bg-black w-full min-h-screen z-[1000]" + (props.isLoading ? ' hidden' : '')} />
      {props?.user?.role === 'ADMIN' ? (
        <header className='fixed rounded-b-xl bg-gray-700 flex w-[1903px] items-center h-[80px] z-[950]'>
          <div className="navbar items-center">
            <div className="navbar-start">
              <a href="/account/admin">
                <img src="/logo.png" alt="logo" className="mt-1 w-[64px] h-[64px] ml-10" />
                {/* <label className="text-sm font-bold ml-4 hover:cursor-pointer">Honey Danji</label> */}
              </a>
            </div>
            <div className="navbar-center justify-between w-[800px]">
              <a id="center" href="/propose/" className="btn btn-ghost text-xl hover:text-secondary">
                서비스 신청현황
              </a>
              <a id="board" href="/account/article/1" className="btn btn-ghost text-xl hover:text-secondary">
                아파트 관리
              </a>
              <a id="manage" href="/account/admin/user" className="btn btn-ghost text-xl hover:text-secondary">
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
                  <a className="mt-0 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/mypage">
                    <FontAwesomeIcon icon={faUser} />
                    내 정보
                  </a>
                  <a className="mt-1 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/profile">
                    <FontAwesomeIcon icon={faArrowsSpin} />
                    프로필 변경
                  </a>
                  <button
                    onClick={() => finalConfirm('로그아웃', '로그아웃 하시겠습니까?', '로그아웃', () => handleLogout())}
                    className="mt-[5px] btn btn-active btn-secondary text-lg text-black w-[180px]"
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                    로그아웃
                  </button>
                </div>
              </DropDown>
            </div>
          </div>
        </header>
      ) :
        props.user == null ? (
          <div className="fixed z-[950] bg-black w-full h-[56px] flex justify-center items-center mb-3 z-[950]">
            <a href="/" className="flex items-center">
              <img src="/user.png" alt="logo" className="w-[48px] h-[48px]" />
              <span className="ml-2 text-white">Honey Danji</span>
            </a>
          </div>
        ) :
          <header className='fixed rounded-b-xl bg-gray-700 flex w-[1903px] items-center h-[80px] z-[950]'>
            <div className="navbar items-center">
              <div className="navbar-start">
                <a href="/">
                  <img src="/logo.png" alt="logo" className="mt-1 w-[64px] h-[64px] ml-10" />
                  {/* <label className="text-sm font-bold ml-4 hover:cursor-pointer">Honey Danji</label> */}
                </a>
              </div>
              <div className="navbar-center justify-between w-[800px]">
                <a id="center" href="/account/culture_center/" className="btn btn-ghost text-xl hover:text-secondary"
                  onMouseEnter={() => openHover(setCenterHover)}
                  onMouseLeave={() => closeHover(setCenterHover)}>
                  문화센터
                </a>
                <a id="board" href="/account/article/2" className="btn btn-ghost text-xl hover:text-secondary"
                  onMouseEnter={() => openHover(setBoardHover)}
                  onMouseLeave={() => closeHover(setBoardHover)}>
                  게시판
                </a>
                <a id="manage" href="/account/FAQ/" className="btn btn-ghost text-xl hover:text-secondary"
                  onMouseEnter={() => openHover(setManageHover)}
                  onMouseLeave={() => closeHover(setManageHover)}>
                  관리사무소
                </a>
              </div>

              <DropDown open={centerHover} onClose={() => !setCenterHover} className='fixed z-[950] border-x-1 border-b-1 border-black rounded-b-xl bg-gray-700' background='main' button='center' defaultDirection={Direction.DOWN} height={defaultHeight} width={180} y={14} x={-30}>
                <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
                  onMouseEnter={() => openHover(setCenterHover)}
                  onMouseLeave={() => closeHover(setCenterHover)}>
                  {centerList?.map((center) =>
                    <div key={center.id} >
                      <a href={`/account/culture_center/${center.id}`} className='hover:text-secondary text-sm'>
                        {center?.type === 'GYM' ? '헬스장' : ''
                          || center?.type === 'SWIMMING_POOL' ? '수영장' : ''
                            || center?.type === 'SCREEN_GOLF' ? '스크린 골프장' : ''
                              || center?.type === 'LIBRARY' ? '도서관' : ''}
                      </a>
                    </div>
                  )}
                </div>
              </DropDown>
              <DropDown open={boardHover} onClose={() => !setBoardHover} className='fixed z-[950] border-x-1 border-b-1 border-black rounded-b-xl bg-gray-700' background='main' button='board' defaultDirection={Direction.DOWN} height={100} width={180} y={14} x={-38}>
                <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
                  onMouseEnter={() => openHover(setBoardHover)}
                  onMouseLeave={() => closeHover(setBoardHover)}>
                  <a href='/account/article/2' className='hover:text-secondary text-sm'>공지사항</a>
                  <a href='/account/article/3' className='hover:text-secondary text-sm'>자유게시판</a>
                  <a href='/account/article/4' className='hover:text-secondary text-sm'>중고장터</a>
                </div>
              </DropDown>
              <DropDown open={manageHover} onClose={() => !setManageHover} className='fixed z-[950] border-x-1 border-b-1 border-black rounded-b-xl bg-gray-700' background='main' button='manage' defaultDirection={Direction.DOWN} height={35} width={180} y={14} x={-20}>
                <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
                  onMouseEnter={() => openHover(setManageHover)}
                  onMouseLeave={() => closeHover(setManageHover)}>
                  <a href='/account/FAQ/' className='hover:text-secondary text-sm'>FAQ</a>
                </div>
              </DropDown>
              <div className="navbar-end">
                <button id="user"
                  onMouseEnter={() => openHover(setUserHover)}
                  onMouseLeave={() => closeHover(setUserHover)} className="pl-5 mr-[50px] rounded-full flex flex-col">
                  <img src={profile?.url ? profile.url : '/user.png'} className='w-[48px] h-[48px] rounded-full' alt="profile" />
                </button>
                <DropDown open={userHover} onClose={() => !setUserHover} background="main" button="user" className="fixed z-[950] mt-[1px] text-black" defaultDirection={Direction.DOWN} height={100} width={180} x={-100} y={8}>
                  <div
                    onMouseEnter={() => openHover(setUserHover)}
                    onMouseLeave={() => closeHover(setUserHover)}>
                    <a className="mt-0 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/mypage">
                      <FontAwesomeIcon icon={faUser} />
                      내 정보
                    </a>
                    <a className="mt-1 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/profile">
                      <FontAwesomeIcon icon={faArrowsSpin} />
                      프로필 변경
                    </a>
                    {!!user ? <button
                      onClick={() => finalConfirm('로그아웃', '로그아웃 하시겠습니까?', '로그아웃', () => handleLogout())}
                      className="mt-[5px] btn btn-active btn-secondary text-lg text-black w-[180px]"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                      로그아웃
                    </button> : null}
                  </div>
                </DropDown>
              </div>
            </div>
          </header>}

      <div className="mt-[80px]">
        {props.children}
      </div>
      <ScrollToTopButton />
      <footer className='flex flex-col w-[1450px] mt-18 ml-52 p-10 gap-2'>
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
      <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
    </main>
  );
}
