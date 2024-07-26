'use client'
import { getArticleList, getProfile, getUser, postArticle, saveImage, saveImageList } from '@/app/API/UserAPI';
import QuillNoSSRWrapper from '@/app/Global/component/QuillNoSSRWrapper';
import { redirect } from 'next/navigation';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Page() {

    const quillInstance = useRef<ReactQuill>(null);
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(null as any);
    const [topActive, setTopActive] = useState(false);
    const [tagId, setTagId] = useState('');
    const [profile, setProfile] = useState(null as any);
    const [isModalOpen, setISModalOpen] = useState(-1);
    const [tags, setTags] = useState([] as any[]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 페이지당 게시물 수
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const [user, setUser] = useState(null as any);
    const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

    useEffect(() => {
        if (ACCESS_TOKEN)
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        else
            redirect('/account/login');
    }, [ACCESS_TOKEN]);
    
    useEffect(() => {
      if (PROFILE_ID)
          getProfile()
              .then(r => {
                  setProfile(r);
              })
              .catch(e => console.log(e));
      else
          redirect('/account/profile');
    }, [PROFILE_ID]);


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
    function addTag() {
        const tag = document.getElementById('tag') as HTMLInputElement;

        if (tag?.value) {
            const value = tag.value.replaceAll(' ', '');
            if (!tags.includes(value)) {
                tags.push(value);
                setTags([...tags]);
            }
            tag.value = '';
        }
    }
    function Regist() {
        postArticle({ categoryId: category.id, title: title, content: content, topActive: topActive, tagIdList: tags })
            .then(() => window.location.href = '/accoount/category'+ category.id)
            .catch(e => console.log(e))
    }    
    function openModal(type: number) {
        setISModalOpen(type);
    }

    return (
        <>
        <QuillNoSSRWrapper
        forwardedRef={quillInstance}
        value={content}
        onChange={(e: any) => setContent(e)}
        modules={modules}
        theme="snow"
        className='w-full'
        placeholder="내용을 입력해주세요."
    />
    </>
    );
}


{/* <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    게시물 내용 보이기 */}