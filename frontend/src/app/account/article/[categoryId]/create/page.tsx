'use client';

import { getCenterList ,deleteImageList, getProfile, getUser, postArticle, saveImageList, postTag } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import Main from "@/app/Global/layout/MainLayout";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../tag/TagInput';
import Slider from '@/app/Global/component/ArticleSlider';

interface Tag {
    id: number;
    name: string;
}

interface UploadedImage {
    k: string;
    v: string;
}

const USED_ITEMS_CATEGORY_ID = 3;

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
    const [usedItemImages, setUsedItemImages] = useState<string[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const [centerList, setCenterList] = useState([] as any[]);
    const [price, setPrice] = useState('');
    const [isUsedItemsCategory, setIsUsedItemsCategory] = useState(false);
    const [hasImages, setHasImages] = useState(false);
    const router = useRouter();
    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);

    useEffect(() => {
        setIsUsedItemsCategory(Number(categoryId) === USED_ITEMS_CATEGORY_ID);
    }, [categoryId]);

    useEffect(() => {
        const cleanupImages = async () => {
            try {
                await deleteImageList();
            } catch (error) {
                console.error('이미지 삭제 도중 오류:', error);
            }
        };

        if (ACCESS_TOKEN) {
            getUser().then(setUser).catch(console.error);
            if (PROFILE_ID) {
                getProfile()
                    .then(r => {
                        setProfile(r);
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 100);
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
                setUploadedImages(prev => [...prev, newImage]);

                if (isUsedItemsCategory) {
                    setUsedItemImages(prev => [...prev, imgUrl]);
                    setHasImages(true);
                } else {
                    const editor = quillInstance.current?.getEditor();
                    if (editor) {
                        const range = editor.getSelection();
                        if (range) {
                            editor.insertEmbed(range.index, 'image', imgUrl);
                            editor.setSelection(range.index + 1);
                        }
                    }
                }
    

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
        [isUsedItemsCategory],
    );

    const Submit = async () => {
        if (!title.trim() || !quillInstance.current?.getEditor().getText().trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }
    
        if (isUsedItemsCategory && !price) {
            setError('중고장터 게시물의 경우 가격을 입력해주세요.');
            return;
        }
    
        try {
            let finalContent = quillInstance.current?.getEditor().root.innerHTML || '';
    
            if (isUsedItemsCategory) {
                finalContent += `<p>[PRICE]${price}[/PRICE]</p>`;
                usedItemImages.forEach(imgUrl => {
                    finalContent += `<img src="${imgUrl}" style="display:none;">`;
                });
            }
            const tagNames = tags.map(tag => tag.name);
    
            const requestData = {
                title,
                content: finalContent,
                categoryId: Number(categoryId),
                tagName: tagNames,
                articleTagId: deletedTagIds,
                topActive: false,
                urlList: isUsedItemsCategory ? usedItemImages : extractImageUrls(finalContent)
            };
    
            await postArticle(requestData);
            await deleteImageList();
            window.location.href = `/account/article/${categoryId}`;
        } catch (error) {
            console.error('게시물 작성 중 오류:', error);
            setError('게시물 작성 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const extractImageUrls = (content: string) => {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const urls = [];
        let match;
        while ((match = imgRegex.exec(content)) !== null) {
            urls.push(match[1]);
        }
        return urls;
    };

    const renderContent = () => {
        if (isUsedItemsCategory && hasImages) {
            return (
                <div className="flex space-x-4">
                    <div className="w-1/2 h-120">
                        <Slider urlList={usedItemImages} />
                        <button
                            onClick={imageHandler}
                            className="w-1/4 mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            이미지 추가
                        </button>
                    </div>
                    <div className="w-1/2">
                        <input
                            id='title'
                            type='text'
                            className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                            style={{ outline: '0px', color: 'black' }}
                            placeholder='제목 입력'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('content') })}
                        />
                        <input
                            type='number'
                            className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                            placeholder='가격 입력'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                        <QuillNoSSRWrapper
                            forwardedRef={quillInstance}
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            theme="snow"
                            className='h-64 mb-4'
                            placeholder="내용을 입력해주세요."
                            style={{ minHeight: '400px'}}
                        />
                        <TagInput tags={tags} setTags={setTags} deletedTagIds={deletedTagIds} setDeletedTagIds={setDeletedTagIds} />
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <input
                        id='title'
                        type='text'
                        className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                        style={{ outline: '0px', color: 'black' }}
                        placeholder='제목 입력'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onKeyDown={e => KeyDownCheck({ preKey, setPreKey, e: e, next: () => Move('content') })}
                    />
                    {isUsedItemsCategory && (
                        <input
                            type='number'
                            className='w-full h-12 input input-bordered rounded-[0] mb-4 text-black'
                            placeholder='가격 입력'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    )}
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
                    <TagInput tags={tags} setTags={setTags} deletedTagIds={deletedTagIds} setDeletedTagIds={setDeletedTagIds} />
                </>
            );
        }
    };

    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList} >
            <div className="flex flex-1 w-full">
                <div className="bg-black w-full min-h-screen text-white flex">
                    <aside className="w-1/6 p-6 bg-gray-800 fixed absolute h-[920px]">
                        <CategoryList userRole={user?.role}/>
                    </aside>
                    <div className="p-10 ml-[400px] w-4/6">
                        <label className='text-xs text-red-500 text-start w-full mb-4'>{error}</label>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[800px]">
                            {renderContent()}
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
            </div>
        </Main>
    );
}