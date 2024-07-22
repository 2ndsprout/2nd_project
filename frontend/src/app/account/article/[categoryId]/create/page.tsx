'use client'

import { getProfile, getUser, postArticle, saveImage, saveImageList } from '@/app/API/UserAPI';
import { KeyDownCheck, Move } from '@/app/Global/Method';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, redirect } from "next/navigation";
import QuillNoSSRWrapper from '@/app/Global/QuillNoSSRWrapper';
import CategoryList from '@/app/Global/CategoryList';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

export default function Page() {
    const { categoryId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const quillInstance = useRef<ReactQuill>(null);

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
                    })
                    .catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const imageHandler = () => {
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            const file = input.files?.[0];
        if (!file) return;

        try {
            let result;
            // First try saveImageList
            try {
                result = await saveImageList(file);
            } catch (error) {
                console.error('Error in saveImageList, trying saveImage:', error);
                // If saveImageList fails, try saveImage
                result = await saveImage(file);
            }

            if (result && result.url) {
                const editor = (quillInstance?.current as any).getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', result.url);
                editor.setSelection(range.index + 1);
            } else {
                throw new Error('Invalid image URL received');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            setError('이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
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

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    function Submit() {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }

        const requestData = {
            title,
            content,  // 전체 HTML 컨텐츠를 저장
            categoryId: Number(categoryId),
            tagId: [],  // 태그 기능이 필요하다면 여기에 구현
            topActive: false
        };

        postArticle(requestData)
            .then(() => {
                console.log("게시물 등록 완료");
                window.location.href = `/account/article/${categoryId}`;
            }).catch((error) => {
                console.error('게시물 작성 중 오류:', error);
                setError('게시물 작성 중 오류가 발생했습니다.');
            });
    }

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 bg-gray-800">
                <CategoryList />
            </aside>
            <div className="flex-1 p-10">
                <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[800px]">
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
                    <div style={{ overflow: 'auto' }}>
                        <QuillNoSSRWrapper
                            forwardedRef={quillInstance}
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            theme="snow"
                            className='w-full text-black'
                            style={{ minHeight: '700px', background: 'white' }}
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
                        onClick={Submit}
                    >
                        작성
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6 bg-gray-800">

            </aside>
        </div>
    );
}