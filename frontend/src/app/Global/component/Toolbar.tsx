import React from "react";
import { Editor } from "@tiptap/react";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Underline,
    Quote,
    Undo,
    Redo,
    Code,
    Image,
} from "lucide-react";
import { saveImage } from "@/app/API/UserAPI";

type Props = {
    editor: Editor | null;
}

const Toolbar = ({ editor }: Props) => {
    if (!editor) {
        return null;
    }

const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
        const fileArray = Array.from(files);

        for (const file of fileArray) {
            const formData = new FormData();
            formData.append('file', file);

            const { url: imgUrl } = await saveImage(formData);

            if (imgUrl) {
                const { state } = editor.view;
                const startPos = state.selection.from;
                const endPos = state.selection.to;

                editor.chain().focus().insertContent({
                    type: 'image',
                    attrs: {
                        src: imgUrl,
                        width: '50%',
                        height: 'auto',
                    },
                }).run();
                editor.chain().focus().setTextSelection({ from: startPos, to: endPos }).run();
            } else {
                console.error("Image URL not found in response");
            }
        }
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

    
    return (
        <div className="rounded-tl-md rounded-tr-md flex justify-between items-center gap-5 w-full flex-wrap border border-gray-400 h-10">
            <div className="flex justify-start items-center gap-10 w-full flex-wrap">
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleHeading({ level: 1 }).run();
                        }}
                        className={editor.isActive("heading", { level: 1 })
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Heading1 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleHeading({ level: 2 }).run();
                        }}
                        className={editor.isActive("heading", { level: 2 })
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Heading2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleHeading({ level: 3 }).run();
                        }}
                        className={editor.isActive("heading", { level: 3 })
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Heading3 className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleBold().run();
                        }}
                        className={editor.isActive("bold")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Bold className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleItalic().run();
                        }}
                        className={editor.isActive("italic")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Italic className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleUnderline().run();
                        }}
                        className={editor.isActive("underline")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Underline className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleStrike().run();
                        }}
                        className={editor.isActive("strike")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Strikethrough className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleBulletList().run();
                        }}
                        className={editor.isActive("bulletlist")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleOrderedList().run();
                        }}
                        className={editor.isActive("orderedlist")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <ListOrdered className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleBlockquote().run();
                        }}
                        className={editor.isActive("blockquote")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Quote className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().toggleCode().run();
                        }}
                        className={editor.isActive("code")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Code className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().undo().run();
                        }}
                        className={editor.isActive("undo")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Undo className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            editor.chain().focus().redo().run();
                        }}
                        className={editor.isActive("redo")
                            ? "bg-secondary text-white p-1 rounded-lg"
                            : "text-secondary p-1"
                        }
                    >
                        <Redo className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex gap-1">
                    <label htmlFor="input-file" className="hover:cursor-pointer text-secondary p-1">
                        <Image className="w-5 h-5" />
                    </label>
                    <input
                        type="file"
                        id="input-file"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
