import React, { useState, useEffect } from 'react';
import { getCommentList, postComment, updateComment, deleteComment, getUser, getProfile } from '@/app/API/UserAPI';
import { redirect } from "next/navigation";

interface CommentResponseDTO {
    id: number;
    content: string;
    createDate: number;
    profileResponseDTO: {
        id: number;
        name: string;
        username: string;
        url: string | null;
    };
    children?: CommentResponseDTO[];
}

interface CommentRequestDTO {
    articleId: number;
    parentId: number;
    content: string;
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
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');

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
    }, [articleId]);

    const fetchComments = async () => {
        try {
            const response = await getCommentList(articleId);
            setComments(response);
        } catch (error) {
            console.error('댓글을 불러오는데 실패했습니다 :', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const commentRequestDTO: CommentRequestDTO = {
                    articleId: articleId,
                    content: newComment,
                    parentId: 0
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
                const updateCommentDTO = {
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
                const commentRequestDTO: CommentRequestDTO = {
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

    const renderComment = (comment: CommentResponseDTO, depth = 0) => (
        <li key={comment.id} className={`mb-4 ${depth > 0 ? `ml-${depth * 4}` : ''}`}>
            <div className="bg-gray-800 text-white p-3 rounded">
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
                <div className={`flex mt-2 ml-${(depth + 1) * 4} mt-4`}>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-gray-700 text-white w-4/6 h-12 ml-10 mr-2 p-2 border rounded"
                        placeholder="답글을 입력하세요..."
                    />
                    <button onClick={() => handleReply(comment.id)} className="bg-yellow-600 hover:bg-yellow-400 text-white px-4 py-2 rounded">작성</button>
                </div>
            )}
            {comment.children && comment.children.length > 0 && (
                <ul className="mt-2">
                    {comment.children.map(reply => renderComment(reply, depth + 1))}
                </ul>
            )}
        </li>
    );

    return (
        <div className="bg-black w-full min-h-screen text-white flex">
            <aside className="w-1/6 p-6 flex flex-col items-center">
                {/* 좌측 aside 내용 */}
            </aside>
            <div className="w-full p-10">
                <h3 className="text-xl font-bold mb-4">댓글</h3>
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
                    {comments.map(comment => renderComment(comment))}
                </ul>
            </div>
            <aside className="w-1/6 p-6 flex flex-col items-center">
                {/* 우측 aside 내용 */}
            </aside>
        </div>
    );
};

export default CommentList;