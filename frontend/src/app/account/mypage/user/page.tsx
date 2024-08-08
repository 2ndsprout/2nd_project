'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, getUserList, deleteUser, getCenterList, register, getApt } from "@/app/API/UserAPI";
import Profile from "@/app/Global/layout/ProfileLayout";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import Pagination from "@/app/Global/component/Pagination";
import Modal from "@/app/Global/component/Modal";


export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const [userList, setUserList] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [selectedApt, setSelectedApt] = useState('' as any);
    const [usernameError, setUsernameError] = useState('이름을 입력해주세요.');
    const [aptNumberError, setAptNumError] = useState('아파트 동을 입력해주세요.');
    const [roleError, setRoleError] = useState('권한을 입력해주세요.');
    const [first, setFirst] = useState(true);
    let [role, setRole] = useState('' as any);
    const [username, setUsername] = useState('' as string);
    const [password, setPassword] = useState('' as string);
    const [aptNum, setAptNum] = useState('' as any);






    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    console.log('User response:', r);
                    setUser(r);
                    getApt(r.aptResponseDTO.aptId)
                        .then(response => {
                            setSelectedApt(response);
                        })
                    return getUserList(r.aptResponseDTO.aptId, currentPage - 1);
                })
                .then(r => {
                    console.log('User list response:', r);
                    const filteredUserList = r.content.filter((user: any) => user.role !== 'ADMIN');
                    setUserList(filteredUserList);
                    setTotalPages(r.totalPages);
                })
                .catch(e => console.log(e));
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        console.log(r);
                        setProfile(r);
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => console.log(e));
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN, PROFILE_ID, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        // 페이지 변경 시 데이터 로드
        if (user && user.aptResponseDTO) {
            getUserList(user.aptResponseDTO.aptId, newPage - 1)
                .then((r) => {
                    setUserList(r.content);
                    setTotalPages(r.totalPages); // 응답에서 totalPages 설정
                })
                .catch(e => console.log(e));
        }
    };


    function deleteTargetUser(deleteUsername: string) {
        if (deleteUsername !== null) {
            try {
                deleteUser(deleteUsername)
                    .then(() => {
                        getUserList(selectedApt.aptId, currentPage - 1)
                            .then((r) => {
                                setUserList(r.content);
                                setTotalPages(r.totalPages);
                                alert('유저가 삭제되었습니다.');
                            })
                            .catch(e => console.log(e));
                        closeConfirm();
                    })
                    .catch(e => console.log(e));
                showAlert('레슨 신청 취소가 완료되었습니다.', '/account/mypage/user');
            } catch (e) {
                showAlert('유저 삭제 중 오류가 발생했습니다.');
                closeAlert();
                console.error(e);
            }
        } else {
            showAlert('유저 삭제 중 오류가 발생했습니다.');
            closeAlert();
        }
    }

    function openModal(aptId: number) {
        setISModalOpen(1)
    }

    function onClose(type: number) {
        setISModalOpen(type);
        setUsernameError('이름을 입력해주세요.');
        setAptNumError('아파트 동을 입력해주세요.');
        setRoleError('권한을 입력해주세요.');
        setFirst(true);
        setRole(-1);
    }

    const allErrors = () => {
        const errors = [usernameError, aptNumberError, roleError];
        return errors.find(error => error !== '') || '';
    };

    function submit() {
        onClose(-1);
        closeConfirm();

        register({
            name: username,
            password: password,
            aptNum: aptNum,
            aptId: selectedApt.aptId,
            role: role
        })
            .then((r) => {
                getUserList(selectedApt.aptId, currentPage - 1)
                    .then(r => {
                        setUserList(r.content);
                        setTotalPages(r.totalPages);
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
        setUsernameError('');
        setAptNumError('');
        setRoleError('');
        setRole(-1);
    };

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

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(Number(event.target.value)); // 변환된 숫자값 설정
        setRoleError('');
    };

    return (

        <Profile user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className='flex flex-col'>
                <label className='text-xl font-bold'><label className='text-xl text-secondary font-bold'>유저</label> 관리</label>
                <div className="mt-9 w-[1300px] border-2 h-[650px] rounded-lg p-[30px]">
                    <div className="h-[580px]">

                        <div className="h-[500px]">
                            {userList.map((user) => (
                                <div key={user.username} className="w-[1200px] flex justify-center">
                                    <div className="border-b-[1px] w-[900px] flex">
                                        <p className="font-bold m-[13px]">{user?.username}</p>
                                        <div className="flex w-full items-center justify-end">
                                            <button onClick={() => finalConfirm(user?.username, '해당 유저를 삭제하시겠습니까?', '삭제', () => deleteTargetUser(user?.username))} className="btn btn-error text-xs btn-xs h-[28px]"><FontAwesomeIcon icon={faXmark} size="xs" />유저 삭제</button>
                                        </div>
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
                    <div className='w-[1220px] flex flex-col justify-end items-end mt-[-40px]'>
                        <button className='flex items-center justify-center w-[95px] bg-yellow-600 rounded hover:bg-yellow-400 h-[40px]' onClick={() => openModal(user?.aptResponseDTO?.aptId)} >
                            유저 생성
                        </button>
                    </div>
                </div>
                <Modal open={isModalOpen === 1} onClose={() => onClose(-1)} className='w-[900px] h-[700px] flex flex-col justify-center items-center p-5' escClose={true} outlineClose={true} >
                    <span className='text-red'>{allErrors()}</span>
                    <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => onClose(-1)}> ✕ </button>
                    <div className="w-full flex items-center mb-[30px]">
                        <span className="text-xl font-bold text-black w-[150px]">Apt Id
                            <span className="ml-[62px]">:</span>
                            <span className="ml-[10px] mr-[-30px]">{selectedApt.aptId}</span>
                        </span>
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
                    <button className=" w-[150px] btn btn-xl btn-accent mt-6 text-black" disabled={first || allErrors() !== ''} onClick={() => finalConfirm(aptNum, '회원을 만들겠습니까?', '신청완료', submit)}>
                        신청
                    </button>
                </Modal>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
        </Profile>
    );
}
