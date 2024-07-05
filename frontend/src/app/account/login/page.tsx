'use client'

import { Login } from '@/app/API/AuthAPI';
import { KeyDownCheck, Move } from  '@/app/Global/Method';
import { useState } from 'react';

export default function Page() {
    const [canSee, setCanSee] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');

    function Sumbit() {
        Login({ username, password })
            .then((response) => {
                localStorage.clear();
                localStorage.setItem('tokenType', response.tokenType);
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                console.log("login success!");
                window.location.href = ``;
            }).catch((error) => {
                switch (error.response.data) {
                    case 'username': { setError('아이디가 잘못되었습니다.'); break; }
                    case 'password': { setError('잘못된 비밀번호입니다.'); break; }
                    default:
                        console.log(error);
                }
            });
    }

    return (
        <div className='w-full h-screen'>
            <div className='flex flex-col items-center justify-center h-full relative'>
                <a href='/'><img src='로고' className='w-[75px] h-[48px] mb-[40px]' alt='로고' /></a>
                <label className='text-xs text-red-500 text-start w-[396px]'>{error}</label>
                
                <div className='flex items-start'>
                    <div className='flex flex-col items-center'>
                        <input id='username' type='text' className='w-[396px] h-[46px] input input-bordered rounded-[0] mb-[10px] text-black' 
                        style={{ outline: '0px', color: 'black' }} placeholder='아이디 입력' 
                        onFocus={e => e.target.style.border = '2px solid red'} 
                        onBlur={e => e.target.style.border = ''} 
                        onChange={e => setUsername(e.target.value)} 
                        onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('password') })} />

                        <input id='password' type={canSee ? 'text' : 'password'} className='w-[396px] h-[46px] input input-bordered rounded-[0] text-black' 
                        style={{ outline: '0px', color: 'black' }} placeholder='비밀번호 8자~20자' 
                        onFocus={e => e.target.style.border = '2px solid red'} 
                        onBlur={e => e.target.style.border = ''} 
                        onChange={e => setPassword(e.target.value)} 
                        onKeyDown={e => { KeyDownCheck({ preKey, setPreKey, e: e, pre: () => Move('username'), next: () => document.getElementById('submit')?.click() }) }} />
                        
                        <div className='w-[396px] mt-1'>
                            <input type='checkbox' onChange={() => setCanSee(!canSee)} /> 
                            <label>비밀번호 확인</label>
                        </div>
                    </div>

                    <button id='submit' className='btn btn-active btn-secondary text-white text-lg w-[100px] h-[100px] ml-[10px] flex items-center justify-center' onClick={() => Sumbit()}>로그인</button>
                </div>

                <div className='flex justify-evenly w-[396px] mt-[12px]'>
                    <a>관리자 문의</a>
                    <a>비밀번호 변경</a>
                </div>
                <label className='text-gray-400 text-sm mt-[50px]'>Copyright © 2024 Honeydanji Co.,Ltd. All Rights Reserved.</label>
            </div>
        </div>
    );
}
