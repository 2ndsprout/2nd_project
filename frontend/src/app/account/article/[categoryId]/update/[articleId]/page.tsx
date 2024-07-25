'use client';

import { getArticle, getProfile, getUser, saveImage, saveImageList, updateArticle } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import Main from "@/app/Global/layout/MainLayout";
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import TagInput from '../../../tag/page';
import DOMPurify from 'dompurify';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Tag {
    id: number;
    name: string;
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
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const ACCESS_TOKEN = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const PROFILE_ID = typeof window !== 'undefined' ? localStorage.getItem('PROFILE_ID') : null;
    const quillInstance = useRef<ReactQuill>(null);
    const router = useRouter();

    const BACKEND_URL = 'http://localhost:8080'; // 로컬 백엔드 서버 URL, 배포 시 변경 필요

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
    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        if (articleId) {
            getArticle(Number(articleId))
                .then(article => {
                    setTitle(article.title);
                    setContent(processContent(article.content));
                    setTags(article.tagResponseDTOList.map((tag: any) => ({
                        id: tag.id,
                        name: tag.name
                    })));
                    setUploadedImages(article.urlList || []);
                })
                .catch(e => console.log(e));
        }
    }, [articleId]);

    const processContent = (content: string) => {
        return content.replace(/src="\/api/g, `src="${BACKEND_URL}/api`);
    };

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
                try {
                    result = await saveImageList(file);
                } catch (error) {
                    console.error('Error in saveImageList, trying saveImage:', error);
                    result = await saveImage(file);
                }

                if (result && result.url) {
                    const editor = (quillInstance?.current as any).getEditor();
                    const range = editor.getSelection();
                    const imageUrl = `${BACKEND_URL}${result.url}`;
                    editor.insertEmbed(range.index, 'image', imageUrl);
                    editor.setSelection(range.index + 1);
                    setUploadedImages(prev => [...prev, imageUrl]);
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

    function handleSubmit() {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }

        const sanitizedContent = DOMPurify.sanitize(content);

        const requestData = {
            articleId: Number(articleId),
            title,
            categoryId: Number(categoryId),
            content: sanitizedContent,
            tagName: tags.map(tag => tag.name),
            articleTagId: deletedTagIds,
            topActive: false,
            images: uploadedImages
        };

        console.log('Updating article with data:', requestData);

        updateArticle(requestData)
            .then(() => {
                console.log("게시물 수정 완료");
                router.push(`/account/article/${categoryId}/detail/${articleId}`);
            })
            .catch((error) => {
                console.error('게시물 수정 중 오류:', error);
                setError('게시물 수정 중 오류가 발생했습니다.');
            });
    }

    const confirmEdit = () => {
        setShowEditConfirm(true);
    };

    return (
        <Main user={user} profile={profile}>
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
                        forwardedRef={quillInstance}
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        theme="snow"
                        className='w-full text-black overflow-auto'
                        style={{ minHeight: '500px', background: 'white' }}
                        placeholder="내용을 입력해주세요."
                    />
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
                        onClick={confirmEdit}
                    >
                        수정
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6">
            </aside>
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
        </Main>
    );
}