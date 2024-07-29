'use client';

import { getArticle, getProfile, getUser, saveImageList, updateArticle } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import Main from "@/app/Global/layout/MainLayout";
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import TagInput from '../../../tag/page';
import DOMPurify from 'dompurify';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Tag {
    id: number;
    name: string;
}

interface UploadedImage {
    key: string;
    value: string;
}

export default function EditPage() {
    const { categoryId, articleId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const [localImages, setLocalImages] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);
    const router = useRouter();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser().then(r => setUser(r)).catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile().then(r => setProfile(r)).catch(e => console.log(e));
            else
                redirect('/account/profile');
        }
        else
            redirect('/account/login');

        if (articleId) {
            getArticle(Number(articleId))
                .then(article => {
                    setTitle(article.title);
                    setContent(article.content);
                    setTags(article.tagResponseDTOList.map((tag: any) => ({
                        id: tag.id,
                        name: tag.name
                    })));
                    setUploadedImages(article.urlList ? article.urlList.map((url: string, index: number) => ({
                        key: `existing-${index}`,
                        value: url
                    })) : []);
                    const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                })
                .catch(e => console.log(e));
        }

        return () => {
            setUploadedImages([]);
        };
    }, [ACCESS_TOKEN, PROFILE_ID, articleId]);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLocalImages(prev => [...prev, file]);

                const editor = quillInstance.current?.getEditor();
                if (editor) {
                    const range = editor.getSelection();
                    editor.insertEmbed(range?.index || 0, 'image', base64String);
                }
            };
            reader.readAsDataURL(file);
        };
    }, [quillInstance]);

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
        [imageHandler],
    );

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const handleSubmit = async () => {
        if (!title.trim() || !quillInstance.current?.getEditor().getText().trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            let newUploadedImages: UploadedImage[] = [];
            if (localImages.length > 0) {
                const formData = new FormData();
                localImages.forEach((file) => {
                    formData.append('file', file);
                });
                newUploadedImages = await saveImageList(formData);
            }

            let updatedContent = quillInstance.current?.getEditor().root.innerHTML || '';
            localImages.forEach((file, index) => {
                const localUrl = URL.createObjectURL(file);
                const uploadedImage = newUploadedImages[index];
                if (uploadedImage && uploadedImage.value) {
                    updatedContent = updatedContent.replace(localUrl, uploadedImage.value);
                }
            });

            const allImages = [...uploadedImages, ...newUploadedImages];

            const sanitizedContent = DOMPurify.sanitize(updatedContent);

            const requestData = {
                articleId: Number(articleId),
                title,
                content: sanitizedContent,
                categoryId: Number(categoryId),
                tagName: tags.map(tag => tag.name),
                articleTagId: deletedTagIds,
                topActive: false,
                images: allImages.map(img => img.value)
            };

            await updateArticle(requestData);
            console.log("게시물 수정 완료");
            router.push(`/account/article/${categoryId}/detail/${articleId}`);
        } catch (error) {
            console.error('게시물 수정 중 상세 오류:', error);
            if (error instanceof Error) {
                setError(`게시물 수정 중 오류가 발생했습니다: ${error.message}`);
            } else {
                setError('게시물 수정 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6 bg-gray-800">
                    <CategoryList userRole={user?.role} />
                </aside>
                <div className="flex-1 p-10">
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
                            value={title}
                        />
                        <div style={{ overflow: 'auto', maxHeight: '700px' }}>
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
                        <TagInput tags={tags} setTags={setTags} deletedTagIds={deletedTagIds} setDeletedTagIds={setDeletedTagIds} />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            className='btn btn-outline text-red-500 border border-red-500 bg-transparent hover:bg-red-500 hover:text-white text-lg'
                            onClick={() => router.push(`/account/article/${categoryId}/detail/${articleId}`)}
                        >
                            취소
                        </button>
                        <button
                            id='submit'
                            className='btn btn-outline text-yellow-500 border border-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white text-lg'
                            onClick={() => setShowEditConfirm(true)}
                        >
                            수정
                        </button>
                    </div>
                </div>
                <aside className="w-1/6 p-6">
                </aside>
            </div>
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
        </Main>
    );
}