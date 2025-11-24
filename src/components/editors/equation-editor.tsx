import { useState } from "react";
import { Editor, Viewer } from "react-latex-editor";
import "react-latex-editor/styles";

export function EquationEditor() {
  const [content, setContent] = useState("<p>Start typing...</p>");
  return (
    <div className="h-[calc(100vh-180px)] relative">
      <Editor
        placeholder="Paste equations from ChatGPT, Word, Google Docs..."
        initialContent={content}
        onChange={setContent}
        className="h-full text-black"
      />
      
      {/* Floating Viewer */}
      <div className="fixed bottom-4 right-4 w-[400px] h-[400px] bg-white border border-gray-300 rounded-lg shadow-2xl overflow-auto z-50">
        <div className="bg-gray-800 text-white px-4 py-2 font-semibold sticky top-0">
          Preview
        </div>
        <div className="p-4">
          <Viewer
            content={content}
            className="my-viewer"
            contentClassName="custom-content"
            enableMath={true}
            mathJaxConfig={{
              inlineMath: [["$", "$"]],
              displayMath: [["$$", "$$"]],
              packages: ["base", "ams"],
            }}
          />
        </div>
      </div>
    </div>
  );
}
