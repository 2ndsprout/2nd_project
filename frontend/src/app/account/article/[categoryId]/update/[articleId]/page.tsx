'use client';

import { getArticle, getCenterList, getProfile, getUser, saveImageList, updateArticle, deleteImageList, postTag } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import Main from "@/app/Global/layout/MainLayout";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../../tag/TagInput';
import DOMPurify from 'dompurify';


interface Tag {
    id: number;
    name: string;
}

interface UploadedImage {
    k: string;
    v: string;
}

export default function EditPage() {
    const { categoryId, articleId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [preKey, setPreKey] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const [localImages, setLocalImages] = useState<File[]>([]);
    const [centerList, setCenterList] = useState([] as any[]);
    const [isLoading, setIsLoading] = useState(false);
    const [showEditConfirm, setShowEditConfirm] = useState(false);
    const [hasEditPermission, setHasEditPermission] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);
    const router = useRouter();

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
            .then(r => 
                setUser(r))
            .catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile()
            .then(r => {
                setProfile(r)
                getCenterList()
                .then(r => {
                    setCenterList(r);
                    const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
                })
        })
            .catch(e => console.log(e));
            else
            router.push('/account/profile');
        }
        else
        router.push('/account/login');

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
                    throw new Error('서버 API 응답 형식이 올바르지 않습니다. 관리자에게 문의해 주세요.');
                }
    
                const newImage = response[response.length - 1];
                if (!newImage || typeof newImage.value !== 'string') {
                    throw new Error('이미지 데이터 형식이 올바르지 않습니다. 다시 시도해 주세요');
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
                alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.');
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
                console.error('삭제할 이미지없음(문제없음):', error);
            }
        };

        if (ACCESS_TOKEN) {
            getUser().then(setUser).catch(console.error);
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        setIsLoading(true);
                    })
                    .catch(console.error);
            } else {
                router.push('/account/profile');
            }
            cleanupImages();
        } else {
            router.push('/account/login');
        }

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
                        k: `existing-${index}`,
                        v: url
                    })) : []);
                })
                .catch(console.error);
        }

        const handleBeforeUnload = () => {
            cleanupImages();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanupImages();
        };
    }, [ACCESS_TOKEN, PROFILE_ID, articleId]);

    useEffect(() => {
        const checkEditPermission = async () => {
            if (ACCESS_TOKEN && PROFILE_ID && articleId) {
                try {
                    const [userData, articleData] = await Promise.all([
                        getUser(),
                        getArticle(Number(articleId))
                    ]);
                    
                    const isAdmin = userData.role === 'ADMIN';
                    // const isSecurity = userData.role === 'SECURITY';
                    const isAuthor = PROFILE_ID === String(articleData.profileResponseDTO.id);
                    
                    if (isAdmin || isAuthor) {
                        setHasEditPermission(true);
                        setTitle(articleData.title);
                        setContent(articleData.content);
                        setTags(articleData.tagResponseDTOList.map((tag: any) => ({
                            id: tag.id,
                            name: tag.name
                        })));
                        setUploadedImages(articleData.urlList ? articleData.urlList.map((url: string, index: number) => ({
                            k: `existing-${index}`,
                            v: url
                        })) : []);
                    } else {
                        setError('이 게시물을 수정할 권한이 없습니다, 관리자나 작성자만 수정할 수 있습니다.');
                        setRedirectCountdown(3);
                    }
                } catch (error) {
                    console.error('Error checking edit permission:', error);
                    setError('권한 확인 중 오류가 발생했습니다.');
                    setRedirectCountdown(3);
                }
            } else {
                setError('로그인이 필요합니다.');
                setRedirectCountdown(3);
            }
        };

        checkEditPermission();
    }, [ACCESS_TOKEN, PROFILE_ID, articleId]);

    useEffect(() => {
        if (redirectCountdown !== null) {
            if (redirectCountdown > 0) {
                const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                router.back();
            }
        }
    }, [redirectCountdown, router]);

    const handleSubmit = async () => {
        if (!title.trim() || !quillInstance.current?.getEditor().getText().trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }
    
        try {
            const updatedContent = quillInstance.current?.getEditor().root.innerHTML || '';
            const sanitizedContent = DOMPurify.sanitize(updatedContent);

            const tagNames = tags.map(tag => tag.name);

    
            // // 모든 태그의 이름을 포함
            // const allTagNames = tags.map(tag => tag.name);
    
            const requestData = {
                articleId: Number(articleId),
                title,
                content: sanitizedContent,
                categoryId: Number(categoryId),
                tagName: tagNames, // 모든 태그 이름 포함
                articleTagId: deletedTagIds, // 삭제된 태그 ID
                topActive: false,
                images: uploadedImages.map(img => img.v)
            };
    
            console.log('Sending request data:', requestData); // 요청 데이터 로깅
    
            await updateArticle(requestData);
            await deleteImageList();
            router.push(`/account/article/${categoryId}/detail/${articleId}`);
        } catch (error: any) {
            console.error('게시물 수정 중 오류:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            if (error.response && error.response.status === 403) {
                setError('수정중에 오류가 발생했습니다. 관리자에게 문의 해주세요.');
            } else {
                setError('게시물 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');    
            }
        }
    };

    const handleTagChange = (newTags: Tag[]) => {
        setTags(newTags);
    };

    if (!hasEditPermission) {
        return (
            <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">접근 불가!</strong>
                        <span className="block sm:inline"> {error}</span>
                        {redirectCountdown !== null && (
                            <p>{redirectCountdown}초 후 이전 페이지로 이동합니다.</p>
                        )}
                    </div>
                </div>
            </Main>
        );
    }

    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="flex flex-1 w-full">
                <div className="bg-black w-full min-h-screen text-white flex">
                    <aside className="w-1/6 p-6 bg-gray-800 fixed absolute h-[920px]">
                        <CategoryList userRole={user?.role}/>
                    </aside>
                    <div className="p-10 ml-[400px] w-4/6">
                        <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[800px]">
                            <input
                                id='title'
                                type='text'
                                className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                                style={{ outline: '0px', color: 'black' }}
                                placeholder='제목 입력'
                                value={title}
                                onFocus={e => e.target.style.border = '2px solid red'}
                                onBlur={e => e.target.style.border = ''}
                                onChange={e => setTitle(e.target.value)}
                                onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('content') })}
                            />
                            <div className="flex flex-col" style={{ maxHeight: '800px' }}>
                                <div className="flex-grow">
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
                            </div>
                            <div className="mt-10">
                            <TagInput 
                                tags={tags} 
                                setTags={handleTagChange}
                                deletedTagIds={deletedTagIds}
                                setDeletedTagIds={setDeletedTagIds}
                            />
                            </div>
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
                </div>
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