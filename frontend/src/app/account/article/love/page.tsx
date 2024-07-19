import React, { useState } from 'react';
import { postLove, deleteLove } from '@/app/API/UserAPI';
import Image from 'next/image';

interface LoveButtonProps {
  articleId: number;
  initialLoved: boolean;
  onLoveChange?: (isLoved: boolean) => void;
}

const LoveButton: React.FC<LoveButtonProps> = ({ articleId, initialLoved, onLoveChange }) => {
  const [isLoved, setIsLoved] = useState(initialLoved);

  const handleLove = async () => {
    try {
        console.log('현재 좋아요 상태:', isLoved);
      if (isLoved) {
        await deleteLove(articleId);
        console.log('좋아요 삭제');
      } else {
        await postLove({ articleId });
        console.log('좋아요 추가');
      }
      const newLoveState = !isLoved;
      setIsLoved(newLoveState);
      console.log('새로운 좋아요 상태:', newLoveState);
      if (onLoveChange) {
        onLoveChange(newLoveState);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <button 
      onClick={handleLove} 
      className="flex items-center justify-center p-2 bg-gray-700 rounded-full hover:bg-yellow-400 transition-colors"
    >
      <Image
        src={isLoved ? "/full-like.png" : "/empty-like.png"}
        alt={isLoved ? "좋아요 취소" : "좋아요"}
        width={24}
        height={24}
      />
    </button>
  );
};

export default LoveButton;