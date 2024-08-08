'use client';

import { getArticle, getCenterList, getProfile, getUser, saveImageList, updateArticle, deleteImageList, getCategory } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import Main from "@/app/Global/layout/MainLayout";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../../tag/TagInput';
import Slider from '@/app/Global/component/ArticleSlider';

const USED_ITEMS_CATEGORY_NAME = "중고장터";

interface Tag {
    id: number;
    name: string;
}

interface UploadedImage {
    k: string;
    v: string;
}

interface ConstrainedSliderProps {
    urlList: string[];
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
    const [hasImages, setHasImages] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [isUsedItemsCategory, setIsUsedItemsCategory] = useState(false);
    const [price, setPrice] = useState('');
    const [usedItemImages, setUsedItemImages] = useState<string[]>([]);
    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchCategoryInfo = async () => {
            try {
                const categoryData = await getCategory(Number(categoryId));
                setCategoryName(categoryData.name);
                setIsUsedItemsCategory(categoryData.name === USED_ITEMS_CATEGORY_NAME);
            } catch (error) {
                console.error('카테고리 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchCategoryInfo();
    }, [categoryId]);

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
                    if (isUsedItemsCategory) {
                        const extractedPrice = extractPrice(article.content);
                        setPrice(extractedPrice || '');
                        const extractedImages = extractImageUrls(article.content);
                        setUsedItemImages(extractedImages);
                        setHasImages(extractedImages.length > 0);
                        setContent(removeImagesAndPrice(article.content));
                    }
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
    }, [ACCESS_TOKEN, PROFILE_ID, articleId, isUsedItemsCategory]);

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
                redirect('/account/profile');
            }
            cleanupImages();
        } else {
            redirect('/account/login');
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
    
        if (isUsedItemsCategory && !price) {
            setError('중고장터 게시물의 경우 가격을 입력해주세요.');
            return;
        }
    
        try {
            let finalContent = isUsedItemsCategory 
                ? content 
                : quillInstance.current?.getEditor().root.innerHTML || '';
    
            if (isUsedItemsCategory) {
                finalContent += `<p>[PRICE]${price}[/PRICE]</p>`;
                usedItemImages.forEach(imgUrl => {
                    finalContent += `<img src="${imgUrl}" style="display:none;">`;
                });
            }
            const tagNames = tags.map(tag => tag.name);
    
            const requestData = {
                articleId: Number(articleId),
                title,
                content: finalContent,
                categoryId: Number(categoryId),
                tagName: tagNames,
                articleTagId: deletedTagIds,
                topActive: false,
                urlList: isUsedItemsCategory ? usedItemImages : extractImageUrls(finalContent)
            };
    
            await updateArticle(requestData);
            await deleteImageList();
            router.push(`/account/article/${categoryId}/detail/${articleId}`);
        } catch (error: any) {
            console.error('게시물 수정 중 오류:', error);
            setError('게시물 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    const extractPrice = (content: string) => {
        const priceMatch = content.match(/\[PRICE\](.*?)\[\/PRICE\]/);
        return priceMatch ? priceMatch[1] : null;
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

    const handleTagChange = (newTags: Tag[]) => {
        setTags(newTags);
    };

    const removeImagesAndPrice = (content: string) => {
        return content.replace(/<img[^>]+>/g, '')
                      .replace(/\[PRICE\].*?\[\/PRICE\]/g, '')
                      .trim();
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

    const renderContent = () => {
        const quillStyle = {
            height: isUsedItemsCategory ? '400px' : '600px',
            marginBottom: '20px'
        };

        const commonInputs = (
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
                    <div className="relative mb-4">
                        <input
                            type='text'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            className='w-full h-12 input input-bordered rounded-[0] pr-8 text-black'
                            style={{ outline: '0px', color: 'black' }}
                            placeholder='가격 입력'
                            value={price}
                            onChange={e => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                                setPrice(onlyNums);
                            }}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            원
                        </span>
                    </div>
                )}
            </>
        );

        const editor = (
            <div className="flex flex-col flex-grow">
                <QuillNoSSRWrapper
                    forwardedRef={quillInstance}
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    theme="snow"
                    placeholder="내용을 입력해주세요."
                    style={quillStyle}
                />
                <div className="mt-4">
                    <TagInput 
                        tags={tags} 
                        setTags={handleTagChange}
                        deletedTagIds={deletedTagIds}
                        setDeletedTagIds={setDeletedTagIds}
                    />
                </div>
            </div>
        );

        if (isUsedItemsCategory && hasImages) {
            return (
                <div className="flex space-x-4">
                    <div className="w-1/2 flex flex-col">
                        <Slider urlList={usedItemImages} />
                        <button
                            onClick={imageHandler}
                            className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            이미지 추가
                        </button>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        {commonInputs}
                        {editor}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col h-full">
                    {commonInputs}
                    {editor}
                </div>
            );
        }
    };

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
                            {renderContent()}
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