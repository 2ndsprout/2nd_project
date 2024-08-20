'use client'

import React, { useState } from "react";
import Tiptap from "./Tiptap";

const Editor = () => {
    const [content, setContent] = useState<string | null>(null);
    
    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { content };
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full place-items-center mx-auto h-full">
            <div className='w-full h-full flex flex-col'>
                <Tiptap
                    content={content}
                    onChange={handleContentChange}
                />
            </div>
        </form>
    );
}

export default Editor;
