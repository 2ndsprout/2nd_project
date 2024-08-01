'use client'

import { postPropose } from "@/app/API/NonUserAPI";
import { getUser } from "@/app/API/UserAPI";
import DaumPostcode from "@/app/Global/component/Address";
import AlertModal from "@/app/Global/component/AlertModal";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import useAlert from "@/app/Global/hook/useAlert";
import useConfirm from "@/app/Global/hook/useConfirm";
import Admin from "@/app/Global/layout/AdminLayout";
import { useEffect, useState } from "react";

interface IAddr {
    address: string;
}

export default function Page() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isLoading, setIsLoading] = useState(false);
    const [daumAddr, setDaumAddr] = useState(null as any);
    const [title, setTitle] = useState('');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [aptName, setAptName] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [password, setPassword] = useState('');
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    const [first, setFirst] = useState(true);
    const [titleError, setTitleError] = useState('제목을 입력해주세요.');
    const [minError, setMinError] = useState('시작 동 번호를 입력해주세요.');
    const [maxError, setMaxError] = useState('끝 동 번호를 입력해주세요.');
    const [aptNameError, setAptNameError] = useState('아파트 이름을 입력해주세요.');
    const [roadAddressError, setRoadAddressError] = useState('도로명 주소를 입력해주세요.');
    const [passwordError, setPasswordError] = useState('비밀번호 최소 6자리를 입력해주세요.');
    const [wError, setWError] = useState('층당 세대 수 를 입력해주세요.');
    const [hError, setHError] = useState('층 수를 입력해주세요.');
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN]);


    const handleAddressChange = (address: IAddr) => {
        setRoadAddress(address.address);
        setDaumAddr(address);
        setRoadAddressError('');
    };

    const allErrors = () => {
        const errors = [titleError, aptNameError, roadAddressError, minError, maxError, hError, wError, passwordError];
        return errors.find(error => error !== '') || '';
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

    const validateInput = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'title':
                checkInput(
                    value,
                    /^[0-9가-힣a-zA-Z\s.,!?@#$%^&*()_\-+=\[\]{}|;:'",<>?/]{2,25}$/,
                    () => setTitleError(''),
                    (e) => setTitleError(e),
                    '제목은 25자 이내로 작성해주세요.'
                );
                break;
            case 'min':
                checkInput(
                    value,
                    /^\d{1,4}$/,
                    () => setMinError(''),
                    (e) => setMinError(e),
                    '동 번호는 숫자만 입력 가능합니다.'
                );
                break;
            case 'max':
                checkInput(
                    value,
                    /^\d{1,4}$/,
                    () => setMaxError(''),
                    (e) => setMaxError(e),
                    '동 번호는 숫자만 입력 가능합니다.'
                );
                break;
            case 'aptName':
                checkInput(
                    value,
                    /^[0-9가-힣a-zA-Z\s.,!?@#$%^&*()_\-+=\[\]{}|;:'",<>?/]{2,25}$/,
                    () => setAptNameError(''),
                    (e) => setAptNameError(e),
                    '아파트 명은 50자 이내로 작성해주세요.'
                );
                break;
            case 'roadAddress':
                checkInput(
                    value,
                    /^[0-9가-힣a-zA-Z\s.,!?@#$%^&*()_\-+=\[\]{}|;:'",<>?/]{2,100}$/,
                    () => setRoadAddressError(''),
                    (e) => setRoadAddressError(e),
                    '도로명 주소는 100자 이내로 작성해주세요.'
                );
                break;
            case 'password':
                checkInput(
                    value,
                    /^[0-9a-zA-Z]{4,}$/,
                    () => setPasswordError(''),
                    (e) => setPasswordError(e),
                    '비밀번호는 최소 4자 이상이어야 합니다.'
                );
                break;
            case 'w':
                checkInput(
                    value,
                    /^\d{1,2}$/,
                    () => setWError(''),
                    (e) => setWError(e),
                    '세대수는 숫자만 입력 가능합니다.'
                );
                break;
            case 'h':
                checkInput(
                    value,
                    /^\d{1,2}$/,
                    () => setHError(''),
                    (e) => setHError(e),
                    '층 수는 숫자만 입력 가능합니다.'
                );
                break;
            default:
                break;
        }
    };




    function submit() {
        postPropose({
            title: title,
            roadAddress: roadAddress,
            aptName: aptName,
            min: min,
            max: max,
            h: h,
            w: w,
            password: password,
            proposeStatus: 0
        })
            .then(() => window.location.href = '/propose')
            .catch(e => {
                console.log(e), closeConfirm(), showAlert('이미 등록된 아파트 단지 입니다.')
            });
    }

    return (
        <Admin user={user} isLoading={isLoading} className="flex">
            <div className="ml-[250px] border-2 w-[1400px] h-[800px] rounded-lg bg-gray-700 border-gray-700 flex flex-col justify-center">
                <div className="h-[800px]">
                    <div className="flex flex-col ml-[300px]">
                        <div className="mt-5 ml-[300px] items-center text-2xl font-bold mb-5 justify-center">
                            <span className="text-secondary">꿀 단지</span> 신청 양식
                        </div>
                        <div className="text-center mr-[300px]">
                            <span className="w-[300px] text-sm text-red-500">{allErrors()}</span>
                        </div>
                        <div className="flex flex-col gap-12 items-start">
                            <div className="w-full flex items-center">
                                <span className="mr-[50px] text-xl font-bold">제목<span className="ml-10">:</span></span>
                                <input type="text"
                                    onChange={e => { if (first) setFirst(false); setTitle(e.target.value); validateInput('title', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('title', (e.target as HTMLInputElement).value); if (e.target.value === '') setTitleError('제목을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('title', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setTitleError('제목을 입력해주세요.') }}
                                    placeholder="ex) 대전 IT 2단지 아파트 신청합니다." className="text-black text-lg w-[600px] h-[50px] bg-white rounded-lg p-2.5" />
                            </div>
                            <div className="w-full flex items-center">
                                <span className="mr-[45px] text-xl font-bold">아파트 명<span>:</span></span>
                                <input type="text" placeholder="ex) IT 2단지 아파트" className="text-black text-lg w-[600px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setAptName(e.target.value); validateInput('aptName', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('aptName', (e.target as HTMLInputElement).value); if (e.target.value === '') setAptNameError('아파트 이름을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('aptName', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setAptNameError('아파트 이름을 입력해주세요.') }} />
                            </div>
                            <div className="flex">
                                <div>
                                    <DaumPostcode onAddressChange={handleAddressChange} />
                                </div>
                                {daumAddr && (
                                    <div className="ml-[60px]">
                                        <div className="border-2 bg-white text-gray-700 text-lg rounded-lg border-round-lg w-[600px] h-[50px] flex items-center p-2.5">
                                            {daumAddr.address}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex items-center">
                                <span className="mr-[23px] text-xl font-bold">아파트 동 수<span>:</span></span>
                                <input type="text" placeholder="시작 동 번호 ex) 201" className="text-black text-lg w-[250px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setMin(Number(e.target.value)); validateInput('min', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('min', (e.target as HTMLInputElement).value); if (e.target.value === '') setMinError('시작 동 번호를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('min', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setMinError('시작 동 번호를 입력해주세요.') }} />
                                <span className="ml-[40px] mr-[40px]">~</span>
                                <input type="text" placeholder="끝 동 번호 ex) 209" className="text-black text-lg w-[250px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setMax(Number(e.target.value)); validateInput('max', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('max', (e.target as HTMLInputElement).value); if (e.target.value === '') setMaxError('끝 동 번호를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('max', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setMaxError('끝 동 번호를 입력해주세요.') }} />
                            </div>
                            <div className="w-full flex items-center">
                                <span className="mr-[60px] text-xl font-bold">총 층 수<span>:</span></span>
                                <input type="text" placeholder="아파트의 총 층 수를 입력해주세요." className="text-black text-lg w-[600px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setH(Number(e.target.value)); validateInput('h', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('h', (e.target as HTMLInputElement).value); if (e.target.value === '') setHError('아파트의 총 층 수를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('h', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setHError('아파트의 총 층 수를 입력해주세요.') }} />
                            </div>
                            <div className="w-full flex items-center">
                                <span className="mr-[25px] text-xl font-bold">층당 세대수<span>:</span></span>
                                <input type="text" placeholder="층당 세대수를 입력해주세요." className="text-black text-lg w-[600px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setW(Number(e.target.value)); validateInput('w', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('w', (e.target as HTMLInputElement).value); if (e.target.value === '') setWError('층당 세대수를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('w', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setWError('층당 세대수를 입력해주세요.') }} />
                            </div>
                            <div className="w-full flex items-center">
                                <span className="mr-[50px] text-xl font-bold">비밀번호<span>:</span></span>
                                <input type="password" placeholder="글 비밀번호를 입력해주세요." className="text-black text-lg w-[600px] h-[50px] bg-white rounded-lg p-2.5"
                                    onChange={e => { if (first) setFirst(false); setPassword(e.target.value); validateInput('password', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('password', (e.target as HTMLInputElement).value); if (e.target.value === '') setPasswordError('글 비밀번호를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('password', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setPasswordError('글 비밀번호를 입력해주세요.') }} />
                                <button className="ml-[200px] w-[150px] btn btn-xl btn-accent mt-6 text-black" disabled={first || !!allErrors()} onClick={() => finalConfirm(aptName, '서비스 신청을 완료하시겠습니까?', '신청완료', submit)}>
                                    신청
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Admin>
    );
}
