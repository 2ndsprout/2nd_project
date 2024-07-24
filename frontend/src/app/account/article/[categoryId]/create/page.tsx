'use client';

import { getProfile, getUser, postArticle, saveImageList } from '@/app/API/UserAPI';
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
    name :string;
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
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<number[]>([]);


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

    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.addEventListener('change', async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append('file', file);
                const result = await saveImageList(formData);
                console.log('Image upload result:', result);

                if (result && result.length > 0) {
                    const editor = quillInstance.current?.getEditor();
                    if (editor) {
                        const range = editor.getSelection();
                        if (range) {
                            // 모든 기존 이미지를 추출하고, 새로운 이미지를 삽입
                            const existingImages = editor.root.querySelectorAll('img');
                            const existingSrcs = Array.from(existingImages).map(img => img.src);

                            result.forEach((img: { key: string, value: string }) => {
                                // 중복 이미지 방지
                                if (!existingSrcs.includes(img.value)) {
                                    editor.insertEmbed(range.index, 'image', img.value);
                                    editor.setSelection(range.index + 1);
                                    setUploadedImages(prev => [...prev, img.value]); // 이미지 URL을 상태에 저장
                                }
                            });
                        }
                    }
                } else {
                    throw new Error('Invalid image data received');
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

    const formatHtmlForDatabase = (html: string): string => {
        return html.replace(/<p>/g, '').replace(/<\/p>/g, '<br>').replace(/<br><br>/g, '<br>');
    };

    const restoreHtmlFromDatabase = (html: string): string => {
        return html.replace(/<br>/g, '</p><p>').replace(/<\/p><p>/g, '<p>').replace(/^<p>/, '').replace(/<\/p>$/, '');
    };

    const Submit = () => {
        if (!title.trim()) {
            setError('제목을 입력해 주세요.');
            return;
        }
    
        const editor = quillInstance.current?.getEditor();
        if (!editor || !editor.root.innerHTML.trim()) {
            setError('내용을 입력해 주세요.');
            return;
        }
    
        const htmlContent = editor.root.innerHTML;
        const cleanedContent = formatHtmlForDatabase(htmlContent);
    
        const requestData = {
            title,
            content: cleanedContent,
            categoryId: Number(categoryId),
            tagName: tags.map(tag => tag.name), // 태그 이름 배열만 전송
            articleTagId: deletedTagIds,
            topActive: false,
            images: uploadedImages
        };
    
        postArticle(requestData)
            .then(() => {
                console.log("게시물 등록 완료");
                window.location.href = `/account/article/${categoryId}`;
            }).catch((error) => {
                console.error('게시물 작성 중 오류:', error);
                setError('게시물 작성 중 오류가 발생했습니다.');
            });
    };

    return (
        <Main user={user} profile={profile}>
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
