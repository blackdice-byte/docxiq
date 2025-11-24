import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import SuperscriptExt from "@tiptap/extension-superscript";
import SubscriptExt from "@tiptap/extension-subscript";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Undo,
  Redo,
  Code,
  Strikethrough,
  UnderlineIcon,
  Link2,
  Superscript,
  Subscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      SuperscriptExt,
      SubscriptExt,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[calc(100vh-250px)] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden">
      <div className="bg-[#1a1a1a] p-2 flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 transition-colors"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 transition-colors"
          title="Redo"
        >
          <Redo size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bulletList")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("orderedList")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bold")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("italic")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("strike")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("code")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Code"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("underline")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded transition-colors ${
            editor.isActive("link")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Insert Link"
        >
          <Link2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("superscript")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Superscript"
        >
          <Superscript size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("subscript")
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Subscript"
        >
          <Subscript size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive({ textAlign: "justify" })
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700"
          }`}
          title="Align Justify"
        >
          <AlignJustify size={18} />
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1" />

        <button
          className="p-2 rounded text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-1"
          title="Add"
        >
          <Plus size={18} />
          <span className="text-sm">Add</span>
        </button>
      </div>
      <EditorContent editor={editor} className="" />
    </div>
  );
};

export default TiptapEditor;
