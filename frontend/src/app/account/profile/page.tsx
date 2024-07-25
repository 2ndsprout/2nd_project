'use client'

import '@fortawesome/fontawesome-svg-core/styles.css'
import { getProfile, getProfileList, getUser, postProfile, saveProfileImage, updateUser, updateUserPassword } from "@/app/API/UserAPI";
import DropDown, { Direcion } from "@/app/Global/component/DropDown";
import Modal from "@/app/Global/component/Modal";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faUserPlus, faBars, faEnvelope, faLock, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Check, checkInput } from "@/app/Global/component/Method";
import AlertModal from '@/app/Global/component/AlertModal';
import ConfirmModal from '@/app/Global/component/ConfirmModal';
import useConfirm from '@/app/Global/hook/useConfirm';
import useAlert from '@/app/Global/hook/useAlert';

export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profileList, setProfileList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [openDropDown, setOpenDropDown] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [canShow, setCanShow] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPassword1Error, setNewPassword1Error] = useState('');
    const [newPassword2Error, setNewPassword2Error] = useState('');
    const [first, setFirst] = useState(true);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();


    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                    setEmail(r.email);
                    getProfileList()
                        .then(r => setProfileList(r))
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN]);

    function IsDisabledEamil() {
        return email == '' || email !== user?.email;
    }


    function EmailSubmit() {
        const updateEmail = (document.getElementById('email') as HTMLInputElement).value;

        // 이메일 형식 검사를 수행합니다.
        if (!Check('^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', updateEmail)) {
            setEmailError('이메일 형식이 맞지 않습니다.');
            closeConfirm();
            return;
        }

        updateUser({ email: email, password: "", newPassword1: "", newPassword2: "", name: "" })
            .then(r => {
                // 이메일 변경이 성공하면 사용자 정보를 업데이트합니다.
                setUser(r);
                setEmail(r.email);
                closeConfirm();
                openModal(-2);
            })
            .catch(error => {
                // 이메일 변경 중 오류가 발생하면 오류를 처리합니다.
                console.error('Error updating user:', error); // 오류 메시지 출력
                switch (error.response.data) {
                    case 'email':
                        setEmailError('이메일 중복');
                        closeConfirm();
                        break;
                    default:
                        console.log(error);
                        closeConfirm();
                }
            });
    }

    function openModal(type: number) {
        setISModalOpen(type);
    }

    function Change(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        saveProfileImage(formData)
            .then(r => setUrl(r?.url))
            .catch(e => console.log(e));
    }
    function ChangePassword() {
        // 비밀번호 입력 필드의 값을 가져옵니다.
        const old = (document.getElementById('old_password') as HTMLInputElement).value;
        const new1 = (document.getElementById('new_password1') as HTMLInputElement).value;
        const new2 = (document.getElementById('new_password2') as HTMLInputElement).value;

        // 새 비밀번호가 일치하는지 확인합니다.
        if (new1 !== new2) {
            setNewPassword2Error('변경할 비밀번호가 일치하지 않습니다.');
            closeConfirm();
            return;
        }

        // 새 비밀번호가 올바른 형식인지 확인합니다.
        if (!Check('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-+={}~?:;`|/]).{6,24}$', new1)) {
            setNewPassword1Error('비밀번호는 최소 6자로 대문자, 소문자, 숫자, 특수문자가 한 개씩 들어가 있어야 합니다.');
            closeConfirm();
            return;
        }
        if (!Check('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-+={}~?:;`|/]).{6,24}$', new2)) {
            setNewPassword2Error('변경할 비밀번호가 일치하지 않습니다.');
            closeConfirm();
            return;
        }
        updateUserPassword({ name: user?.username, email: email, password: old, newPassword1: new1, newPassword2: new2 })
            .then(r => {
                // 비밀번호 변경이 성공하면 사용자 정보를 업데이트합니다.
                setUser(r);
                closeConfirm();
                openModal(-2);
            })
            .catch(error => {
                // 비밀번호 변경 중 오류가 발생하면 오류를 처리합니다.
                console.log(error.response.data);
                switch (error.response.data) {
                    case "not match":
                        setNewPassword2Error('현재 비밀번호가 일치하지 않습니다.');
                        closeConfirm();

                        break;
                    default:
                        console.log(error);
                        closeConfirm();
                }
            });

    }


    function Select(id: number) {
        localStorage.setItem('PROFILE_ID', id.toString());
        getProfile()
            .then(() => {
                closeConfirm();
                console.log("profile selected!");
                window.location.href = '/';
            })
            .catch(e => console.log(e));
            closeConfirm();
    }


    function Regist() {
        if (profileList.length < 6) {
            postProfile({ name: name, url: url })
                .then(() => window.location.href = '/account/profile')
                .catch(e => { console.log(e), closeConfirm(), showAlert('이미 있는 프로필 이름입니다.')});

        } else {
            closeConfirm();
            showAlert('프로필은 최대 6개까지 생성 가능합니다.');
        }
    }

    function handleLogout() {
        localStorage.clear();
        window.location.reload();
    }

    const passwordErrors = () => {
        if (oldPasswordError !== '')
            return oldPasswordError;
        if (newPassword1Error !== '' && oldPasswordError === '')
            return newPassword1Error;
        if (newPassword2Error !== '' && newPassword1Error === '' && oldPasswordError === '')
            return newPassword2Error;
    }

    return (
        <>
            <div className="bg-black flex flex-col items-center h-[953px] w-[1900px] relative" id="main">
                <div className="flex justify-end w-full mt-[15px] mr-[50px]">
                    <button id="profileSettings" className="btn btn-active btn-primary w-[180px] text-lg text-black" onClick={() => setOpenDropDown(!openDropDown)}>
                        <FontAwesomeIcon icon={faBars} />프로필 설정
                    </button>
                    <div>
                        <DropDown open={openDropDown} onClose={() => setOpenDropDown(false)} background="main" button="profileSettings" className="mt-[10px]" defaultDriection={Direcion.DOWN} height={200} width={180} x={-3} y={30}>
                            <button className="mt-0 btn btn-active btn-secondary text-lg text-black" onClick={() => openModal(1)}>
                                <FontAwesomeIcon icon={faGear} />계정 설정
                            </button>
                            <button className="mt-[5px] btn btn-active btn-secondary text-lg text-black" onClick={() => openModal(2)}>
                                <FontAwesomeIcon icon={faUserPlus} size="xs" />프로필 추가
                            </button>
                            <button
                                onClick={() => {
                                    if (user) {
                                        finalConfirm('로그아웃', '로그아웃 하시겠습니까?', '로그아웃', () => handleLogout());
                                    }
                                }}
                                className="mt-[5px] btn btn-active btn-secondary text-lg text-black"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                                {user ? '로그아웃' : ''}
                            </button>
                        </DropDown>
                    </div>
                </div>
                <div className="h-1/5">
                    <div className="w-full flex flex-col items-center py-3">
                        <img src='/user.png' className='w-[64px] h-[64px] mb-2' alt="로고" />
                        <label className="font-bold text-2xl text-white">Honey Danji</label>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center mx-auto mt-10 w-full">
                    {profileList?.map((profile, index) => (
                        <div key={index} className="text-center mx-auto my-3 w-1/3">
                            <div className="flex justify-center">
                                <button onClick={() => finalConfirm(profile.name, '해당 프로필로 로그인 하시겠습니까?', '로그인', () => Select(profile.id))}>
                                    <img src={profile?.url ? profile.url : '/user.png'} className="w-56 h-56 mb-2 mt-2 rounded-full" alt="프로필 이미지" />
                                    <span className='font-bold text-xl'>{profile?.name}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal open={isModalOpen === 1} onClose={() => setISModalOpen(-1)} className='modal-box w-[700px] h-[800px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-2)}>✕</button>
                <div className="flex flex-col items-center gap-3">
                    <label className='text-xl text-black font-bold'><label className='text-xl text-secondary font-bold'>회원정보</label> 변경</label>
                    <label className='text-2xl font-bold text-secondary'><span className='text-black'>아이디 : </span>{user?.username}</label>
                    <label className='text-xs font-bold text-red-500'>{emailError}</label>
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
                    <input id='email' type="text" className='input input-bordered input-lg text-black' defaultValue={email} minLength={3}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={e => checkInput(e, '^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', () => setEmailError(''), () => setEmailError('이메일 형식이 맞지 않습니다.'))}
                        onKeyUp={e => checkInput(e, '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', () => setEmailError(''), () => setEmailError('이메일 형식이 맞지 않습니다.'))} />
                    <button id='submit' className='w-[300px] btn btn-xl btn-accent mt-6 text-black' disabled={!IsDisabledEamil() || !!emailError} onClick={() => finalConfirm(name, '이메일을 변경 하시겠습니까?', '변경', EmailSubmit)}>이메일 변경</button>
                    <p className='text-center w-[400px] mt-3 text-xs font-bold text-red-500'>{passwordErrors()}</p>
                    <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />

                    <input id="old_password" type={canShow ? 'text' : 'password'} className='w-[300px] mt-1 input input-bordered input-md text-black' placeholder='현재 비밀번호'
                        onKeyDown={e => { if (e.key == 'Enter') document.getElementById('new_password1')?.focus() }}
                        onFocus={e => { if ((e.target as HTMLInputElement).value == '') setOldPasswordError('현재 비밀번호를 입력해주세요.'); else setOldPasswordError('') }}
                        onKeyUp={e => { if ((e.target as HTMLInputElement).value == '') setOldPasswordError('현재 비밀번호를 입력해주세요.'); else setOldPasswordError('') }}
                        onChange={e => { if (first) setFirst(false); if ((e.target as HTMLInputElement).value == '') setOldPasswordError('현재 비밀번호를 입력해주세요.'); else setOldPasswordError('') }}
                    />

                    <input id="new_password1" type={canShow ? 'text' : 'password'} className='w-[300px] mt-1 input input-bordered input-md text-black' placeholder='변경 할 비밀번호'
                        onKeyDown={e => { if (e.key == 'Enter') document.getElementById('new_password2')?.focus() }}
                        onFocus={e => checkInput(e, '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-+={}~?:;`|/]).{6,24}$', () => setNewPassword1Error(''), () => setNewPassword1Error('비밀번호는 최소 6자로 대문자, 소문자, 숫자, 특수문자가 한개씩 들어가 있어야합니다.'))}
                        onKeyUp={e => checkInput(e, '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-+={}~?:;`|/]).{6,24}$', () => setNewPassword1Error(''), () => setNewPassword1Error('비밀번호는 최소 6자로 대문자, 소문자, 숫자, 특수문자가 한개씩 들어가 있어야합니다.'))}
                        onChange={e => { if (first) setFirst(false); checkInput(e, '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()-+={}~?:;`|/]).{6,24}$', () => setNewPassword1Error(''), () => setNewPassword1Error('비밀번호는 최소 6자로 대문자, 소문자, 숫자, 특수문자가 한개씩 들어가 있어야합니다.')) }} />

                    <input id="new_password2" type={canShow ? 'text' : 'password'} className='w-[300px] mt-1 input input-bordered input-md text-black' placeholder='비밀번호 확인'
                        onKeyDown={e => { if (e.key == 'Enter') document.getElementById('password_submit')?.click() }}
                        onFocus={e => {
                            if ((e.target as HTMLInputElement).value !== (document.getElementById('new_password1') as HTMLInputElement).value)
                                setNewPassword2Error('변경할 비밀번호가 일치하지 않습니다.'); else setNewPassword2Error('')
                        }}
                        onChange={e => {
                            if (first) setFirst(false);
                            if ((e.target as HTMLInputElement).value !== (document.getElementById('new_password1') as HTMLInputElement).value)
                                setNewPassword2Error('변경할 비밀번호가 일치하지 않습니다.'); else setNewPassword2Error('')
                        }} />
                    <div className="flex mt-2">
                        <label className='ml-1 text-sm text-black'>비밀번호 보이기</label>
                        <input className="ml-5" type='checkbox' onClick={() => setCanShow(!canShow)} />
                    </div>
                    <button className='w-[300px] btn btn-xl btn-accent mt-6 text-black' disabled={first || !!passwordErrors()} onClick={() => finalConfirm(user.username, '비밀번호를 변경 하시겠습니까?', '변경', ChangePassword)}>비밀번호 변경</button>
                </div>
            </Modal>
            <Modal open={isModalOpen === 2} onClose={() => setISModalOpen(-2)} className='modal-box w-[400px] h-[400px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-1)}> ✕ </button>
                <div className="relative w-[128px] h-auto flex justify-center items-center mb-10">
                    <div className="w-[128px] h-[128px] rounded-full opacity-30 absolute hover:bg-gray-500" onClick={() => document.getElementById('file')?.click()}></div>
                    <img src={url ? url : '/user.png'} alt='Profile Image' className='w-[128px] h-[128px] rounded-full' />
                    <input id='file' hidden type='file' onChange={e => e.target.files && Change(e.target.files?.[0])} />
                </div>
                <div className="mt-0 flex flex-col items-center">
                    <label className='text-xs font-bold text-red-500 pb-5'>{error}</label>
                    <input id='name' type="text" defaultValue={name} onChange={e => setName(e.target.value)} className='input input-bordered input-lg text-black' placeholder="이름을 입력해주세요"
                        onFocus={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))}
                        onKeyUp={e => checkInput(e, '^[가-힣]{1,6}$', () => setError(''), () => setError('프로필 이름은 6자 내외 한글만 가능합니다.'))} />
                    <button className='btn btn-xl btn-accent mt-10 text-black' disabled={!!error} onClick={() => finalConfirm(name, '프로필을 생성합니다.', '생성', Regist)}>프로필 등록</button>
                </div>
            </Modal>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert}/>
        </>
    );
}
