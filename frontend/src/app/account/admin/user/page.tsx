'use client'

import { getAptList, getCenterList, getUserList, deleteUser, register } from '@/app/API/UserAPI';

import { getProfile, getUser } from "@/app/API/UserAPI";
import ConfirmModal from '@/app/Global/component/ConfirmModal';
import Modal from '@/app/Global/component/Modal';
import Pagination from '@/app/Global/component/Pagination';
import useConfirm from '@/app/Global/hook/useConfirm';
import Main from '@/app/Global/layout/MainLayout';
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";


export default function Page() {
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [centerList, setCenterList] = useState([] as any[]);
    const [aptList, setAptList] = useState([] as any[]);
    const [userList, setUserList] = useState([] as any[]);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [selectedApt, setSelectedApt] = useState('' as any);
    const [aptError, setAptError] = useState('아파트를 설정해주세요.');
    const [apt, setApt] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [first, setFirst] = useState(true);
    const [second, setSecond] = useState(true);
    const [usernameError, setUsernameError] = useState('이름을 입력해주세요.');
    const [aptNumberError, setAptNumError] = useState('아파트 동을 입력해주세요.');
    const [roleError, setRoleError] = useState('권한을 입력해주세요.');
    const [username, setUsername] = useState('' as string);
    const [password, setPassword] = useState('' as string);
    const [aptNum, setAptNum] = useState('' as any);
    let [role, setRole] = useState('' as any);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    if (r.role !== 'ADMIN') {
                        setError('관리자 권한이 필요합니다.');
                        setRedirectCountdown(3);
                    }
                })
                .catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getAptList()
                            .then(r => {
                                setAptList(r);
                            })
                            .catch(e => console.log(e));
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 500);
    }, [ACCESS_TOKEN, PROFILE_ID, userList]);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedApt(value);
        setSecond(false);
        if (value === '') {
            setAptError('아파트를 선택해주세요.');
        } else {
            setAptError('');
            const selectedApt = aptList.find(apt => apt.aptId === Number(value));
            if (selectedApt) {
                setApt(selectedApt);
                getUserList(selectedApt.aptId)
                    .then((r) => {
                        setUserList(r.content);
                        setTotalPages(r.totalPages);
                        setCurrentPage(1);
                    })
                    .catch(e => console.log(e));
            }
        }
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // 페이지 변경 시 데이터 로드
        if (selectedApt) {
            getUserList(apt.aptId, newPage - 1)
                .then((r) => {
                    setUserList(r.content);
                    setTotalPages(r.totalPages); // 응답에서 totalPages 설정
                    console.log("content", r.content);
                })
                .catch(e => console.log(e));
        }
    };
    function deleteUserButton(targetUsername: string) {
        deleteUser(targetUsername)
            .then(() => {
                if (apt) {
                    getUserList(apt.aptId, currentPage - 1)
                        .then((r) => {
                            setUserList(r.content);
                            setTotalPages(r.totalPages);
                            alert('유저가 삭제되었습니다.');
                        })
                        .catch(e => console.log(e));
                }
                closeConfirm();
            })
            .catch(e => console.log(e));
    }

    function openModal(aptId: number) {
        setISModalOpen(1)
    }
    function checkInput(
        value: string,
        pattern: RegExp,
        onValid: () => void,
        onInvalid: (error: string) => void,
        error: string // error 메시지를 추가로 인수로 받습니다.
    ) {
        if (pattern.test(value)) {
            onValid();
        } else {
            onInvalid(error); // error 메시지를 전달합니다.
        }
    }
    const validateInput = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'username':
                checkInput(
                    value,
                    /^[0-9a-zA-Z_]{2,20}$/,
                    () => setUsernameError(''),
                    (e) => setUsernameError(e),
                    '이름은 2자에서 20자 이내로 숫자, 영어, 언더바(_)만 포함되게 작성해주세요.'
                );
                break;
            case 'aptNumber':
                checkInput(
                    value,
                    /^[0-9]{2,10}$/,
                    () => setAptNumError(''),
                    (e) => setAptNumError(e),
                    '아파트 동은 10자 이내로 숫자만 포함되게 작성해주세요.'
                );
                break;
            case 'aptId':
                if (value === null || value === '') {
                    setAptError('아파트 ID를 선택해주세요.');
                } else {
                    setAptError('');
                }
                break;
            case 'role':
                if (value === null || value === '') {
                    setRoleError('역할을 선택해주세요.');
                } else {
                    setRoleError('');
                }
                break;
            default:
                break;
        }
    };

    function submit() {
        onClose(-1);
        closeConfirm();
        register({
            name: username,
            password: password,
            aptNum: aptNum,
            aptId: apt.aptId,
            role: role
        })
            .then((r) => {
                getUserList(apt.aptId, currentPage - 1)
                    .then(r => {
                        setUserList(r.content);
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        setUsernameError('');
        setAptNumError('');
        setRoleError('');
        setAptError('');
        setRole(-1);
    };

    function onClose(type: number) {
        setISModalOpen(type);
        setUsernameError('이름을 입력해주세요.');
        setAptNumError('아파트 동을 입력해주세요.');
        setRoleError('권한을 입력해주세요.');
        setFirst(true);
        setRole(-1);
    }


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(Number(event.target.value)); // 변환된 숫자값 설정
        setRoleError('');
    };

    const allErrors = () => {
        const errors = [usernameError, aptNumberError, roleError, aptError];
        return errors.find(error => error !== '') || '';
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="bg-black w-full text-white flex items-center justify-center">
                <div className='flex w-full h-[800px] items-center justify-center mt-[30px]'>
                    <div className='w-[1500px] h-[800px] bg-gray-700 rounded-lg items-center justify-center flex flex-col'>
                        <div className='flex w-[1000px]'>
                            <select
                                className="flex mb-[30px] font-bold text-white select select-bordered w-[320px] max-w-xs"
                                value={selectedApt}
                                onChange={handleSelectChange}  // handleChange 함수를 호출합니다.
                            >
                                <option className="text-black font-bold" value="" disabled>
                                    아파트 목록
                                </option>
                                {aptList.map((apt) => (
                                    <option
                                        className="text-black"
                                        key={apt.aptId}
                                        value={apt.aptId}
                                    >
                                        {apt.aptId} - {apt.aptName}
                                    </option>
                                ))}
                            </select>
                            <div className='w-[680px] flex justify-end'>
                                <button className='flex items-center justify-center w-[100px] bg-yellow-600 rounded hover:bg-yellow-400 h-[45px]' onClick={() => openModal(selectedApt.aptId)} disabled={second}>
                                    유저 생성
                                </button>
                            </div>
                        </div>
                        <Modal open={isModalOpen === 1} onClose={() => onClose(-1)} className='w-[900px] h-[700px] flex flex-col justify-center items-center p-5' escClose={true} outlineClose={true} >
                            <span className='text-red'>{allErrors()}</span>
                            <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => onClose(-1)}> ✕ </button>
                            <div className="w-full flex items-center mb-[30px]">
                                <span className="text-xl font-bold text-black w-[150px]">Apt Id<span className="ml-[62px]">:</span></span>
                                <select
                                    className="flex font-bold text-black select select-bordered w-[320px] max-w-xs"
                                    value={selectedApt}
                                    onChange={handleSelectChange}  // handleChange 함수를 호출합니다.
                                    onKeyUp={(e) => { validateInput('aptId', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setAptError('아파트를 선택해주세요.') }}
                                >
                                    <option className="text-black font-bold" value="" disabled>
                                        아파트 목록
                                    </option>
                                    {aptList.map((apt) => (
                                        <option
                                            className="text-black"
                                            key={apt.aptId}
                                            value={apt.aptId}
                                        >
                                            {apt.aptId} - {apt.aptName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full flex items-center mb-[30px]">
                                <span className="text-xl font-bold text-black w-[150px]">name<span className="ml-[62px]">:</span></span>
                                <input type="text"
                                    onChange={e => { if (first) setFirst(false); setUsername(e.target.value); setPassword(e.target.value); validateInput('username', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('username', (e.target as HTMLInputElement).value); if (e.target.value === '') setUsernameError('이름을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('username', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setUsernameError('이름을 입력해주세요.') }}
                                    placeholder="아파트아이디_동_호수 ex) 1_101_101" className="text-black text-lg w-[650px] h-[50px] bg-white border border-gray-400 rounded-lg p-2.5" />
                            </div>
                            <div className="w-full flex items-center mb-[30px]">
                                <span className="text-lg font-bold text-black w-[150px]">Apt Num<span className="ml-[40px]">:</span></span>
                                <input type="text"
                                    onChange={e => { if (first) setFirst(false); setAptNum(e.target.value); validateInput('aptNumber', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('aptNumber', (e.target as HTMLInputElement).value); if (e.target.value === '') setAptNumError('아파트 동을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('aptNumber', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setAptNumError('아파트 동을 입력해주세요.') }}
                                    placeholder="ex) 101" className="text-black text-lg w-[650px] h-[50px] bg-white border border-gray-400 rounded-lg p-2.5" />
                            </div>
                            <div className="w-full flex items-center">
                                <span className="text-lg font-bold text-black w-[150px] ">Role<span className="ml-[78px]">:</span></span>
                                <select
                                    id="role"
                                    defaultValue={-1}
                                    onChange={handleChange}
                                    className="text-black text-lg w-[650px] h-[50px] bg-white border border-gray-400 rounded-lg p-2.5"
                                    onKeyUp={(e) => { validateInput('role', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setAptNumError('권한을 선택해주세요.') }}
                                >
                                    <option value={-1} disabled>역할을 선택하세요</option>
                                    <option value={1}>관리자</option>
                                    <option value={2}>강사</option>
                                    <option value={3}>주민</option>
                                </select>
                            </div>
                            <button className="ml-[200px] w-[150px] btn btn-xl btn-accent mt-6 text-black" disabled={first || allErrors() !== ''} onClick={() => finalConfirm(aptNum, '회원을 만들겠습니까?', '신청완료', submit)}>
                                신청
                            </button>
                        </Modal>
                        <div className="h-[500px] w-[1000px]">
                            <div className="h-[500px]">
                                {userList.map((user) => (
                                    <div key={user.username} className='flex items-center justify-between border-b-2 h-[50px]'>
                                        <div className='flex items-center w-full h-full'>
                                            <div className='ml-4 w-full h-full' >
                                                <div className='text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-[300px]'>{user.username}</div>
                                            </div>
                                        </div>
                                        <div className="w-[300px] justify-end flex">
                                            <button onClick={() => finalConfirm(user?.username, '해당 유저를 삭제하시겠습니까?', '삭제', () => deleteUserButton(user?.username))} className='text-sm mr-[30px] font-bold text-red-400 hover:text-red-600'>유저 삭제</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-6">
                                {userList && userList.length > 0 ? (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
        </Main>
    );
}