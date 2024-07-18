'use client'

import React, { useState } from "react"
import DropDown, { Direcion } from "../DropDown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons"

interface pageInterface {
  children: React.ReactNode,
  className?: string
  user: any
  profile: any
  categories: any[]
  keyword?: string;
}

export default function Main(props: Readonly<pageInterface>) {
  const className = props.className;
  const user = props.user;
  const profile = props.profile;
  const categories = props.categories;

  const [centerHover, setCenterHover] = useState(false);
  const [boardHover, setBoardHover] = useState(false);
  const [manageHover, setManageHover] = useState(false);
  const [userHoverInterval, setUserHoverInterval] = useState(null as any);
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
    <main id='main' className={'bg-black min-h-screen min-w-screen flex flex-col items-center relative ' + className}>
      <header className='bg-gray-700 flex w-max items-center h-[80px]'>
        <div className="navbar items-center">
          <div className="navbar-start">
            <a href="/">
              <img src="/user.png" alt="logo" className="w-[48px] h-[48px] ml-10" />
              <label className="text-xl font-bold ml-4 hover:cursor-pointer">Honey Danji</label>
            </a>
          </div>
          <div className="navbar-center justify-between w-[900px]">
            <a id="center" href="/" className="btn btn-ghost text-xl hover:text-secondary"
              onMouseEnter={() => openHover(setCenterHover)}
              onMouseLeave={() => closeHover(setCenterHover)}>
              문화센터
            </a>
            <a id="board" href="/" className="btn btn-ghost text-xl hover:text-secondary"
              onMouseEnter={() => openHover(setBoardHover)}
              onMouseLeave={() => closeHover(setBoardHover)}>
              게시판
            </a>
            <a id="manage" href="/" className="btn btn-ghost text-xl hover:text-secondary"
              onMouseEnter={() => openHover(setManageHover)}
              onMouseLeave={() => closeHover(setManageHover)}>
              관리사무소
            </a>
          </div>

          <DropDown open={centerHover} onClose={() => !setCenterHover} className='bg-gray-700' background='main' button='center' defaultDriection={Direcion.DOWN} height={100} width={180} y={20} x={-20}>
            <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
              onMouseEnter={() => openHover(setCenterHover)}
              onMouseLeave={() => closeHover(setCenterHover)}>
              <a href='/account/log/' className='hover:text-secondary text-sm'>시설 안내</a>
              <a href='/' className='hover:text-secondary text-sm'>프로그램 안내</a>
              {user?.role !== 'USER' ? <a href='/lesson' className='hover:text-secondary text-sm'>레슨 등록</a> : null}
            </div>
          </DropDown>
          <DropDown open={boardHover} onClose={() => !setBoardHover} className='bg-gray-700' background='main' button='board' defaultDriection={Direcion.DOWN} height={100} width={180} y={20} x={-35}>
            <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
              onMouseEnter={() => openHover(setBoardHover)}
              onMouseLeave={() => closeHover(setBoardHover)}>
              <a href='/account/log/' className='hover:text-secondary text-sm'>공지사항</a>
              <a href='/' className='hover:text-secondary text-sm'>자유게시판</a>
              {user?.role !== 'USER' ? <a href='/lesson' className='hover:text-secondary text-sm'>중고장터</a> : null}
            </div>
          </DropDown>
          <DropDown open={manageHover} onClose={() => !setManageHover} className='bg-gray-700' background='main' button='manage' defaultDriection={Direcion.DOWN} height={100} width={180} y={20} x={-10}>
            <div className='h-full w-full flex flex-col justify-between my-auto px-2 text-lg'
              onMouseEnter={() => openHover(setManageHover)}
              onMouseLeave={() => closeHover(setManageHover)}>
              <a href='/account/log/' className='hover:text-secondary text-sm'>FAQ</a>
              <a href='/' className='hover:text-secondary text-sm'>건의사항</a>
              {user?.role !== 'USER' ? <a href='/lesson' className='hover:text-secondary text-sm'>1:1 문의</a> : null}
            </div>
          </DropDown>
          <div className="navbar-end">
            <div className='flex items-center border-2 border-gray-300 rounded-full px-5'>
              <input id="keyword" type='text' className='self-center text-sm bg-transparent h-[40px] w-[300px] mr-[20px] outline-none' defaultValue={props?.keyword} placeholder='검색' onKeyDown={e => { if (e.key == 'Enter') document.getElementById('search')?.click() }}></input>              
            </div>
            <button id='search' onClick={() => { const value = (document.getElementById('keyword') as HTMLInputElement)?.value; location.href = '/search?keyword=' + (value ? value : '') }}>
                <img src='/user.png' className='rounded-full p-2 w-[64px] h-[64px]' />
              </button>
            <button id="user"
              onMouseEnter={() => openHover(setUserHover)}
              onMouseLeave={() => closeHover(setUserHover)} className="pl-5 mr-[50px] rounded-full flex flex-col">
              <img src={profile?.url ? profile.url : '/user.png'} className='w-[48px] h-[48px]' alt="default" />
            </button>
            <DropDown open={userHover} onClose={() => !setUserHover} background="main" button="user" className="mt-[1px] text-black" defaultDriection={Direcion.DOWN} height={100} width={180} x={-100} y={5}>
              <div
                onMouseEnter={() => openHover(setUserHover)}
                onMouseLeave={() => closeHover(setUserHover)}>
                <a className="mt-0 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/mypage">
                  <FontAwesomeIcon icon={faUser} />
                  내 정보
                </a>
                <a className="mt-1 btn btn-active btn-secondary text-lg text-black w-[180px]" href="/account/profile">
                  <FontAwesomeIcon icon={faArrowRightToBracket} />
                  프로필 변경
                </a>
              </div>
            </DropDown>
          </div>
        </div>
      </header>
      <nav>

      </nav>
      {props.children}
      <footer className='flex flex-col w-screen mt-16 mb-8'>
        <div className='flex justify-between'>
          <div className='flex font-bold text-white'>상호명 및 호스팅 서비스 제공 :
            <div className='text-white flex flex-col ml-2'> 꿀단지(주)</div>
          </div>
          <a href="/help" className='mr-[300px] hover:underline text-white'>고객센터</a>
        </div>
        <label className='text-xs text-white'>대표이사 : 이순재, 황준하, 정진석, 손혜승 주소: 대전광역시 서구 둔산로 52, Tel: 042-369-5890</label>
        <label className='text-xs text-white'>사업자등록번호 : 889-86-02332</label>
      </footer>
    </main>
  )
}
