'use client'

import { useEffect, useState } from "react";
import { getUser } from "../API/UserAPI";
import Admin from "../Global/layout/AdminLayout";
import { getPropose, getProposeList, updatePropose } from "../API/NonUserAPI";
import { checkInput, getDateTimeFormat } from "../Global/component/Method";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useAlert from "../Global/hook/useAlert";
import useConfirm from "../Global/hook/useConfirm";
import Modal from "../Global/component/Modal";
import ConfirmModal from "../Global/component/ConfirmModal";
import AlertModal from "../Global/component/AlertModal";
import DaumPostcode from "../Global/component/Address";
interface IAddr {
    address: string;
}
export default function Page() {
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [proposeList, setProposeList] = useState([] as any[]);
    const [proposeTotalElements, setProposeTotalElements] = useState(null as any);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [canShow, setCanShow] = useState(false);
    const [password, setPassword] = useState('');
    const [proposeId, setProposeId] = useState(0);
    const [propose, setPropose] = useState(null as any);
    const [update, setUpdate] = useState(false);
    const [first, setFirst] = useState(true);
    const [titleError, setTitleError] = useState('');
    const [minError, setMinError] = useState('');
    const [maxError, setMaxError] = useState('');
    const [aptNameError, setAptNameError] = useState('');
    const [roadAddressError, setRoadAddressError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [wError, setWError] = useState('');
    const [hError, setHError] = useState('');
    const [daumAddr, setDaumAddr] = useState(null as any);
    const [title, setTitle] = useState('');
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [aptName, setAptName] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    const [proposeStatus, setProposeStatus] = useState('');
    const [createDate, setCreateDate] = useState('');
    const [modifyDate, setModifyDate] = useState('');
    const [listChanger, setListChanger] = useState(1);

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

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        getProposeList()
            .then(r => {
                setProposeTotalElements(r.totalElements);
                setProposeList(r.content);
            })
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN]);


    function openModal(type: number) {
        setISModalOpen(type);
    }

    const handleModalClose = (type: number) => {
        if(canShow){
            setCanShow(false);
        }
        setISModalOpen(type);
        setUpdate(false);
    };

    const getFilteredProposeList = () => {
        switch (listChanger) {
            case 1:
                return proposeList.filter(propose => propose.proposeStatus === '대기중');
            case 2:
                return proposeList.filter(propose => propose.proposeStatus === '승인완료');
            case 3:
                return proposeList.filter(propose => propose.proposeStatus === '반려중');
            default:
                return [];
        }
    };

    const filteredList = getFilteredProposeList();

    const filteredListCount = filteredList.length;

    function openPropose() {
        getPropose(proposeId, password)
            .then(r => {
                openModal(-1);
                setPropose(r);
                setTitle(r.title);
                setAptName(r.aptName);
                setRoadAddress(r.roadAddress);
                setW(r.w);
                setH(r.h);
                setMin(r.min);
                setMax(r.max);
                setProposeStatus(r.proposeStatus);
                setCreateDate(r.createDate);
                setModifyDate(r.modifyDate);
                openModal(2);
            })
            .catch(e => {
                console.log(e);
                showAlert('비밀번호가 일치하지 않습니다.')
            });
    }

    function onPassword(id: number) {
        setProposeId(id);
        openModal(1);
    }

    function onAdmin(id: number) {
        setUpdate(false);
        getPropose(id, '')
            .then(r => {
                console.log(r);
                setProposeId(id);
                setPropose(r);
                setTitle(r.title);
                setAptName(r.aptName);
                setRoadAddress(r.roadAddress);
                setW(r.w);
                setH(r.h);
                setMin(r.min);
                setMax(r.max);
                setProposeStatus(r.proposeStatus);
                setCreateDate(r.createDate);
                setModifyDate(r.modifyDate);
                openModal(2);
            })
            .catch(e => {
                console.log(e);
                showAlert('요청 불러오기중 오류가 발생했습니다.')
            });
    }

    function handleUpdate() {
        // proposeStatus를 숫자 코드로 변환합니다.
        let proposeStatusCode: number;
        switch (proposeStatus) {
            case '대기중':
                proposeStatusCode = 0;
                break;
            case '승인완료':
                proposeStatusCode = 1;
                break;
            case '반려중':
                proposeStatusCode = 2;
                break;
            default:
                proposeStatusCode = -1; // 잘못된 상태를 나타내는 기본값 (예: -1 또는 0 등)
                break;
        }

        updatePropose({
            id: proposeId,
            title: title,
            roadAddress: roadAddress,
            aptName: aptName,
            min: min,
            max: max,
            h: h,
            w: w,
            proposeStatus: proposeStatusCode // 숫자 코드로 변환된 상태
        })
            .then(r => {
                console.log(r);
                closeConfirm();
                showAlert('수정이 완료되었습니다.', '/propose');
                setUpdate(false);

            })
            .catch(e => {
                console.log(e);
                closeConfirm();
                showAlert('수정 중 오류가 발생했습니다.');
            });
    }

    function postApt() {
        closeConfirm();
        setUpdate(false);
        setISModalOpen(3)
    }

    function updateStatus(id: number) {

        let alert = '';

        if (id == 1) {
            alert = '승인';
        }
        if (id == 2) {
            alert = '반려';
        }

        updatePropose({
            id: proposeId,
            title: title,
            roadAddress: roadAddress,
            aptName: aptName,
            min: min,
            max: max,
            h: h,
            w: w,
            password: password,
            proposeStatus: id, // 숫자 코드로 변환된 상태
        })
            .then(r => {
                console.log(r);
                closeConfirm();
                showAlert(alert + ' 완료되었습니다.', '/propose');
                setUpdate(false);
            })
            .catch(e => {
                console.log(e);
                closeConfirm();
                showAlert(alert + ' 중 오류가 발생했습니다.');
            });
    }



    return (
        <Admin user={user} isLoading={isLoading} className="flex">
            <div className="flex flex-col ml-14 mt-14 gap-10">
                <button onClick={() => setListChanger(1)} className={`btn bg-black border-gray-700 ${listChanger == 1 ? 'text-secondary bg-gray-700' : ''}`}>승인 대기중인 목록</button>
                <button onClick={() => setListChanger(2)} className={`btn bg-black border-gray-700 ${listChanger == 2 ? 'text-secondary bg-gray-700' : ''}`}>승인 완료 목록</button>
                <button onClick={() => setListChanger(3)} className={`btn bg-black border-gray-700 ${listChanger == 3 ? 'text-secondary bg-gray-700' : ''}`}>반려중인 목록</button>
            </div>
            <div className="mt-[30px] ml-[50px] border-2 w-[1400px] h-[800px] rounded-lg bg-gray-700 border-gray-700 flex flex-col items-center justify-center">
                <div className="overflow-x-auto h-[750px]">
                    <table className="table table-lg w-[1200px] flex mt-5">
                        <thead>
                            <tr className="text-center">
                                <th>번호</th>
                                <th className="w-[800px]">아파트 이름</th>
                                <th className="w-[500px]">제목</th>
                                {listChanger == 1 ? <th className="w-[500px]">신청 일자</th> :
                                    listChanger == 2 ? <th className="w-[500px]">승인 일자</th> :
                                        listChanger == 3 ? <th className="w-[500px]">반려 일자</th> : <div />}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.map((propose, proposeIndex) => (
                                <tr
                                    key={propose.id}
                                    className="hover:text-secondary text-center hover:cursor-pointer"
                                    onClick={() => { user?.role !== 'ADMIN' ? onPassword(propose.id) : onAdmin(propose.id) }}
                                >
                                    <td>{filteredListCount - proposeIndex}</td>
                                    <td className="font-bold">{propose.aptName}</td>
                                    <td>{user?.role !== 'ADMIN' ? (<FontAwesomeIcon icon={faLock} className="mr-3" />) : null}{propose.title}</td>
                                    {listChanger == 1 ? <td className="text-sm">{getDateTimeFormat(propose.createDate)}</td> :
                                        <td className="text-sm">{getDateTimeFormat(propose.modifyDate)}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <a href="/propose/create" className="mb-5 ml-[1200px] w-[150px] btn btn-success">서비스 신청</a>
            </div>
            <Modal open={isModalOpen === 1} onClose={() => handleModalClose(-1)} className='rounded-3xl w-[400px] h-[200px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => handleModalClose(-1)}> ✕ </button>
                <div className="flex flex-col items-center gap-3">
                    <input type={canShow ? 'text' : 'password'} className='w-[300px] mt-3 input input-bordered input-md text-black'
                        onChange={e => {setPassword(e.target.value); console.log(e.target.value)}} placeholder='비밀번호'
                    />
                    <div className="flex mt-2">
                        <label className='ml-1 text-sm text-black'>비밀번호 보이기</label>
                        <input className="ml-5 bg-white" type='checkbox' onClick={() => setCanShow(!canShow)} />
                    </div>
                    <button className='btn btn-xl btn-accent mt-3 text-black' onClick={openPropose}>확인</button>
                </div>
            </Modal>
            <Modal
                open={isModalOpen === 2}
                onClose={() => handleModalClose(-2)}
                className='rounded-3xl w-[700px] h-[600px] flex flex-col justify-center items-center'
                escClose={true}
                outlineClose={true}
            >
                <button
                    className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer"
                    onClick={() => handleModalClose(-2)}
                >
                    ✕
                </button>
                <div className="flex flex-col w-full gap-1 mt-8">
                    <div className="text-black flex w-full">
                        <div className="flex w-full ml-16">
                            <div className="flex">
                                <div className="flex flex-col w-[150px] h-full">
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>제목</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>아파트 이름</label>
                                    {!update ? <label className='text-xl font-bold text-secondary mb-1 h-[55px] content-center'>도로명 주소</label> : <><label className='text-xl font-bold text-secondary mb-1 h-[55px] content-center'><DaumPostcode onAddressChange={handleAddressChange} /></label></>}
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>아파트 동 번호</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>총 층수</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>층당 세대 수</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>승인 상태</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>작성 일시</label>
                                    {modifyDate !== null && listChanger == 1 ? <label className='text-xl font-bold text-secondary h-[55px] content-center'>수정 일시</label> : <div />}
                                    {modifyDate !== null && listChanger == 2 ? <label className='text-xl font-bold text-secondary h-[55px] content-center'>승인 일시</label> : <div />}
                                    {modifyDate !== null && listChanger == 3 ? <label className='text-xl font-bold text-secondary h-[55px] content-center'>반려 일시</label> : <div />}
                                </div>
                                <div className="flex flex-col w-[10px] h-full">
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label>
                                    {modifyDate !== null ? <label className='text-xl font-bold text-secondary h-[55px] content-center'>:</label> : <div className="h-[55px]" />}
                                </div>
                            </div>

                            <div className="flex flex-col w-[400px] h-full">
                                <input
                                    type="text"
                                    defaultValue={title}
                                    disabled={!update}
                                    className={`ml-3 font-bold bg-white h-[55px] text-xl w-full content-center ${!update ? 'text-gray-500' : ''}`}
                                    onChange={e => { if (first) setFirst(false); setTitle(e.target.value); validateInput('title', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('title', (e.target as HTMLInputElement).value); if (e.target.value === '') setTitleError('제목을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('title', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setTitleError('제목을 입력해주세요.') }}
                                />

                                <input
                                    type="text"
                                    defaultValue={aptName}
                                    disabled={!update}
                                    className={`ml-3 font-bold bg-white h-[55px] text-xl w-full content-center ${!update ? 'text-gray-500' : ''}`}
                                    onChange={e => { if (first) setFirst(false); setAptName(e.target.value); validateInput('aptName', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('aptName', (e.target as HTMLInputElement).value); if (e.target.value === '') setAptNameError('아파트 이름을 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('aptName', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setAptNameError('아파트 이름을 입력해주세요.') }}
                                />
                                <div className="flex items-center">
                                    {update ? (
                                        <div className="w-[600px] h-[55px]">
                                            {daumAddr !== null ? <>{daumAddr && (
                                                <div>
                                                    <div className="ml-3 bg-white text-black text-lg font-bold rounded-lg w-full h-[55px] flex items-center">
                                                        {daumAddr.address}
                                                    </div>
                                                </div>
                                            )}</> : <div className="ml-3 bg-white text-black text-lg font-bold rounded-lg w-full h-[55px] flex items-center">{roadAddress}</div>}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            defaultValue={roadAddress}
                                            disabled={!update}
                                            className={`ml-3 bg-white text-black text-lg font-bold rounded-lg w-full flex items-center h-[55px]  ${!update ? 'text-gray-500' : ''}`}
                                        />
                                    )}

                                </div>
                                <div className="flex items-center mt-2">
                                    <input
                                        type="text"
                                        defaultValue={min}
                                        disabled={!update}
                                        className={`ml-3 font-bold bg-white h-[55px] text-xl w-1/2 content-center ${!update ? 'text-gray-500' : ''}`}
                                        onChange={e => { if (first) setFirst(false); setMin(Number(e.target.value)); validateInput('min', (e.target as HTMLInputElement).value); }}
                                        onFocus={(e) => { validateInput('min', (e.target as HTMLInputElement).value); if (e.target.value === '') setMinError('시작 동 번호를 입력해주세요.') }}
                                        onKeyUp={(e) => { validateInput('min', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setMinError('시작 동 번호를 입력해주세요.') }}
                                    />
                                    <span className="mx-3 text-3xl font-bold">~</span>
                                    <input
                                        type="text"
                                        defaultValue={max}
                                        disabled={!update}
                                        className={`ml-3 font-bold bg-white h-[55px] text-xl w-full content-center ${!update ? 'text-gray-500' : ''}`}
                                        onChange={e => { if (first) setFirst(false); setMax(Number(e.target.value)); validateInput('max', (e.target as HTMLInputElement).value); }}
                                        onFocus={(e) => { validateInput('max', (e.target as HTMLInputElement).value); if (e.target.value === '') setMaxError('끝 동 번호를 입력해주세요.') }}
                                        onKeyUp={(e) => { validateInput('max', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setMaxError('끝 동 번호를 입력해주세요.') }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    defaultValue={h}
                                    disabled={!update}
                                    className={`ml-3 font-bold bg-white h-[55px] text-xl w-full content-center ${!update ? 'text-gray-500' : ''}`}
                                    onChange={e => { if (first) setFirst(false); setH(Number(e.target.value)); validateInput('h', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('h', (e.target as HTMLInputElement).value); if (e.target.value === '') setHError('아파트의 총 층 수를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('h', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setHError('아파트의 총 층 수를 입력해주세요.') }}
                                />
                                <input
                                    type="text"
                                    defaultValue={w}
                                    disabled={!update}
                                    className={`ml-3 font-bold bg-white h-[55px] text-xl w-full content-center ${!update ? 'text-gray-500' : ''}`}
                                    onChange={e => { if (first) setFirst(false); setW(Number(e.target.value)); validateInput('w', (e.target as HTMLInputElement).value); }}
                                    onFocus={(e) => { validateInput('w', (e.target as HTMLInputElement).value); if (e.target.value === '') setWError('층당 세대수를 입력해주세요.') }}
                                    onKeyUp={(e) => { validateInput('w', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setWError('층당 세대수를 입력해주세요.') }}
                                />
                                <div className="ml-3 font-bold bg-white h-[55px] text-xl w-full content-center">
                                    {proposeStatus}
                                </div>
                                <div className="ml-3 font-bold bg-white h-[55px] text-xl w-full content-center">
                                    {getDateTimeFormat(createDate)}
                                </div>
                                {modifyDate !== null ? <div className="ml-3 font-bold bg-white h-[55px] text-xl w-full content-center">
                                    {getDateTimeFormat(modifyDate)}
                                </div> : <div className="h-[55px]" />}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 ml-auto mr-5 mb-3">
                        {!update ? <button
                            className='btn btn-xl btn-info text-black'
                            onClick={() => setUpdate(true)}
                        >
                            수정
                        </button> : <button
                            className='btn btn-xl btn-info text-black'
                            disabled={first || !!allErrors()}
                            onClick={() => { finalConfirm(aptName, '내용 수정을 완료하시겠습니까?', '완료', handleUpdate); setUpdate(false); }}
                        >
                            수정 완료
                        </button>}
                        {!update ? <button
                            className='btn btn-xl btn-error text-black'
                            onClick={() => setISModalOpen(-2)}
                        >
                            삭제
                        </button> : <button
                            className='btn btn-xl btn-error text-black'
                            onClick={() => setUpdate(false)}
                        >
                            수정 취소
                        </button>}
                        {user?.role === 'ADMIN' && !update && listChanger !== 2 ? (<button
                            className='btn btn-xl btn-success text-black'
                            onClick={() => { finalConfirm(aptName, '승인 하시겠습니까?', '승인', postApt) }}
                        >
                            승인
                        </button>) : null}
                        {user?.role === 'ADMIN' && !update && listChanger !== 3 ? (<button
                            className='btn btn-xl btn-accent text-black'
                            onClick={() => { finalConfirm(aptName, '반려 하시겠습니까?', '반려', () => onAdmin(2)) }}
                        >
                            반려
                        </button>) : null}
                    </div>
                </div>
            </Modal>
            <Modal open={isModalOpen === 3} onClose={() => handleModalClose(-3)} className='rounded-3xl w-[400px] h-[200px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => handleModalClose(-3)}> ✕ </button>
                <div className="flex flex-col items-center gap-3">
                    <input type='text' className='w-[300px] mt-3 input input-bordered input-md text-black'
                        onChange={e => setAptName(e.target.value)} placeholder='아파트명'
                        value={aptName}
                    />
                    <div className="flex mt-2">
                        <label className='ml-1 text-sm text-black'>비밀번호 보이기</label>
                        <input className="ml-5 bg-white" type='checkbox' onClick={() => setCanShow(!canShow)} />
                    </div>
                    <button className='btn btn-xl btn-accent mt-3 text-black' onClick={openPropose}>확인</button>
                </div>
            </Modal>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Admin>
    );
}
