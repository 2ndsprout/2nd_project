'use client';

import { getProfile, getUser, postArticle, saveImageList } from '@/app/API/UserAPI';
import CategoryList from '@/app/Global/component/CategoryList';
import Main from "@/app/Global/layout/MainLayout";
import { KeyDownCheck, Move } from '@/app/Global/component/Method';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import { redirect, useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagInput from '../../tag/page';

interface Tag {
    id: number;
    name :string;
}

interface UploadedImage {
    key: string;
    value: string;
}

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
    const [categories, setCategories] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [localImages, setLocalImages] = useState<File[]>([]);


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

        // 페이지를 벗어날 때 업로드된 이미지 URL 배열 초기화
        return () => {
            setUploadedImages([]);
        };
    }, [ACCESS_TOKEN, PROFILE_ID]);

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLocalImages(prev => [...prev, file]);

                // Quill 에디터에 이미지 삽입 (임시 URL 사용)
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
        [],
    );

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    const Submit = async () => {
        if (!title.trim() || !quillInstance.current?.getEditor().getText().trim()) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            let uploadedImages: UploadedImage[] = [];
            if (localImages.length > 0) {
                const formData = new FormData();
                localImages.forEach((file) => {
                    formData.append('file', file);
                });
                uploadedImages = await saveImageList(formData);
            }

            let updatedContent = quillInstance.current?.getEditor().root.innerHTML || '';
            localImages.forEach((file, index) => {
                const localUrl = URL.createObjectURL(file);
                const uploadedImage = uploadedImages[index];
                if (uploadedImage && uploadedImage.value) {
                    updatedContent = updatedContent.replace(localUrl, uploadedImage.value);
                }
            });

            const requestData = {
                title,
                content: updatedContent,
                categoryId: Number(categoryId),
                tagName: tags.map(tag => tag.name),
                articleTagId: deletedTagIds,
                topActive: false,
                images: uploadedImages.map((img: UploadedImage) => img.value) // img의 형식을 명시적으로 지정
            };

            await postArticle(requestData);
            console.log("게시물 등록 완료");
            window.location.href = `/account/article/${categoryId}`;
        } catch (error) {
            console.error('게시물 작성 중 상세 오류:', error);
            if (error instanceof Error) {
                setError(`게시물 작성 중 오류가 발생했습니다: ${error.message}`);
            } else {
                setError('게시물 작성 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <Main user={user} profile={profile}>
            <div className="bg-black w-full min-h-screen text-white flex">
                <aside className="w-1/6 p-6 bg-gray-800">
                    <CategoryList />
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
                        />
                        <div style={{ overflow: 'auto', maxHeight: '700px' }}>
                        <QuillNoSSRWrapper
                            forwardedRef={quillInstance}
                            value={content}
                            onChange={setContent}
                            modules={{
                                ...modules,
                                toolbar: {
                                    ...modules.toolbar,
                                    handlers: { image: imageHandler }
                                }
                            }}
                            formats={formats}
                            theme="snow"
                            className='w-full text-black'
                            style={{ minHeight: '700px', background: 'white' }}
                            placeholder="내용을 입력해주세요."
                        />
                        {/* {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">첨부된 이미지:</h3>
                                <div className="flex flex-wrap mt-2">
                                    {imagePreviews.map((url, index) => (
                                        <img key={index} src={url} alt={`Uploaded ${index + 1}`} className="w-24 h-24 object-cover m-1 rounded" />
                                    ))}
                                </div>
                            </div>
                        )} // 이미지 미리보기 */}
                        </div>
                        <TagInput tags={tags} setTags={setTags} deletedTagIds={deletedTagIds} setDeletedTagIds={setDeletedTagIds} /> {/* 태그 입력 컴포넌트 추가 */}
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
                <aside className="w-1/6 p-6">
                </aside>
            </div>
        </Main>
    );
}
