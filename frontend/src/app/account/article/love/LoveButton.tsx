'use client'

import { getLoveInfo, getProfile, getUser, toggleLove } from '@/app/API/UserAPI';
import Image from 'next/image';
import { redirect } from "next/navigation";
import React, { useCallback, useEffect, useState } from 'react';

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
  const [user, setUser] = useState(null as any);
  const [profile, setProfile] = useState(null as any);
  const ACCESS_TOKEN = typeof window == 'undefined' ? null : localStorage.getItem('accessToken');
  const PROFILE_ID = typeof window == 'undefined' ? null : localStorage.getItem('PROFILE_ID');

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