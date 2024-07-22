import React, { useState, useEffect } from 'react';
import { getCommentList, postComment, updateComment, deleteComment, getUser, getProfile } from '@/app/API/UserAPI';
import { UpdateCommentProps, CommentProps, GetCommentListProps } from '@/app/API/UserAPI';
import { redirect } from "next/navigation";
import LoveButton from '../love/page';

interface CommentResponseDTO {
    id: number;
    articleId: number;
    content: string;
    createDate: number;
    parentId: number | null;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    commentResponseDTOList: CommentResponseDTO[];
}

interface PaginatedResponse {
    content: CommentResponseDTO[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

const CommentList = ({ articleId }: { articleId: number }) => {
    const [comments, setComments] = useState<CommentResponseDTO[]>([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const [isLoved, setIsLoved] = useState(false);

    const countTotalComments = (commentList: CommentResponseDTO[]): number => {
        return commentList.reduce((total, comment) => {
            return total + 1 + countTotalComments(comment.commentResponseDTOList);
        }, 0);
    };

    // const checkLoveStatus = async () => {
    //     try {
            // 여기에 좋아요 상태를 확인하는 API 호출을 추가예정
            // const response = await getLoveStatus(articleId);
            // setIsLoved(response.isLoved);
    //     } catch (error) {
    //         console.error('좋아요 상태 확인 중 오류 발생:', error);
    //     }
    // };

    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser()
                .then(r => {
                    setUser(r);
                })
                .catch(e => console.log(e));
        } else {
            redirect('/account/login');
        }
    }, [ACCESS_TOKEN]);

    useEffect(() => {
        if (PROFILE_ID) {
            getProfile()
                .then(r => {
                    setProfile(r);
                })
                .catch(e => console.log(e));
        } else {
            redirect('/account/profile');
        }
    }, [PROFILE_ID]);

    useEffect(() => {
        fetchComments();
    }, [articleId, currentPage]);

    const fetchComments = async () => {
        try {
            const response: PaginatedResponse = await getCommentList({ articleId, page: currentPage });
            setComments(response.content);
            setTotalPages(response.totalPages);
            const totalCount = countTotalComments(response.content);
            setTotalComments(totalCount);
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다 :', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const commentRequestDTO: CommentProps = {
                    articleId: articleId,
                    content: newComment,
                    parentId: null
                };
                await postComment(commentRequestDTO);
                setNewComment('');
                fetchComments();
            } catch (error) {
                console.error('댓글을 등록하는데 실패했습니다 :', error);
            }
        }
    };

    const handleEditComment = async (commentId: number) => {
        if (editContent.trim()) {
            try {
                const updateCommentDTO: UpdateCommentProps = {
                    profileId: Number(localStorage.getItem('PROFILE_ID')),
                    commentId: commentId,
                    content: editContent
                };
                await updateComment(updateCommentDTO);
                setEditingCommentId(null);
                fetchComments();
            } catch (error) {
                console.error('댓글을 수정하는데 실패했습니다 :', error);
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            fetchComments();
        } catch (error) {
            console.error('댓글을 삭제하는데 실패했습니다 :', error);
        }
    };

    const handleReply = async (parentId: number) => {
        if (replyContent.trim()) {
            try {
                const commentRequestDTO: CommentProps = {
                    articleId: articleId,
                    parentId: parentId,
                    content: replyContent
                };
                await postComment(commentRequestDTO);
                setReplyingToId(null);
                setReplyContent('');
                fetchComments();
            } catch (error) {
                console.error('답글을 다는데 실패했습니다 :', error);
            }
        }
    };
    
    const handleLoveChange = (newLoveState: boolean) => {
        setIsLoved(newLoveState);
    };

    const renderComment = (comment: CommentResponseDTO, depth = 0) => (
        <li key={comment.id} className={`mb-4 ${depth > 0 ? 'ml-8 relative' : ''}`}>
            {depth > 0 && (
                <div className="absolute left-[-2rem] top-0 bottom-0 w-8 boomerang-line"></div>
            )}
            <div className={`p-3 rounded bg-gray-800 ${depth > 0 ? 'border-l-4 border-blue-500' : ''}`}>
                {editingCommentId === comment.id ? (
                    <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="bg-gray-700 w-full text-white p-2 border rounded"
                    />
                ) : (
                    <p>{comment.content}</p>
                )}
                <small>{comment.profileResponseDTO.name} - {new Date(comment.createDate).toLocaleString()}</small>
                <div className="mt-2">
                    {editingCommentId === comment.id ? (
                        <button onClick={() => handleEditComment(comment.id)} className="mr-2 text-blue-500">저장</button>
                    ) : (
                        <button onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                        }} className="mr-2 text-blue-500">수정</button>
                    )}
                    <button onClick={() => handleDeleteComment(comment.id)} className="mr-2 text-red-500">삭제</button>
                    <button onClick={() => setReplyingToId(comment.id)} className="text-green-500">답글</button>
                </div>
            </div>
            {replyingToId === comment.id && (
                <div className="flex mt-2 ml-8">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-gray-700 text-white w-4/6 h-12 mr-2 p-2 border rounded"
                        placeholder="답글을 입력하세요..."
                    />
                    <button onClick={() => handleReply(comment.id)} className="bg-yellow-600 hover:bg-yellow-400 text-white px-4 py-2 rounded">작성</button>
                </div>
            )}
            {comment.commentResponseDTOList && comment.commentResponseDTOList.length > 0 && (
                <ul className="mt-2">
                    {comment.commentResponseDTOList.map(reply => renderComment(reply, depth + 1))}
                </ul>
            )}
        </li>
    );

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-2 flex flex-col items-center">
                <div className="flex items-center space-x-4 mt-5">
                    <div className="flex flex-col items-center ml-4 mr-2">
                        <LoveButton 
                            articleId={articleId} 
                            initialLoved={isLoved} 
                            onLoveChange={handleLoveChange}
                        />
                        <p className="mt-2">예정</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src="/icon-comment.png" alt="댓글 아이콘" className="w-9 h-9 mb-1" />
                        <p className="mt-2">{totalComments}</p>
                    </div>
                </div>
            </aside>
            <div className="w-full p-10">
                {/* <h3 className="text-xl font-bold mb-4">댓글 ({totalComments})</h3> */}
                <form onSubmit={handleSubmitComment} className="mb-4 flex items-start">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full h-15 p-2 border rounded mr-2 bg-gray-700 text-white"
                        placeholder="댓글을 입력하세요..."
                    />
                    <button type="submit" className="bg-yellow-600 text-white p-5 rounded hover:bg-yellow-400 whitespace-nowrap">
                        작성
                    </button>
                </form>
                <ul>
                    {comments.map(comment => comment.parentId === null && renderComment(comment))}
                </ul>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        이전
                    </button>
                    <span className="mx-4">
                        페이지 {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        다음
                    </button>
                </div>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-center">
                {/* 우측 aside 내용 */}
            </aside>
            <style jsx>{`
                .boomerang-line {
                    border-left: 2px solid #4A5568;
                    border-bottom: 2px solid #4A5568;
                    border-bottom-left-radius: 10px;
                }
                .boomerang-line::before {
                    content: '';
                    position: absolute;
                    top: 20px;
                    left: -2px;
                    width: 100%;
                    height: calc(100% - 20px);
                    border-left: 2px solid #4A5568;
                }
            `}</style>
        </div>
    );
};

export default CommentList;