'use client';

import { deleteImageList, getCenter, getCenterList, getProfile, getUser, postArticle, saveImageList } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import Main from "@/app/Global/layout/MainLayout";
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import { redirect, useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../tag/page';

interface Tag {
    id: number;
    name: string;
}

interface UploadedImage {
    k: string;
    v: string;
}

export default function Page() {
    const { categoryId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [preKey, setPreKey] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const [centerList, setCenterList] = useState([] as any[]);

    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);

    const imageHandler = () => {
        const input = document.createElement('input') as HTMLInputElement;
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    
        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (!file) return;
    
            try {
                const formData = new FormData();
                formData.append('file', file);
                const response = await saveImageList(formData);
    
                if (!Array.isArray(response) || response.length === 0) {
                    throw new Error('Unexpected API response format');
                }
    
                const newImage = response[response.length - 1];
                if (!newImage || typeof newImage.value !== 'string') {
                    throw new Error('Invalid image data received');
                }
    
                const imgUrl = newImage.value;
                const editor = quillInstance.current?.getEditor();
                if (editor) {
                    const range = editor.getSelection();
                    if (range) {
                        editor.insertEmbed(range.index, 'image', imgUrl);
                        editor.setSelection(range.index + 1);
                    }
                }
    
                setUploadedImages(prev => [...prev, newImage]);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
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

    useEffect(() => {
        const cleanupImages = async () => {
            try {
                await deleteImageList();
            } catch (error) {
                // 에러 무시 (삭제할 이미지가 없는 경우 등)
            }
        };

        if (ACCESS_TOKEN) {
            getUser().then(setUser).catch(console.error);
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        setIsLoading(true);
                        getCenterList()
                        .then(r => {
                            setCenterList(r);
                        })
                        .catch(e => console.log(e));
                    })
                    .catch(console.error);
            } else {
                redirect('/account/profile');
            }
            cleanupImages();
        } else {
            redirect('/account/login');
        }

        const handleBeforeUnload = () => {
            cleanupImages();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupImages();
        };
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const Submit = async () => {
        if (!title.trim() || !quillInstance.current?.getEditor().getText().trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }
    
        try {
            const content = quillInstance.current?.getEditor().root.innerHTML || '';
            const requestData = {
                title,
                content,
                categoryId: Number(categoryId),
                tagName: tags.map(tag => tag.name),
                articleTagId: deletedTagIds,
                topActive: false,
                images: uploadedImages.map(img => img.v)
            };
    
            await postArticle(requestData);
            await deleteImageList(); // 게시물 등록 후 임시 이미지 삭제
            window.location.href = `/account/article/${categoryId}`;
        } catch (error) {
            console.error('게시물 작성 중 오류:', error);
            setError('게시물 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6 bg-gray-800 fixed absolute h-[920px]">
                    <CategoryList userRole={user?.role}/>
                </aside>
                <div className="flex-1 p-10 ml-[400px]">
                    <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[800px] overflow-auto">
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
                        <div style={{ overflow: 'auto', maxHeight: '800px' }}>
                            <QuillNoSSRWrapper
                                forwardedRef={quillInstance}
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                theme="snow"
                                className='h-64 mb-4'
                                placeholder="내용을 입력해주세요."
                                style={{ minHeight: '600px'}}
                            />
                        </div>
                        <TagInput tags={tags} setTags={setTags} deletedTagIds={deletedTagIds} setDeletedTagIds={setDeletedTagIds} />
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
            </div>
        </Main>
    );
}