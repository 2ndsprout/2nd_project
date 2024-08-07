'use client'

import { toggleLove } from '@/app/API/UserAPI';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface LoveButtonProps {
  articleId: number;
  initialLoveState: { isLoved: boolean; count: number };
  onLoveChange: (isLoved: boolean, count: number) => void;
}

interface LoveResponse {
  count: number;
  isLoved: boolean;
}

const LoveButton: React.FC<LoveButtonProps> = ({ articleId, initialLoveState, onLoveChange }) => {
  const [isLoved, setIsLoved] = useState(initialLoveState.isLoved);
  const [loveCount, setLoveCount] = useState(initialLoveState.count);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoved(initialLoveState.isLoved);
    setLoveCount(initialLoveState.count);
  }, [initialLoveState]);

  const handleLove = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response: LoveResponse = await toggleLove(articleId);
      console.log('Toggle love response:', response);
      
      setIsLoved(response.isLoved);
      setLoveCount(response.count);

      onLoveChange(response.isLoved, response.count);
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLove}
        disabled={isLoading}
        className={`flex items-center justify-center p-2 rounded-full bg-gray-600 transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
        }`}
      >
        <Image
          src={isLoved ? "/full-like.png" : "/empty-like.png"}
          alt={isLoved ? "좋아요 취소" : "좋아요"}
          width={24}
          height={24}
        />
      </button>
      <span className="mt-2 text-sm font-medium">{loveCount}</span>
    </div>
  );
};

export default LoveButton;