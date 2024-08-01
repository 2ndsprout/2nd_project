'use client'

import { useEffect, useState } from "react";
import { getUser } from "../API/UserAPI";
import Admin from "../Global/layout/AdminLayout";
import { getPropose, getProposeList } from "../API/NonUserAPI";
import { checkInput, getDateTimeFormat } from "../Global/component/Method";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useAlert from "../Global/hook/useAlert";
import useConfirm from "../Global/hook/useConfirm";
import Modal from "../Global/component/Modal";
import ConfirmModal from "../Global/component/ConfirmModal";
import AlertModal from "../Global/component/AlertModal";

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
                console.log(r);
                setProposeList(r.content);
            })
        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
    }, [ACCESS_TOKEN]);


    function openModal(type: number) {
        setISModalOpen(type);
    }

    function openPropose() {
        getPropose(proposeId, password)
            .then(r => {
                console.log(r);
                openModal(-1);
                setPropose(r);
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
        getPropose(id)
        .then(r => {
            console.log(r);
            setPropose(r);
            openModal(2);
        })
        .catch(e => {
            console.log(e);
            showAlert('요청 불러오기중 오류가 발생했습니다.')
        });
    }

    return (
        <Admin user={user} isLoading={isLoading} className="flex">
            <div className="mt-[30px] ml-[250px] border-2 w-[1400px] h-[800px] rounded-lg bg-gray-700 border-gray-700 flex flex-col items-center justify-center">
                <div className="overflow-x-auto h-[750px]">
                    <table className="table table-lg w-[1200px] flex mt-5">
                        <thead>
                            <tr className="text-center">
                                <th>번호</th>
                                <th className="w-[800px]">제목</th>
                                <th>신청일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proposeList?.map((propose, proposeIndex) => (
                                <tr key={propose?.id} className="hover:text-secondary text-center hover:cursor-pointer" onClick={() => {user?.role !== 'ADMIN' ? onPassword(propose?.id) : onAdmin(propose?.id)}}>
                                    <td >{proposeTotalElements - proposeIndex}</td>
                                    <td>{user?.role !== 'ADMIN' ? (<FontAwesomeIcon icon={faLock} className="mr-3" />) : null}{propose?.title}</td>
                                    <td className="text-sm" >{getDateTimeFormat(propose?.createDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <a href="/propose/create" className="mb-5 ml-[1200px] w-[150px] btn btn-success">생성</a>
            </div>
            <Modal open={isModalOpen === 1} onClose={() => setISModalOpen(-1)} className='modal-box w-[400px] h-[200px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-1)}> ✕ </button>
                <div className="flex flex-col items-center gap-3">
                    <input type={canShow ? 'text' : 'password'} className='w-[300px] mt-3 input input-bordered input-md text-black'
                        onChange={e => setPassword(e.target.value)} placeholder='비밀번호'
                    />
                    <div className="flex mt-2">
                        <label className='ml-1 text-sm text-black'>비밀번호 보이기</label>
                        <input className="ml-5 bg-white" type='checkbox' onClick={() => setCanShow(!canShow)} />
                    </div>
                    <button className='btn btn-xl btn-accent mt-3 text-black' onClick={openPropose}>확인</button>
                </div>
            </Modal>
            <Modal open={isModalOpen === 2} onClose={() => setISModalOpen(-2)} className='modal-box w-[400px] h-[200px] flex flex-col justify-center items-center' escClose={true} outlineClose={true} >
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => openModal(-2)}> ✕ </button>
                <div className="flex flex-col items-center gap-3">
                    <div className="text-black">
                        {propose?.title}
                    </div>
                    <button className='btn btn-xl btn-accent mt-3 text-black' onClick={() => setISModalOpen(-2)}>확인</button>
                </div>
            </Modal>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Admin>
    );
}
