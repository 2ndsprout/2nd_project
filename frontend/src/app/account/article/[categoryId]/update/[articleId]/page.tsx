'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, redirect } from 'next/navigation';
import Link from 'next/link';
import { getProfile, getUser, saveImage, saveImageList, updateArticle, getArticle } from '@/app/API/UserAPI';
import { KeyDownCheck, Move } from '@/app/Global/Method';
import QuillNoSSRWrapper from '@/app/Global/QuillNoSSRWrapper';
import CategoryList from '@/app/Global/CategoryList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditPage() {
    const { categoryId, articleId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [showEditConfirm, setShowEditConfirm] = useState(false); // 수정 확인 창 상태 추가
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const quillInstance = useRef<ReactQuill>(null);
    const [url, setUrl] = useState('');
    const tagId = null; // 예시로 null을 사용, 실제로는 관련 state에서 가져와야 함
    const tagIdArray = tagId ? [tagId] : []; // null이나 undefined이면 빈 배열로 설정

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN]);

    useEffect(() => {
        if (PROFILE_ID) {
            getProfile()
                .then(r => {
                    setProfile(r);
                })
                .catch(e => console.log(e));
        } else {
            redirect('/account/profile');
        }
    }, [PROFILE_ID]);

    useEffect(() => {
        if (articleId) {
            getArticle(Number(articleId))
                .then(article => {
                    setTitle(article.title);
                    setContent(article.content);
                })
                .catch(e => console.log(e));
        }
    }, [articleId, categoryId]);

    function stripHtmlTags(html: string) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    function handleSubmit() {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }

        const plainContent = stripHtmlTags(content);  // HTML태그 제거

        // PUT 요청 데이터 준비
        const requestData = {
            articleId: Number(articleId),
            title,
            categoryId: Number(categoryId),
            content: plainContent,
            tagId: tagIdArray, // 빈 배열 또는 실제 tagId 배열
            topActive: false
        };

        updateArticle(requestData)
            .then(() => {
                console.log("게시물 수정 완료");
                window.location.href = `/account/article/${categoryId}/detail/${articleId}`;
            })
            .catch((error) => {
                console.log(error);
                setError('게시물 수정 중 오류가 발생했습니다.');
            });
    }

    const imageHandler = () => {
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            const file = input.files?.[0];

            try {
                const formData = new FormData();
                formData.append('file', file as any);
                const imgUrl = (await saveImageList(formData)).url;
                const editor = (quillInstance?.current as any).getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', imgUrl);
                editor.setSelection(range.index + 1);
            } catch (error) {
                console.log(error);
            }
        });
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: '1' }, { header: '2' }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                    ['image'],
                ],
                handlers: { image: imageHandler },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [],
    );

    function Change(file: any) {
        const formData = new FormData();
        formData.append('file', file);
        saveImage(formData)
            .then(r => setUrl(r?.url))
            .catch(e => console.log(e))
    }

    const getLinkClass = (id: number) => {
        return categoryId === String(id) ? "text-yellow-400 hover:underline" : "hover:underline";
    };

    const confirmEdit = () => {
        setShowEditConfirm(true);
    };

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 bg-gray-800">
                <CategoryList />
            </aside>
            <div className="flex-1 p-10">
                <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[600px]">
                    <input
                        id='title'
                        type='text'
                        className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                        style={{ outline: '0px', color: 'black' }}
                        placeholder='제목 입력'
                        onFocus={e => e.target.style.border = '2px solid red'}
                        onBlur={e => e.target.style.border = ''}
                        onChange={e => setTitle(e.target.value)}
                        onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('content') })}
                        value={title}
                    />
                    <QuillNoSSRWrapper
                        id={content}
                        forwardedRef={quillInstance}
                        value={content}
                        onChange={(e: any) => setContent(e)}
                        modules={modules}
                        theme="snow"
                        className='w-full'
                        placeholder="내용을 입력해주세요."
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className='btn btn-outline text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white text-lg'
                        onClick={() => window.location.href = `/account/article/${categoryId}/detail/${articleId}`}
                    >
                        취소
                    </button>
                    <button
                        id='submit'
                        className='btn btn-outline text-yellow-500 border border-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white text-lg'
                        onClick={confirmEdit}
                    >
                        수정
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-start">
                
            </aside>
            {/* 수정 확인창 */}
            {showEditConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-5 rounded shadow-lg">
                        <div className="text-lg font-semibold text-white">수정 확인</div>
                        <p className="text-gray-400">이 게시물을 수정하시겠습니까?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setShowEditConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
                            <button onClick={handleSubmit} className="p-2 bg-yellow-600 rounded text-white hover:bg-yellow-500">수정</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
