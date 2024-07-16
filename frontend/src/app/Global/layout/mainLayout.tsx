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
  const categories = props.categories
  const [openDropDown, setOpenDropDown] = useState(false);

  return <main id='main' className={'bg-black min-h-screen flex flex-col items-center relative ' + className}>
    <header className='bg-gray-700 flex w-full items-center h-[20%]'>
      <div className="navbar items-center">
        <div className="navbar-start">
          <a href="">
            <img src="./user.png" alt="로고" className="w-[64px] h-[64px] ml-10" />
            <label className="text-xl font-bold ml-4 hover:cursor-pointer">Honey Danji</label>
          </a>
        </div>
        <div className="navbar-center gap-20">
          <a className="btn btn-ghost text-2xl">문화센터</a>
          <a href="/" className="btn btn-ghost text-2xl">게시판</a>
          <a href="/" className="btn btn-ghost text-2xl">관리사무소</a>
        </div>
        <div className="navbar-end">
          <button id="profileSettings" onClick={() => setOpenDropDown(!openDropDown)} className="mr-10 rounded-full flex flex-col">
            <img src={profile?.url ? profile.url : '/user.png'} className='w-[64px] h-[64px]' alt="default" />
          </button>
          <DropDown open={openDropDown} onClose={() => setOpenDropDown(false)} background="main" button="profileSettings" className="mt-[1px] text-black" defaultDriection={Direcion.DOWN} height={200} width={180} x={-100}>
            <a className="mt-0 btn btn-active btn-secondary" href="/account/myProfile">
              <FontAwesomeIcon icon={faUser} />
              내 정보
            </a>
            <a className="mt-1 btn btn-active btn-secondary" href="/account/profile">
              <FontAwesomeIcon icon={faArrowRightToBracket} />
              프로필 변경
            </a>
          </DropDown>
        </div>
      </div>
    </header>
    <nav>

    </nav>
    {props.children}
    <footer>

    </footer>
  </main>
}