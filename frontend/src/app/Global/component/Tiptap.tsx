import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import dynamic from 'next/dynamic';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';

const Tiptap = ({ onChange, content }: any) => {
    const [editorContent, setEditorContent] = useState(content);

    const handleChange = (newContent: string) => {
        onChange(newContent);
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Youtube,
            Link,
            Image,
            Highlight,
            Typography,
        ],
        editorProps: {
            attributes: {
                class: "flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-white items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            handleChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(editorContent);
        }
    }, [editor, editorContent]);

    useEffect(() => {
        setEditorContent(content);
    }, [content]);

    return (
        <div className='w-full h-full flex flex-col'>
            <Toolbar editor={editor} />
            <div className='flex-1 overflow-hidden'>
                <EditorContent
                    editor={editor}
                    style={{ whiteSpace: "pre-line", height: "100%", overflowY: "auto" }}
                    className='border-b border-r border-l border-gray-400 rounded-b-lg'
                />
            </div>
        </div>
    );
}

export default dynamic(() => Promise.resolve(Tiptap), { ssr: false });
