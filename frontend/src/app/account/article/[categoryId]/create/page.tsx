'use client'

import { getProfile, getUser, postArticle, saveImage, saveImageList } from '@/app/API/UserAPI';
import { KeyDownCheck, Move } from  '@/app/Global/Method';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, redirect } from "next/navigation";
import Link from 'next/link';
import QuillNoSSRWrapper from '@/app/Global/QuillNoSSRWrapper';
import CategoryList from '@/app/Global/CategoryList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Page() {
    const { categoryId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const tagId = null; // 예시로 null을 사용, 실제로는 관련 state에서 가져와야 함
    const tagIdArray = tagId ? [tagId] : []; // null이나 undefined이면 빈 배열로 설정
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const quillInstance = useRef<ReactQuill>(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (ACCESS_TOKEN) {
          getUser()
            .then(r => {
              setUser(r);
            })
            .catch(e => console.log(e));
          if (PROFILE_ID)
            getProfile()
              .then(r => {
                setProfile(r);
                // getSearch({ Page: props.page, Keyword: encodeURIComponent(props.keyword)})
                // .then(r => setSearch(r))
                // .catch(e => console.log
              })
              .catch(e => console.log(e));
          else
            redirect('/account/profile');
        }
        else
          redirect('/account/login');
    
      }, [ACCESS_TOKEN, PROFILE_ID]);

    function stripHtmlTags(html: string) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }


    function Sumbit() {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }

        const plainContent = stripHtmlTags(content);  // HTML태그 제거

        // POST 요청 데이터 준비
        const requestData = {
            title,
            content: plainContent,
            categoryId: Number(categoryId),
            tagId: tagIdArray, // 빈 배열 또는 실제 tagId 배열
            topActive: false
        };


        postArticle(requestData)
            .then(() => {
                console.log("게시물 등록 완료");
                window.location.href = `/`;
            }).catch((error) => {
                console.log(error);
                setError('게시물 작성 중 오류가 발생했습니다.');
                
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
                    />
                    <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                        <QuillNoSSRWrapper
                            id={content}
                            forwardedRef={quillInstance}
                            value={content}
                            onChange={(e: any) => setContent(e)}
                            modules={modules}
                            theme="snow"
                            className='w-full text-black'
                            style={{ height: '70%', minHeight: '600px', background: 'white'}}
                            placeholder="내용을 입력해주세요."
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className='btn btn-outline text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white text-lg'
                        onClick={() => window.location.href = '/'}
                    >
                        취소
                    </button>
                    <button
                        id='submit'
                        className='btn btn-outline text-yellow-500 border border-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white text-lg'
                        onClick={() => Sumbit()}
                    >
                        작성
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-start">
                
            </aside>
        </div>
    );
}


