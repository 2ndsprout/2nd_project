'use client'

import React, { useState, useEffect } from 'react';
import { getCommentList, postComment, updateComment, deleteComment, getUser, getProfile } from '@/app/API/UserAPI';
import { UpdateCommentProps, CommentProps } from '@/app/API/UserAPI';
import { redirect } from "next/navigation";
import LoveButton from '../love/LoveButton';
import Image from 'next/image';
import useConfirm from '@/app/Global/hook/useConfirm';
import useAlert from '@/app/Global/hook/useAlert';
import ConfirmModal from '@/app/Global/component/ConfirmModal';

interface CommentListProps {
    articleId: number;
  }

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

const CommentList: React.FC<CommentListProps> = ({ articleId }) => {

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
    const [loveCount, setLoveCount] = useState(0);
    const [totalLoves, setTotalLoves] = useState(0);
    const { confirmState, finalConfirm, closeConfirm } = useConfirm();
    const { showAlert } = useAlert();

    const countTotalComments = (commentList: CommentResponseDTO[]): number => {
        return commentList.reduce((total, comment) => {
            return total + 1 + countTotalComments(comment.commentResponseDTOList);
        }, 0);
    };

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
        fetchComments();
    }, [articleId, currentPage]);

    const fetchComments = async () => {
        try {
            const response: PaginatedResponse = await getCommentList({ articleId, page: currentPage });
            setComments(response.content);
            setTotalPages(Math.max(1, response.totalPages)); // 최소값을 1로 설정
            setTotalElements(response.totalElements);
            //setTotalPages(response.totalPages));

            // 전체 댓글 수 계산 (첫 페이지에서만 수행)
            if (currentPage === 0) {
                const totalCount = calculateTotalComments(response);
                setTotalComments(totalCount);
            }
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다 :', error);
        }
    };

    const calculateTotalComments = (response: PaginatedResponse): number => {
        return response.totalElements;
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
                closeConfirm();
                fetchComments();
            } catch (error) {
                console.error('댓글을 수정하는데 실패했습니다 :', error);
                closeConfirm();
                showAlert('댓글을 수정하는데 실패했습니다');
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            closeConfirm();
            fetchComments();
        } catch (error) {
            console.error('댓글을 삭제하는데 실패했습니다 :', error);
            closeConfirm();
            showAlert('댓글을 삭제하는데 실패했습니다');
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

    const handleLoveChange = (isLoved: boolean, count: number) => {
        setTotalLoves(count);
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
                        <button onClick={() => finalConfirm(user?.username, '해당 댓글를 수정하시겠습니까?', '수정', () => handleEditComment(comment.id))} className="mr-2 text-blue-500">저장</button>
                    ) : (
                        <button onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                        }} className="mr-2 text-blue-500">수정</button>
                    )}
                    <button onClick={() => finalConfirm(user?.username, '해당 댓글를 삭제하시겠습니까?', '삭제', () => handleDeleteComment(comment.id))} className="mr-2 text-red-500">삭제</button>
                    <ConfirmModal title={confirmState?.title} content={confirmState?.content} confirm={confirmState?.confirm} show={confirmState?.show} onConfirm={confirmState?.onConfirm} onClose={closeConfirm} />
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
        <div className="w-full flex justify-between">
            <div className="w-1/6 flex flex-col items-center justify-start pt-4">
                <div className="flex items-center justify-center w-full px-4">
                    <LoveButton
                        articleId={articleId}
                        onLoveChange={handleLoveChange}
                    />
                    <div className="flex flex-col items-center ml-5">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Image
                                src="/icon-comment.png"
                                alt="댓글 아이콘"
                                width={24}
                                height={24}
                            />
                        </div>
                        <span className="mt-2 text-sm font-medium">{totalComments}</span>
                    </div>
                </div>
            </div>
            <div className="w-4/6">
                <form onSubmit={handleSubmitComment} className="mb-4 flex items-stretch">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full h-15 p-2 border rounded mr-2 bg-gray-700 text-white"
                        placeholder="댓글을 입력하세요..."
                    />
                    <button type="submit" className="w-[80px] bg-yellow-600 text-white p-2 rounded hover:bg-yellow-400 whitespace-nowrap text-base">
                        작성
                    </button>
                </form>
                <ul>
                    {comments.map(comment => comment.parentId === null && renderComment(comment))}
                </ul>
                {totalComments > 0 && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                            disabled={currentPage === 0}
                            className="mr-2 px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-400"
                        >
                            이전
                        </button>
                        <span className="mx-4 mt-2">
                            페이지 {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="ml-2 px-4 py-2 bg-yellow-600 text-white rounded disabled:bg-gray-400"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
            <div className="w-1/6"></div>
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