import React, { useState, useEffect, useCallback } from 'react';
import { toggleLove, getLoveInfo } from '@/app/API/UserAPI';
import Image from 'next/image';

interface LoveButtonProps {
  articleId: number;
  onLoveChange?: (isLoved: boolean, count: number) => void;
}

interface LoveResponse {
  count: number;
  isLoved: boolean;
}

const LoveButton: React.FC<LoveButtonProps> = ({ articleId, onLoveChange }) => {
  const [isLoved, setIsLoved] = useState<boolean | null>(null);
  const [loveCount, setLoveCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoveInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: LoveResponse = await getLoveInfo(articleId);
      console.log('Fetched love info:', response);
      setIsLoved(response.isLoved);
      setLoveCount(response.count);
      if (onLoveChange) {
        onLoveChange(response.isLoved, response.count);
      }
    } catch (error) {
      console.error('좋아요 상태 확인 중 오류가 발생했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [articleId, onLoveChange]);

  useEffect(() => {
    fetchLoveInfo();
  }, [fetchLoveInfo]);

  const handleLove = async () => {
    if (isLoading || isLoved === null) return;

    setIsLoading(true);
    try {
      const response: LoveResponse = await toggleLove(articleId);
      console.log('Toggle love response:', response);
      
      setIsLoved(response.isLoved); // 또는 response.isLoved
      setLoveCount(response.count);

      if (onLoveChange) {
        onLoveChange(response.isLoved, response.count);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
      await fetchLoveInfo();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoved === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <button
          onClick={handleLove}
          disabled={isLoading}
          className={`flex items-center justify-center p-2 rounded-full transition-colors ${
            isLoved ? 'bg-gray-700' : 'bg-gray-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Image
            key={isLoved ? 'loved' : 'not-loved'}
            src={isLoved ? "/full-like.png" : "/empty-like.png"}
            alt={isLoved ? "좋아요 취소" : "좋아요"}
            width={24}
            height={24}
          />
        </button>
        <span className="mt-2 text-sm font-medium">{loveCount}</span>
      </div>
    </div>
  );
};

export default LoveButton;