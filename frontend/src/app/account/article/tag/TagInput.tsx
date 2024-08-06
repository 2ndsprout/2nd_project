'use client';

import { useState, useEffect } from 'react';
import { getUser, getProfile} from '@/app/API/UserAPI';
import { redirect, useRouter } from 'next/navigation';
import { postTag, getTag } from '@/app/API/UserAPI';

interface Tag {
    id: number;
    name: string;
    articleTagId?: number;
}

interface TagInputProps {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    deletedTagIds: number[];
    setDeletedTagIds: (ids: number[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, deletedTagIds, setDeletedTagIds }) => {
    const [input, setInput] = useState('');
    const [user, setUser] = useState(null as any);
    const [profile, setProfile] = useState(null as any);
    const ACCESS_TOKEN = typeof window === 'undefined' ? null : localStorage.getItem('accessToken');
    const PROFILE_ID = typeof window === 'undefined' ? null : localStorage.getItem('PROFILE_ID');
    const router = useRouter();
    useEffect(() => {
        if (ACCESS_TOKEN) {
            getUser().then(r => setUser(r)).catch(e => console.log(e));
            if (PROFILE_ID)
                getProfile().then(r => setProfile(r)).catch(e => console.log(e));
            else
            router.push('/account/profile');
        }
        else
        router.push('/account/login');
    }, [ACCESS_TOKEN, PROFILE_ID]);

    useEffect(() => {
        console.log('Current tags:', tags);
        console.log('Deleted tag IDs:', deletedTagIds);
    }, [tags, deletedTagIds]);

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            const newTag = input.trim();
            if (!tags.some(tag => tag.name === newTag)) {
                setTags([...tags, { id: 0, name: newTag}]);
                setInput('');
                // setTags([...tags, { id: 0, name: newTag }]);
                // setInput('');
            }
            event.preventDefault();
        }
    };

    const handleDeleteTag = (tagToDelete: Tag) => {
        const updatedTags = tags.filter(tag => tag.id !== tagToDelete.id);
        setTags(updatedTags);
        
        if (tagToDelete.id !== 0) {
            setDeletedTagIds([...deletedTagIds, tagToDelete.id]);
        }
    };


    return (
        <div className="flex">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="태그를 입력해주세요..."
                className="border p-2 rounded text-white mr-5"
            />
            <div className="mt-2">
                {tags.map((tag, index) => (
                    <span key={index} className="tag bg-black hover:bg-gray-600 p-2 rounded mr-2 text-white text-base">
                        #{tag.name}
                        <button
                            onClick={() => handleDeleteTag(tag)}
                            className="ml-2 text-red-500"
                        >
                            X
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagInput;