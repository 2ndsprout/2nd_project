'use client'


import { deleteArticle, getArticle, getCenterList, getProfile, getUser, getTag } from '@/app/API/UserAPI';
import { getDateTimeFormat } from '@/app/Global/component/Method';
import Main from "@/app/Global/layout/MainLayout";
import Link from 'next/link';
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import CommentList from '../../../comment/CommentList';
import Slider from '@/app/Global/component/ArticleSlider';

interface Tag {
    id: number;
    name: string;
}

interface Article {
    articleId: number;
    title: string;
    content: string;
    createDate: number;
    categoryName: string;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    urlList: string[] | null;
    topActive: boolean;
    tagResponseDTOList: Tag[];
}

const USED_ITEMS_CATEGORY_NAME = "중고장터"; // 중고장터 카테고리 이름

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
    console.log("Extracted Image URLs:", urls);  // 디버깅용 로그
    return urls;
};

const removeImagesFromContent = (content: string) => {
    return content.replace(/<img[^>]+>/g, '').trim();
};

export default function ArticleDetail() {
    const { categoryId, articleId } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [user, setUser] = useState(null as any);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null as any);
    const [ isDeleted, setIsDeleted ] = useState(false);
    const [centerList, setCenterList] = useState([] as any[]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [ hasEditPermission, setHasEditPermission ] = useState(false);
    const [isUsedItemsCategory, setIsUsedItemsCategory] = useState(false);
    const price = article ? extractPrice(article.content) : null;
    const imageUrls = article ? extractImageUrls(article.content) : [];
    const contentWithoutImages = article ? removeImagesFromContent(article.content) : '';

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
                        getCenterList()
                            .then(r => {
                                setCenterList(r);
                            })
                            .catch(e => console.log(e));
                        const interval = setInterval(() => { setIsLoading(true); clearInterval(interval) }, 300);
                    })
                    .catch(e => console.log(e));
            else
            redirect('/account/profile');
        }
        else
        redirect('/account/login');

    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        console.log("User changed:", user);
        console.log("Article changed:", article);
        console.log("PROFILE_ID:", PROFILE_ID);
        
        if (user && article && PROFILE_ID) {
            const isAuthor = PROFILE_ID === String(article.profileResponseDTO.id);
            
            setHasEditPermission(isAuthor);
        }
    }, [user, article, PROFILE_ID]);

    useEffect(() => {
        if (article) {
            console.log("Full article object:", article);
            console.log("Article Category Name:", article.categoryName);
            
            const isUsedItems = article.categoryName === USED_ITEMS_CATEGORY_NAME;
            setIsUsedItemsCategory(isUsedItems);
            
            console.log("Is Used Items Category:", isUsedItems);
        }
    }, [article]);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (articleId) {
                    const fetchedArticle = await getArticle(Number(articleId));
                    console.log("Fetched article:", fetchedArticle);
                    if (fetchedArticle) {
                        const tagPromises = fetchedArticle.tagResponseDTOList.map((tag: Tag) => getTag(tag.id));
                        const tagDetails = await Promise.all(tagPromises);
                        setArticle((prev: Article | null): Article => {
                            const newArticle = {
                                ...fetchedArticle,
                                tagResponseDTOList: tagDetails
                            };
                            console.log("Setting article state:", newArticle);
                            return newArticle;
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        };
    
        fetchArticle();
    }, [articleId]);

    const renderContent = () => {
        if (!article) return null;

        const price = extractPrice(article.content);
        const imageUrls = extractImageUrls(article.content);
        const contentWithoutImages = removeImagesFromContent(article.content);

        console.log("Rendering content for article:", article.articleId);
        console.log("Article Category Name:", article.categoryName);
        console.log("Is Used Items Category:", isUsedItemsCategory);
        console.log("Extracted Price:", price);
        console.log("Image URLs:", imageUrls);

        if (isUsedItemsCategory) {
            return (
                <div className="flex">
                    <div className="w-1/2">
                        <Slider urlList={imageUrls} />
                    </div>
                    <div className="w-1/2 p-6">
                        {price && <p className="text-xl text-yellow-500 mb-4">가격: {price}원</p>}
                        <div dangerouslySetInnerHTML={{ __html: contentWithoutImages.replace(/\[PRICE\].*?\[\/PRICE\]/g, '') }} />
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
            );
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            if (articleId) {
                await deleteArticle(Number(articleId));
                console.log("게시물이 성공적으로 삭제되었습니다.");
                setIsDeleted(true);
                setShowDeleteConfirm(false);
                setTimeout(() => {
                    router.push(`/account/article/${categoryId}`);
                }, 100);
            }
        } catch (error) {
            console.error('게시물 삭제 중 오류 발생:', error);
            setError('게시물 삭제 중 오류가 발생했습니다.');
        }
    };

    if (isDeleted) {
        return <div className="flex items-center justify-center h-screen text-gray-400">게시물이 삭제되었습니다.</div>;
    }

    if (!article) {
        return <div className="flex items-center justify-center h-screen text-gray-400">게시물을 불러오는 중입니다...</div>;
    }

    const content = (
        <div className="flex flex-col w-full">
            {isUsedItemsCategory ? (
                <>
                    <div className="w-full p-6">
                        <h1 className="text-3xl font-bold mb-4 text-center">{article.title}</h1>
                        <p className="text-sm text-gray-400 mb-6 text-right">{getDateTimeFormat(article.createDate)}</p>
                    </div>
                    <div className="flex w-full">
                        <div className="w-[45%] mr-6">
                            <div className="w-full h-[600px]">
                            <Slider urlList={imageUrls} />
                            </div>
                        </div>
                        <div className="w-[55%] p-6 bg-gray-800 rounded-lg shadow-lg">
                            {price && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-yellow-500">가격: {price}원</h2>
                                </div>
                            )}
                            <div className="prose prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: contentWithoutImages.replace(/\[PRICE\].*?\[\/PRICE\]/g, '') }} />
                            </div>
                            <div className="mt-6">
                                <ul className="flex flex-wrap">
                                    {article.tagResponseDTOList.map(tag => (
                                        <li key={tag.id} className="bg-gray-700 text-white rounded-full px-3 py-1 text-sm mr-2 mb-2">
                                            #{tag.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4 text-center">{article.title}</h1>
                        <p className="text-sm text-gray-400 mb-6 text-right">{getDateTimeFormat(article.createDate)}</p>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-lg shadow-lg min-h-[600px]">
                        <div className="prose prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>
                        <div className="mt-6">
                            <ul className="flex flex-wrap">
                                {article.tagResponseDTOList.map(tag => (
                                    <li key={tag.id} className="bg-gray-700 text-white rounded-full px-3 py-1 text-sm mr-2 mb-2">
                                        #{tag.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {article?.topActive === false ? <div className="w-full mt-6">
                <CommentList articleId={Number(articleId)} />
            </div> : null}
        </div>
    );
    
    return (
        <Main user={user} profile={profile} isLoading={isLoading} centerList={centerList}>
            <div className="flex w-full">
                <aside className="w-1/6 p-6 flex flex-col items-center">
                    <div className="mt-5 flex flex-col items-center">
                        <img src='/user.png' className='w-16 h-16 mb-2 rounded-full' alt="프로필" />
                        <div className="mt-2 text-lg font-semibold">{article.profileResponseDTO.name || '알 수 없음'}</div>
                    </div>
                </aside>
                <div className="w-4/6">
                    {content}
                </div>
                <aside className="w-1/6 p-6 flex flex-col items-start">
                    {hasEditPermission && (
                        <div className="relative" id="dropdown">
                            {article?.topActive === false ? <button onClick={toggleDropdown} className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600">
                                <span className="text-white">⁝</span>
                            </button> : null}
                            {dropdownOpen && (
                                <div className="absolute mt-2 bg-gray-800 rounded shadow-lg overflow-hidden">
                                    <div className="flex flex-col w-20">
                                        <Link 
                                            href={`/account/article/${categoryId}/update/${article.articleId}`} 
                                            className="block w-full px-4 py-2 text-sm text-white text-center hover:bg-yellow-600 transition-colors"
                                        >
                                            수정
                                        </Link>
                                        <button 
                                            onClick={handleDelete} 
                                            className="block w-full px-4 py-2 text-sm text-white text-center hover:bg-yellow-600 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-5 rounded shadow-lg">
                        <div className="text-lg font-semibold text-white">삭제 확인</div>
                        <p className="text-gray-400">이 게시물을 삭제하시겠습니까?</p>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setShowDeleteConfirm(false)} className="mr-2 p-2 bg-gray-600 rounded text-white hover:bg-gray-500">취소</button>
                            <button onClick={confirmDelete} className="p-2 bg-red-600 rounded text-white hover:bg-red-500">삭제</button>
                        </div>
                    </div>
                </div>
            )}
        </Main>
    );
}
