'use client'

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getProfile, getUser, getArticleList, getCategoryList, getCenterList, postArticle } from "@/app/API/UserAPI";
import Pagination from "@/app/Global/component/Pagination";
import Main from "@/app/Global/layout/MainLayout";
import Modal from "@/app/Global/component/Modal";
import useConfirm from "@/app/Global/hook/useConfirm";
import useAlert from "@/app/Global/hook/useAlert";
import ConfirmModal from "@/app/Global/component/ConfirmModal";
import AlertModal from "@/app/Global/component/AlertModal";
import { Titillium_Web } from "next/font/google";

interface Article {
    categoryId: number;
    articleId: number;
    title: string;
    content: string;
    createDate: number;
    categoryName: string;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    commentCount?: number;
    loveCount?: number;
}

interface ArticlePage {
    content: Article[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export default function Page() {
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { alertState, showAlert, closeAlert } = useAlert();
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([] as any[]);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [articleList, setArticleList] = useState([] as any[]);
    const [openArticleIds, setOpenArticleIds] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const [categoryId, setCategoryId] = useState<any>(null);
    const [centerList, setCenterList] = useState([] as any[]);
    const [selectedAptId, setSelectedAptId] = useState<number | null>(null);
    const [first, setFirst] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const router = useRouter();


    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                    console.log(r);
                    setSelectedAptId(r.aptResponseDTO.aptId);
                })
                .catch(e => {
                    console.log(e);
                    redirect('/account/login');
                });
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                        setProfile(r);
                        getCategoryList()
                            .then(r => {
                                console.log(r);
                                setCategories(r);
                                r.forEach((r: any) => {
                                    if (r?.name === 'FAQ') {
                                        setCategoryId(r.id);
                                        getArticleList(r.id)
                                            .then(r => {
                                                console.log(r);
                                                setArticleList(r?.content);
                                                setTotalPages(r?.totalPages);
                                            })
                                            .catch(e => console.log(e));
                                    }
                                });
                            })
                        const interval = setInterval(() => {
                            setIsLoading(true);
                            clearInterval(interval);
                        }, 100);
                    })
                    .catch(e => {
                        console.log(e);
                        redirect('/account/profile');
                    });
            } else {
                redirect('/account/profile');
            }
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const handleCheckboxChange = (articleId: number) => {
        setOpenArticleIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(articleId)) {
                newSet.delete(articleId);
            } else {
                newSet.add(articleId);
            }
            return newSet;
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);

        console.log('category', categoryId);
        console.log('apt', user.aptResponseDTO.aptId);
        console.log('current', currentPage);

        getArticleList(categoryId, user.aptResponseDTO.aptId, newPage - 1) // 테트트 때멘 아파트 아이디 넣고  FAQ는 SECURITY 담당이니 추후에 APTID 는 빼야함
            .then(r => {
                console.log(r);
                setArticleList(r.content);
                setTotalPages(r.totalPages);
            })
            .catch(e => console.log(e));
    };

    const handleModalClose = (type: number) => {

        setISModalOpen(type);
        setFirst(true);
    };

    function postFAQ() {
        setISModalOpen(1);
    }

    function postArticles() {
        if (title !== '' && content !== '') {
            postArticle({ categoryId: categoryId, title: title, content: content, topActive: false })
                .then(r => {
                    closeConfirm();
                    handleModalClose(-1);
                    showAlert('글이 성공적으로 등록되었습니다.');
                    getArticleList(categoryId)
                        .then(r => {
                            setArticleList(r?.content);
                            setTotalPages(r?.totalPages);
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => {
                    showAlert('글 등록에 실패했습니다.');
                    console.log(e)
                });
        }
        else {
            showAlert('제목과 내용을 입력해주세요.');
        }
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

    const allErrors = () => {
        const errors = [titleError, contentError];
        return errors.find(error => error !== '') || '';
    };

    const validateInput = (fieldName: string, value: string) => {
        switch (fieldName) {
            case 'title':
                checkInput(
                    value,
                    /^[0-9가-힣a-zA-Z\s.,!?@#$%^&*()_\-+=\[\]{}|;:'",<>?/]{2,50}$/,
                    () => setTitleError(''),
                    (e) => setTitleError(e),
                    '제목을 입력해주세요.'
                );
                break;
            case 'content':
                checkInput(
                    value,
                    /^[0-9가-힣a-zA-Z\s.,!?@#$%^&*()_\-+=\[\]{}|;:'",<>?/]{2,200}$/,
                    () => setContentError(''),
                    (e) => setContentError(e),
                    '내용은 200자 이내로 입력 가능합니다.'
                );
                break;
            default:
                break;
        }
    };


    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6">
                    <div className="mt-5 ml-20 flex flex-col items-start">
                        <h2 className="text-3xl font-bold  mb-4" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>관리사무소</h2>
                        <div className="mb-2 flex flex-col">
                            <a href="/account/FAQ/" className="hover:underline text-yellow-400">FAQ</a>
                        </div>
                    </div>
                </aside>
                <div className="w-[1500px] flex flex-col items-center">
                    <div className="flex">
                        <h2 className="w-[1000px] text-3xl font-bold mb-4 mt-10 ml-[-40px]" style={{ color: 'oklch(80.39% .194 70.76 / 1)' }}>FAQ</h2>
                        {user?.role === 'ADMIN' || user?.role === 'SECURITY' ? <button className="w-[100px] text-lg font-bold mb-4 mt-10 bg-success rounded-lg h-[50px] hover:bg-green-700" onClick={postFAQ}>글 생성</button> : null}
                    </div>
                    {articleList?.map((article) => (
                        <div key={article?.articleId} className="flex justify-center items-center ml-[-40px] mr-[20px] flex-col">
                            <div className={`collapse bg-gray-700 w-[1100px] mt-[20px] ${openArticleIds.has(article?.articleId) ? '' : 'hover:text-secondary'}`}>
                                <input
                                    type="checkbox"
                                    checked={openArticleIds.has(article?.articleId)}
                                    onChange={() => handleCheckboxChange(article?.articleId)}
                                />
                                <div className="collapse-title text-xl font-medium h-full ml-5">
                                    Q : {article?.title}
                                </div>
                                <div className="collapse-content w-[900px] whitespace-normal overflow-hidden">
                                    <p className="break-words p-5">A : {article?.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
            <Modal open={isModalOpen === 1} onClose={() => handleModalClose(-1)} className='rounded-3xl w-[600px] h-[500px] flex flex-col justify-center items-center' escClose={true} outlineClose={true}>
                <button className="btn btn-xl btn-circle text-xl text-black btn-ghost absolute right-2 top-2 hover:cursor-pointer" onClick={() => handleModalClose(-1)}> ✕ </button>
                <h1 className="text-2xl font-bold text-secondary">FAQ <span className="text-black"> 등록</span></h1>
                <label className="text-red-500 text-xs mt-3 h-[20px]">{allErrors()}</label>
                <div className="flex flex-col items-center gap-3">
                    <input type='text' className='w-[500px] mt-2 input input-bordered input-md text-black'
                        placeholder='제목을 입력해주세요.'
                        onChange={e => { if (first) setFirst(false); setTitle(e.target.value); validateInput('title', e.target.value); }}
                        onFocus={(e) => { validateInput('title', e.target.value); if (e.target.value === '') setTitleError('제목을 입력해주세요.'); }}
                        onKeyUp={(e) => { validateInput('title', (e.target as HTMLInputElement).value); if ((e.target as HTMLInputElement).value === '') setTitleError('제목을 입력해주세요.'); }}
                    />
                    <div className="flex mt-2">
                        <textarea name="content" id="content" className='w-[500px] h-[200px] mt-3 input input-bordered input-md text-black resize-none'
                            placeholder='내용을 입력해주세요.'
                            onChange={e => { if (first) setFirst(false); setContent((e.target as HTMLTextAreaElement).value); validateInput('content', (e.target as HTMLTextAreaElement).value); }}
                            onFocus={(e) => { validateInput('content', (e.target as HTMLTextAreaElement).value); if (e.target.value === '') setContentError('내용을 입력해주세요.'); }}
                            onKeyUp={(e) => { validateInput('content', (e.target as HTMLTextAreaElement).value); if ((e.target as HTMLTextAreaElement).value === '') setContentError('내용을 입력해주세요.'); }}
                        />
                    </div>
                    <button className='btn btn-xl btn-accent mt-3 text-black' disabled={first || !!allErrors()} onClick={() => finalConfirm(title, 'FAQ 등록을 완료하시겠습니까?', '등록', postArticles)}>확인</button>
                </div>
            </Modal>
            <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
            <AlertModal error={alertState?.error} show={alertState?.show} url={alertState?.url} onClose={closeAlert} />
        </Main>
    );
};